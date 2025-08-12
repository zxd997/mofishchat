import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { wsService, MESSAGE_TYPES } from '@/services/websocket'
import chatApi from '@/services/chatApi'
import { useUserStore } from '@/stores/user'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref([])
  const currentTopic = ref('今天你装忙了吗？')
  const topicHistory = ref([
    '你见过最奇葩的加班理由是什么？',
    '如果可以给老板一个建议，你会说什么？',
    '上班时间你做过最勇敢的事是什么？',
    '形容一下你的工作状态用一个emoji'
  ])
  const robotMessages = ref([])
  const onlineUsers = ref([])
  const isConnected = ref(false)
  const connectionStatus = ref('disconnected') // disconnected, connecting, connected
  
  // 计算属性
  const latestMessages = computed(() => {
    return messages.value.slice(-50) // 只显示最新50条消息
  })

  const onlineUserCount = computed(() => {
    return onlineUsers.value.length
  })
  
  // WebSocket连接
  const connectWebSocket = async (nickname) => {
    try {
      console.log('🔄 开始连接WebSocket服务器...', { 
        nickname, 
        url: wsService.url,
        currentStatus: connectionStatus.value,
        timestamp: new Date().toISOString()
      })
      
      connectionStatus.value = 'connecting'
      
      // 先注册消息处理器
      registerMessageHandlers()
      
      await wsService.connect(nickname)
      isConnected.value = true
      connectionStatus.value = 'connected'
      
      console.log('✅ 聊天室连接成功', { 
        nickname, 
        onlineUsers: onlineUsers.value.length,
        connectionId: wsService.ws ? 'active' : 'inactive'
      })
      
      // 发送测试消息确认连接
      setTimeout(() => {
        console.log('🔔 WebSocket连接状态检查:', {
          isConnected: isConnected.value,
          wsReady: wsService.isConnected,
          readyState: wsService.ws ? wsService.ws.readyState : 'no-ws'
        })
      }, 1000)
      
    } catch (error) {
      console.error('❌ WebSocket连接失败:', error)
      connectionStatus.value = 'disconnected'
      isConnected.value = false
      
      // 如果连接失败，显示错误提示
      addMessage('连接服务器失败，当前为离线模式。请检查网络连接或联系管理员。', '系统', false, 'system')
    }
  }

  // 断开WebSocket连接
  const disconnectWebSocket = () => {
    wsService.disconnect()
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    onlineUsers.value = []
  }

  // 注册消息处理器
  const registerMessageHandlers = () => {
    console.log('🔧 注册WebSocket消息处理器...')
    
    // 聊天消息
    wsService.onMessage(MESSAGE_TYPES.CHAT_MESSAGE, (message) => {
      console.log('📨 收到WebSocket聊天消息:', {
        content: message.content,
        author: message.author,
        isOwn: message.isOwn,
        type: message.type,
        timestamp: message.timestamp,
        id: message.id
      })
      
      // 检查是否重复消息（简化逻辑，避免阻止其他用户消息）
      if (message.isOwn) {
        // 对于自己的消息，检查是否已显示（避免双重显示）
        const recentOwnMessage = messages.value
          .filter(msg => msg.isOwn && msg.content === message.content)
          .slice(-1)[0] // 只检查最后一条相同内容的自己的消息
        
        if (recentOwnMessage) {
          const timeDiff = Date.now() - new Date(recentOwnMessage.timestamp).getTime()
          if (timeDiff < 3000) { // 3秒内的重复消息
            console.log('⚠️ 检测到3秒内的重复自己消息，跳过')
            return
          }
        }
        console.log('📨 处理服务器广播的自己消息')
      } else {
        console.log('📨 处理其他用户的消息')
      }
      
      // 使用服务器传来的isOwn字段，确保消息显示正确
      addMessage(
        message.content, 
        message.author, 
        !!message.isOwn,  // 确保布尔值
        message.type || 'text', 
        message.id, 
        message.timestamp
      )
    })

    // 系统消息
    wsService.onMessage('system', (message) => {
      console.log('📨 收到系统消息:', message)
      addMessage(message.content, message.author, false, 'system', message.id, message.timestamp)
    })

    // 机器人消息
    wsService.onMessage('robot', (message) => {
      console.log('📨 收到机器人消息:', message)
      addMessage(message.content, message.author, false, 'robot', message.id, message.timestamp)
      // 同时添加到机器人消息列表
      addRobotMessage(message.content, false)
    })

    // 话题更换
    wsService.onMessage(MESSAGE_TYPES.TOPIC_CHANGE, (message) => {
      console.log('📨 收到话题更换消息:', message)
      if (message.newTopic) {
        // 将当前话题加入历史
        if (!topicHistory.value.includes(currentTopic.value)) {
          topicHistory.value.unshift(currentTopic.value)
          if (topicHistory.value.length > 10) {
            topicHistory.value.pop()
          }
        }
        currentTopic.value = message.newTopic
      }
      addMessage(message.content, message.author, false, 'system', message.id, message.timestamp)
    })

    // 用户列表更新
    wsService.onMessage(MESSAGE_TYPES.USER_LIST, (message) => {
      console.log('📨 收到用户列表更新:', message)
      onlineUsers.value = message.users || []
    })

    // 消息历史
    wsService.onMessage(MESSAGE_TYPES.MESSAGE_HISTORY, (message) => {
      console.log('📨 收到消息历史:', message)
      messages.value = message.messages || []
      if (message.currentTopic) {
        currentTopic.value = message.currentTopic
      }
    })
    
    console.log('✅ WebSocket消息处理器注册完成')
  }
  
  // 方法
  async function addMessage(content, author = '', isOwn = false, type = 'text', id = null, timestamp = null) {
    const message = {
      id: id || (Date.now() + Math.random()),
      content,
      author: author || (isOwn ? '我' : '匿名用户'),
      timestamp: timestamp || dayjs().format('HH:mm'),
      isOwn,
      type // 'text', 'system', 'robot'
    }
    
    // 简化去重逻辑：只检查明确的重复情况
    const isDuplicate = messages.value.some(existingMsg => {
      // 如果有相同的ID，肯定是重复
      if (message.id && existingMsg.id === message.id) {
        return true
      }
      
      // 如果是完全相同的消息（内容、作者、类型、时间戳都相同）
      if (existingMsg.content === message.content && 
          existingMsg.author === message.author && 
          existingMsg.type === message.type &&
          existingMsg.timestamp === message.timestamp) {
        return true
      }
      
      return false
    })
    
    if (isDuplicate) {
      console.log('⚠️ 检测到明确重复消息，跳过添加:', message)
      return
    }
    
    // 立即添加到本地消息列表（UI 立即更新）
    messages.value.push(message)
    console.log('✅ 消息已添加到本地列表:', message)
    
    // 同时保存到后端数据库（只保存非临时消息）
    if (type !== 'temp') {
      try {
        const userStore = useUserStore()
        const currentUserNickname = userStore.nickname
        
        const messageData = {
          content,
          author: message.author,
          type: getMessageTypeCode(type),
          // 修复：使用当前登录用户的昵称作为userId（仅当是自己的消息时）
          userId: isOwn ? currentUserNickname : null
        }
        
        console.log('💾 保存消息到数据库:', {
          content: messageData.content,
          author: messageData.author,
          userId: messageData.userId,
          isOwn: isOwn,
          currentUser: currentUserNickname
        })
        
        await chatApi.saveChatMessage(messageData)
        console.log('✅ 消息已保存到数据库')
      } catch (error) {
        console.error('❌ 保存消息到数据库失败:', error)
        // 这里可以选择显示错误提示，但不影响UI显示
      }
    }
  }

  // 转换消息类型为数字代码
  function getMessageTypeCode(type) {
    switch (type) {
      case 'text': return 0
      case 'system': return 1
      case 'robot': return 2
      default: return 0
    }
  }

  // 发送消息（通过WebSocket）
  function sendMessage(content, author) {
    console.log('📤 准备发送消息:', { 
      content, 
      author, 
      isConnected: isConnected.value,
      connectionStatus: connectionStatus.value,
      wsServiceConnected: wsService.isConnected 
    })
    
    if (isConnected.value) {
      // 立即显示自己的消息（确保用户能看到）
      addMessage(content, author, true, 'text')
      
      // 同时发送到服务器
      try {
        wsService.sendChatMessage(content)
        console.log('✅ 消息已发送到服务器并立即显示')
      } catch (error) {
        console.error('❌ 发送消息到服务器失败:', error)
      }
    } else {
      console.warn('⚠️ 未连接到聊天服务器，使用离线模式')
      // 离线模式下才添加到本地
      addMessage(content, author, true, 'text')
    }
  }
  
  function addRobotMessage(content, isUser = false) {
    const message = {
      id: Date.now() + Math.random(),
      content,
      isUser,
      timestamp: dayjs().format('HH:mm')
    }
    robotMessages.value.push(message)
  }
  
  function changeTopic() {
    if (isConnected.value) {
      wsService.changeTopic()
    } else {
      // 离线模式的话题更换
      const topics = [
        '今天你装忙了吗？',
        '分享一个摸鱼小技巧',
        '老板不在的时候你在干什么？',
        '最喜欢的摸鱼网站是什么？',
        '如果摸鱼是一门艺术，你是什么级别？',
        '说说你的摸鱼日常',
        '摸鱼被发现的尴尬时刻',
        '理想的工作状态是什么样的？'
      ]
      let newTopic
      do {
        newTopic = topics[Math.floor(Math.random() * topics.length)]
      } while (newTopic === currentTopic.value)
      
      // 将当前话题加入历史
      if (!topicHistory.value.includes(currentTopic.value)) {
        topicHistory.value.unshift(currentTopic.value)
        if (topicHistory.value.length > 10) {
          topicHistory.value.pop()
        }
      }
      
      currentTopic.value = newTopic
      
      // 添加系统消息
      addMessage(`话题已更新：${newTopic}`, '系统', false, 'system')
    }
  }
  
  function initializeMessages() {
    // 如果没有连接到WebSocket，初始化一些本地示例消息
    if (!isConnected.value) {
      messages.value = [
        {
          id: 1,
          content: '欢迎来到摸鱼星球！连接服务器后可与其他用户实时聊天 🎉',
          author: '系统',
          timestamp: dayjs().format('HH:mm'),
          isOwn: false,
          type: 'system'
        }
      ]
    }
    
    // 初始化机器人消息
    robotMessages.value = [
      {
        id: 1,
        content: '嘿！我是你的摸鱼伙伴 🤖 需要什么帮助吗？',
        isUser: false,
        timestamp: dayjs().format('HH:mm')
      }
    ]
  }
  
  function executeRobotCommand(command) {
    // 添加用户消息到机器人面板
    addRobotMessage(command, true)
    
    // 如果连接到WebSocket，命令会通过WebSocket处理
    // 否则在本地处理
    if (!isConnected.value) {
      let response = ''
      switch (command) {
        case '/joke':
          const jokes = [
            '为什么程序员总是分不清圣诞节和万圣节？\n因为 Oct 31 == Dec 25 😄',
            '为什么程序员喜欢黑暗？\n因为光明会产生bug！💡➡️🐛',
            '程序员的三大美德：懒惰、急躁、傲慢\n所以我们才需要摸鱼 😎',
            '为什么程序员总是戴耳机？\n因为这样别人就不会打扰我们摸鱼了 🎧'
          ]
          response = jokes[Math.floor(Math.random() * jokes.length)]
          break
          
        case '/excuse':
          const excuses = [
            '🏥 建议：家里水管爆了，需要在家等维修师傅\n成功率：⭐⭐⭐⭐☆\n使用过的同事：还没有人用过哦～',
            '🚗 建议：车子突然坏了，需要等拖车\n成功率：⭐⭐⭐☆☆\n使用过的同事：2人',
            '👵 建议：奶奶生病了，需要陪她去医院\n成功率：⭐⭐⭐⭐⭐\n使用过的同事：1人',
            '📱 建议：手机丢了，需要去补办卡\n成功率：⭐⭐⭐☆☆\n使用过的同事：3人'
          ]
          response = excuses[Math.floor(Math.random() * excuses.length)]
          break
          
        case '/rant':
          const rants = [
            '老板又在画饼了，说什么"我们是一家人"，家人会让你996吗？😤',
            '为什么开会总是没有结论？大家聚在一起就是为了浪费时间吗？🙄',
            '说好的工作量，怎么越做越多？这就是传说中的工作膨胀吗？📈',
            '同事总是甩锅，出了问题就找别人背责任，太难了 😮‍💨'
          ]
          response = rants[Math.floor(Math.random() * rants.length)]
          break
          
        default:
          response = '我不太理解你的意思呢，试试这些命令：\n/joke - 讲个冷笑话\n/excuse - 生成请假理由\n/rant - 吐槽老板'
      }
      
      // 延迟回复，模拟机器人思考
      setTimeout(() => {
        addRobotMessage(response, false)
      }, 1000)
    }
  }

  // 从数据库加载消息历史
  async function loadMessagesFromDatabase() {
    try {
      console.log('🔄 正在从数据库加载消息历史...')
      const userStore = useUserStore()
      const currentUserNickname = userStore.nickname
      const messagesFromDb = await chatApi.getLatestMessages(50)
      
      if (messagesFromDb && messagesFromDb.length > 0) {
        // 转换数据库消息格式为前端格式
        const convertedMessages = messagesFromDb.map(msg => {
          // 修复：根据userId字段判断是否为当前用户的消息
          const isOwn = msg.userId === currentUserNickname
          
          console.log('🔄 加载消息:', {
            content: msg.content,
            author: msg.author,
            userId: msg.userId,
            currentUser: currentUserNickname,
            isOwn: isOwn
          })
          
          return {
            id: msg.id,
            content: msg.content,
            author: msg.author || '匿名用户',
            timestamp: msg.timestamp,
            // 修复：根据userId字段判断，而不是author
            isOwn: isOwn,
            type: getMessageTypeString(msg.type)
          }
        })
        
        // 替换当前消息列表
        messages.value = convertedMessages
        console.log(`✅ 成功加载 ${convertedMessages.length} 条消息历史`, {
          currentUser: currentUserNickname,
          ownMessages: convertedMessages.filter(m => m.isOwn).length,
          otherMessages: convertedMessages.filter(m => !m.isOwn).length
        })
      } else {
        console.log('📝 没有找到历史消息，使用默认消息')
        // 如果没有历史消息，可以添加一些默认消息
        initializeMessages()
      }
    } catch (error) {
      console.error('❌ 加载消息历史失败:', error)
      // 如果加载失败，使用默认消息
      initializeMessages()
    }
  }

  // 转换数字代码为消息类型字符串
  function getMessageTypeString(typeCode) {
    switch (typeCode) {
      case 0: return 'text'
      case 1: return 'system'
      case 2: return 'robot'
      default: return 'text'
    }
  }
  
  return {
    // 状态
    messages,
    currentTopic,
    topicHistory,
    robotMessages,
    onlineUsers,
    isConnected,
    connectionStatus,
    // 计算属性
    latestMessages,
    onlineUserCount,
    // 方法
    connectWebSocket,
    disconnectWebSocket,
    addMessage,
    sendMessage,
    addRobotMessage,
    changeTopic,
    initializeMessages,
    executeRobotCommand,
    loadMessagesFromDatabase
  }
}) 
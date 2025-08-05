import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { wsService, MESSAGE_TYPES } from '@/services/websocket'

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
      console.log('🔄 开始连接WebSocket服务器...', { nickname, url: 'ws://localhost:8080' })
      connectionStatus.value = 'connecting'
      await wsService.connect(nickname)
      isConnected.value = true
      connectionStatus.value = 'connected'
      
      // 注册消息处理器
      registerMessageHandlers()
      
      console.log('✅ 聊天室连接成功', { nickname, onlineUsers: onlineUsers.value.length })
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
      console.log('📨 收到聊天消息:', message)
      // 使用服务器传来的isOwn字段，而不是硬编码为false
      addMessage(message.content, message.author, message.isOwn || false, message.type, message.id, message.timestamp)
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
  function addMessage(content, author = '', isOwn = false, type = 'text', id = null, timestamp = null) {
    const message = {
      id: id || (Date.now() + Math.random()),
      content,
      author: author || (isOwn ? '我' : '匿名用户'),
      timestamp: timestamp || dayjs().format('HH:mm'),
      isOwn,
      type // 'text', 'system', 'robot'
    }
    messages.value.push(message)
  }

  // 发送消息（通过WebSocket）
  function sendMessage(content, author) {
    if (isConnected.value) {
      console.log('📤 发送消息:', { content, author })
      wsService.sendChatMessage(content)
      // 注意：不要在这里立即添加消息到本地，等待服务器广播回来
      // 这样可以确保消息的一致性和顺序
    } else {
      console.warn('⚠️ 未连接到聊天服务器')
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
    executeRobotCommand
  }
}) 
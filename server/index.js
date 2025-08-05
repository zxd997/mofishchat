import { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'

const PORT = 8080
const wss = new WebSocketServer({ port: PORT })

// 存储连接的用户
const users = new Map()
const messages = []

// 消息类型
const MESSAGE_TYPES = {
  USER_JOIN: 'user_join',
  USER_LEAVE: 'user_leave',
  CHAT_MESSAGE: 'chat_message',
  ROBOT_COMMAND: 'robot_command',
  TOPIC_CHANGE: 'topic_change',
  USER_LIST: 'user_list',
  MESSAGE_HISTORY: 'message_history'
}

// 机器人回复逻辑
const robotResponses = {
  '/joke': [
    '为什么程序员总是分不清圣诞节和万圣节？\n因为 Oct 31 == Dec 25 😄',
    '为什么程序员喜欢黑暗？\n因为光明会产生bug！💡➡️🐛',
    '程序员的三大美德：懒惰、急躁、傲慢\n所以我们才需要摸鱼 😎',
    '为什么程序员总是戴耳机？\n因为这样别人就不会打扰我们摸鱼了 🎧'
  ],
  '/excuse': [
    '🏥 建议：家里水管爆了，需要在家等维修师傅\n成功率：⭐⭐⭐⭐☆\n使用过的同事：还没有人用过哦～',
    '🚗 建议：车子突然坏了，需要等拖车\n成功率：⭐⭐⭐☆☆\n使用过的同事：2人',
    '👵 建议：奶奶生病了，需要陪她去医院\n成功率：⭐⭐⭐⭐⭐\n使用过的同事：1人',
    '📱 建议：手机丢了，需要去补办卡\n成功率：⭐⭐⭐☆☆\n使用过的同事：3人'
  ],
  '/rant': [
    '老板又在画饼了，说什么"我们是一家人"，家人会让你996吗？😤',
    '为什么开会总是没有结论？大家聚在一起就是为了浪费时间吗？🙄',
    '说好的工作量，怎么越做越多？这就是传说中的工作膨胀吗？📈',
    '同事总是甩锅，出了问题就找别人背责任，太难了 😮‍💨'
  ]
}

// 话题列表
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

let currentTopic = topics[0]

// 广播消息给所有用户
function broadcast(message, excludeUser = null) {
  const messageString = JSON.stringify(message)
  users.forEach((user, ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(messageString)
    }
  })
}

// 发送消息给所有用户，包括发送者（但标记isOwn）
function broadcastMessage(message, sender = null) {
  users.forEach((user, ws) => {
    if (ws.readyState === ws.OPEN) {
      const messageToSend = {
        ...message,
        isOwn: ws === sender  // 标记是否是发送者
      }
      ws.send(JSON.stringify(messageToSend))
    }
  })
}

// 发送用户列表
function sendUserList() {
  const userList = Array.from(users.values()).map(user => ({
    id: user.id,
    nickname: user.nickname,
    joinTime: user.joinTime
  }))
  
  broadcast({
    type: MESSAGE_TYPES.USER_LIST,
    users: userList
  })
}

// 生成机器人回复
function generateRobotResponse(command) {
  const responses = robotResponses[command]
  if (responses) {
    return responses[Math.floor(Math.random() * responses.length)]
  }
  return '我不太理解你的意思呢，试试这些命令：\n/joke - 讲个冷笑话\n/excuse - 生成请假理由\n/rant - 吐槽老板'
}

// 创建消息对象
function createMessage(content, author, type = 'text') {
  return {
    id: uuidv4(),
    content,
    author,
    timestamp: new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    type
    // 不在这里设置isOwn，让broadcastMessage函数来设置
  }
}

console.log(`🚀 WebSocket服务器启动在端口 ${PORT}`)

wss.on('connection', (ws) => {
  console.log('👋 新用户连接')
  
  // 用户连接处理
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      
      switch (message.type) {
        case MESSAGE_TYPES.USER_JOIN:
          // 用户加入
          const userId = uuidv4()
          users.set(ws, {
            id: userId,
            nickname: message.nickname,
            joinTime: new Date().toISOString(),
            ws: ws
          })
          
          console.log(`✅ 用户 ${message.nickname} 加入聊天室`)
          
          // 发送历史消息给新用户
          ws.send(JSON.stringify({
            type: MESSAGE_TYPES.MESSAGE_HISTORY,
            messages: messages.slice(-20), // 发送最近20条消息
            currentTopic: currentTopic
          }))
          
          // 广播用户加入消息
          const joinMessage = createMessage(
            `${message.nickname} 加入了聊天室 🎉`, 
            '系统', 
            'system'
          )
          messages.push(joinMessage)
          broadcast({
            ...joinMessage,
            type: 'system'
          })
          
          // 更新用户列表
          sendUserList()
          break
          
        case MESSAGE_TYPES.CHAT_MESSAGE:
          const user = users.get(ws)
          if (user) {
            // 检查是否是机器人命令
            if (message.content.startsWith('/')) {
              // 处理机器人命令
              const command = message.content.split(' ')[0]
              const robotResponse = generateRobotResponse(command)
              
              // 先广播用户的命令消息
              const userMessage = createMessage(message.content, user.nickname, 'text')
              messages.push(userMessage)
              broadcastMessage({
                ...userMessage,
                type: MESSAGE_TYPES.CHAT_MESSAGE
              }, ws)
              
              // 延迟发送机器人回复
              setTimeout(() => {
                const robotMessage = createMessage(robotResponse, '🤖 摸鱼机器人', 'robot')
                messages.push(robotMessage)
                broadcast({
                  ...robotMessage,
                  type: 'robot'
                })
              }, 1000)
            } else {
              // 普通聊天消息
              const chatMessage = createMessage(message.content, user.nickname, 'text')
              messages.push(chatMessage)
              broadcastMessage({
                ...chatMessage,
                type: MESSAGE_TYPES.CHAT_MESSAGE
              }, ws)
              console.log(`💬 ${user.nickname}: ${message.content}`)
            }
          }
          break
          
        case MESSAGE_TYPES.TOPIC_CHANGE:
          // 更换话题
          const oldTopic = currentTopic
          do {
            currentTopic = topics[Math.floor(Math.random() * topics.length)]
          } while (currentTopic === oldTopic)
          
          const topicMessage = createMessage(
            `话题已更新：${currentTopic}`, 
            '系统', 
            'system'
          )
          messages.push(topicMessage)
          broadcast({
            ...topicMessage,
            type: MESSAGE_TYPES.TOPIC_CHANGE,
            newTopic: currentTopic
          })
          console.log(`📝 话题更换为: ${currentTopic}`)
          break
      }
    } catch (error) {
      console.error('❌ 消息处理错误:', error)
    }
  })
  
  // 用户断开连接
  ws.on('close', () => {
    const user = users.get(ws)
    if (user) {
      console.log(`👋 用户 ${user.nickname} 离开聊天室`)
      
      // 广播用户离开消息
      const leaveMessage = createMessage(
        `${user.nickname} 离开了聊天室 👋`, 
        '系统', 
        'system'
      )
      messages.push(leaveMessage)
      broadcast({
        ...leaveMessage,
        type: 'system'
      })
      
      // 从用户列表中移除
      users.delete(ws)
      
      // 更新用户列表
      sendUserList()
    }
  })
  
  // 错误处理
  ws.on('error', (error) => {
    console.error('❌ WebSocket错误:', error)
  })
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...')
  wss.close(() => {
    console.log('✅ 服务器已关闭')
    process.exit(0)
  })
}) 
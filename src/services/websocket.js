// WebSocket客户端服务
class WebSocketService {
  constructor() {
    this.ws = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.messageHandlers = new Map()
    this.url = 'ws://localhost:8080'
  }

  // 连接WebSocket
  connect(nickname) {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔄 创建WebSocket连接...', this.url)
        this.ws = new WebSocket(this.url)

        // 设置连接超时
        const timeout = setTimeout(() => {
          console.error('❌ WebSocket连接超时')
          this.ws.close()
          reject(new Error('连接超时'))
        }, 5000) // 5秒超时

        this.ws.onopen = () => {
          clearTimeout(timeout)
          console.log('🔗 WebSocket连接成功')
          this.isConnected = true
          this.reconnectAttempts = 0
          
          // 发送用户加入消息
          this.send({
            type: 'user_join',
            nickname: nickname
          })
          
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log('📨 收到消息:', message.type, message)
            this.handleMessage(message)
          } catch (error) {
            console.error('❌ 消息解析错误:', error)
          }
        }

        this.ws.onclose = (event) => {
          clearTimeout(timeout)
          console.log('🔌 WebSocket连接关闭', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          })
          this.isConnected = false
          
          // 只有在非正常关闭时才自动重连
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(`🔄 尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
            setTimeout(() => {
              this.connect(nickname)
            }, this.reconnectDelay * this.reconnectAttempts)
          }
        }

        this.ws.onerror = (error) => {
          clearTimeout(timeout)
          console.error('❌ WebSocket错误:', error)
          this.isConnected = false
          reject(new Error('WebSocket连接失败'))
        }

      } catch (error) {
        console.error('❌ 创建WebSocket连接失败:', error)
        reject(error)
      }
    })
  }

  // 断开连接
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.isConnected = false
    }
  }

  // 发送消息
  send(message) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('⚠️ WebSocket未连接，无法发送消息')
    }
  }

  // 发送聊天消息
  sendChatMessage(content) {
    this.send({
      type: 'chat_message',
      content: content
    })
  }

  // 更换话题
  changeTopic() {
    this.send({
      type: 'topic_change'
    })
  }

  // 注册消息处理器
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type).push(handler)
  }

  // 移除消息处理器
  offMessage(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // 处理接收到的消息
  handleMessage(message) {
    const handlers = this.messageHandlers.get(message.type) || []
    handlers.forEach(handler => {
      try {
        handler(message)
      } catch (error) {
        console.error('❌ 消息处理器错误:', error)
      }
    })
  }

  // 获取连接状态
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// 创建单例实例
export const wsService = new WebSocketService()

// 消息类型常量
export const MESSAGE_TYPES = {
  USER_JOIN: 'user_join',
  USER_LEAVE: 'user_leave',
  CHAT_MESSAGE: 'chat_message',
  ROBOT_COMMAND: 'robot_command',
  TOPIC_CHANGE: 'topic_change',
  USER_LIST: 'user_list',
  MESSAGE_HISTORY: 'message_history'
} 
/**
 * WebSocket 连接配置
 */

// 开发环境配置
const development = {
  WS_BASE_URL: 'ws://localhost:8081',
  WS_CHAT_ENDPOINT: '/ws/chat',
  API_BASE_URL: 'http://localhost:8081/api'
}

// 生产环境配置
const production = {
  WS_BASE_URL: 'wss://your-domain.com',
  WS_CHAT_ENDPOINT: '/ws/chat',
  API_BASE_URL: 'https://your-domain.com/api'
}

// 根据环境变量选择配置
const config = import.meta.env.MODE === 'production' ? production : development

export const WS_CONFIG = {
  // WebSocket 聊天室连接URL
  CHAT_URL: `${config.WS_BASE_URL}${config.WS_CHAT_ENDPOINT}`,
  
  // API基础URL
  API_BASE_URL: config.API_BASE_URL,
  
  // 连接配置
  CONNECTION: {
    // 最大重连次数
    MAX_RECONNECT_ATTEMPTS: 5,
    // 重连延迟(毫秒)
    RECONNECT_DELAY: 1000,
    // 连接超时时间(毫秒)
    CONNECTION_TIMEOUT: 5000
  }
}

export default WS_CONFIG

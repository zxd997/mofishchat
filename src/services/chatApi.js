/**
 * 聊天API服务
 */
import { WS_CONFIG } from '@/config/websocket'

const API_BASE_URL = `${WS_CONFIG.API_BASE_URL}/chat`

class ChatApiService {
  /**
   * 保存聊天消息
   * @param {Object} messageData 消息数据
   * @returns {Promise} 
   */
  async saveChatMessage(messageData) {
    try {
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      })
      
      const result = await response.json()
      
      if (result.code === 200) {
        return result.data
      } else {
        throw new Error(result.message || '保存消息失败')
      }
    } catch (error) {
      console.error('保存消息失败:', error)
      throw error
    }
  }

  /**
   * 获取最新的聊天消息
   * @param {number} limit 限制条数
   * @returns {Promise} 
   */
  async getLatestMessages(limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/latest?limit=${limit}`)
      const result = await response.json()
      
      if (result.code === 200) {
        return result.data || []
      } else {
        throw new Error(result.message || '获取消息失败')
      }
    } catch (error) {
      console.error('获取最新消息失败:', error)
      throw error
    }
  }

  /**
   * 获取所有聊天消息
   * @returns {Promise} 
   */
  async getAllMessages() {
    try {
      const response = await fetch(`${API_BASE_URL}/all`)
      const result = await response.json()
      
      if (result.code === 200) {
        return result.data || []
      } else {
        throw new Error(result.message || '获取消息失败')
      }
    } catch (error) {
      console.error('获取所有消息失败:', error)
      throw error
    }
  }

  /**
   * 健康检查
   * @returns {Promise} 
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const result = await response.json()
      return result.code === 200
    } catch (error) {
      console.error('健康检查失败:', error)
      return false
    }
  }
}

export default new ChatApiService() 
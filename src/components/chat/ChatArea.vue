<template>
  <div class="chat-area">
    <!-- 连接状态指示器 -->
    <div class="connection-status" :class="connectionStatusClass">
      <div class="status-indicator">
        <span class="status-icon">{{ statusIcon }}</span>
        <span class="status-text">{{ statusText }}</span>
        <span class="online-count" v-if="chatStore.isConnected">
          ({{ chatStore.onlineUserCount }}人在线)
        </span>
      </div>
      <button 
        v-if="!chatStore.isConnected && userStore.nickname" 
        class="reconnect-btn btn btn-primary btn-sm"
        @click="reconnect"
      >
        重新连接
      </button>
    </div>
    
    <div class="messages-container" ref="messagesContainer">
      <MessageItem 
        v-for="message in chatStore.latestMessages"
        :key="message.id"
        :message="message"
      />
    </div>
    
    <InputArea 
      @send-message="handleSendMessage" 
      :disabled="!chatStore.isConnected"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, watch, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import MessageItem from './MessageItem.vue'
import InputArea from './InputArea.vue'

// 状态管理
const chatStore = useChatStore()
const userStore = useUserStore()

// 响应式数据
const messagesContainer = ref(null)

// 计算属性
const connectionStatusClass = computed(() => {
  return {
    'status-connected': chatStore.isConnected,
    'status-connecting': chatStore.connectionStatus === 'connecting',
    'status-disconnected': chatStore.connectionStatus === 'disconnected'
  }
})

const statusIcon = computed(() => {
  switch (chatStore.connectionStatus) {
    case 'connected': return '🟢'
    case 'connecting': return '🟡'
    default: return '🔴'
  }
})

const statusText = computed(() => {
  switch (chatStore.connectionStatus) {
    case 'connected': return '已连接'
    case 'connecting': return '连接中...'
    default: return '未连接'
  }
})

// 方法
const handleSendMessage = (content, type = 'text') => {
  if (!content.trim()) return
  
  // 获取用户昵称
  const userName = userStore.nickname || '摸鱼新手'
  
  if (chatStore.isConnected) {
    // 使用WebSocket发送消息
    chatStore.sendMessage(content, userName)
  } else {
    // 离线模式，仅本地显示
    if (content.startsWith('/')) {
      chatStore.addMessage(content, userName, true, type)
      setTimeout(() => {
        chatStore.executeRobotCommand(content)
      }, 500)
    } else {
      chatStore.addMessage(content, userName, true, type)
    }
  }
}

const reconnect = async () => {
  if (userStore.nickname) {
    try {
      await chatStore.connectWebSocket(userStore.nickname)
    } catch (error) {
      console.error('重连失败:', error)
    }
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

// 监听用户昵称变化，自动连接WebSocket
watch(() => userStore.nickname, async (newNickname) => {
  if (newNickname && !chatStore.isConnected) {
    try {
      await chatStore.connectWebSocket(newNickname)
    } catch (error) {
      console.error('自动连接失败:', error)
    }
  }
})

// 组件挂载时加载历史消息并尝试连接
onMounted(async () => {
  // 首先加载数据库中的历史消息
  try {
    await chatStore.loadMessagesFromDatabase()
  } catch (error) {
    console.error('加载历史消息失败:', error)
  }

  // 然后尝试连接WebSocket
  if (userStore.nickname && !chatStore.isConnected) {
    try {
      await chatStore.connectWebSocket(userStore.nickname)
    } catch (error) {
      console.error('初始连接失败:', error)
    }
  }
})

// 组件卸载时断开连接
onUnmounted(() => {
  chatStore.disconnectWebSocket()
})
</script>

<style lang="scss" scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fafafa;
}

.connection-status {
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  padding: $spacing-sm $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-small;
  
  &.status-connected {
    background: #e8f5e8;
    border-bottom-color: #4caf50;
  }
  
  &.status-connecting {
    background: #fff3e0;
    border-bottom-color: #ff9800;
  }
  
  &.status-disconnected {
    background: #ffebee;
    border-bottom-color: #f44336;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.status-icon {
  font-size: 0.8em;
}

.status-text {
  font-weight: 500;
}

.online-count {
  color: #666;
  font-size: 0.9em;
}

.reconnect-btn {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-small;
  border-radius: $spacing-xs;
}

.messages-container {
  flex: 1;
  padding: $spacing-lg;
  overflow-y: auto;
  scroll-behavior: smooth;
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0,0,0,0.5);
    }
  }
}

@media (max-width: 768px) {
  .connection-status {
    padding: $spacing-xs $spacing-sm;
    flex-direction: column;
    gap: $spacing-xs;
    text-align: center;
  }
  
  .messages-container {
    padding: $spacing-sm;
  }
}
</style> 
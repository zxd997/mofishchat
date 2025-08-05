<template>
  <div class="top-bar">
    <div class="logo">
      <span class="emoji">🐟</span>
      <span class="text">摸鱼星球</span>
    </div>
    
    <div class="topic-section">
      <div class="topic-banner">
        <span class="topic-icon">💬</span>
        <span class="topic-text">今日话题：{{ chatStore.currentTopic }}</span>
      </div>
      <button 
        class="topic-button btn" 
        @click="changeTopic"
        :disabled="!chatStore.isConnected"
        :title="chatStore.isConnected ? '点击更换话题' : '连接服务器后可更换话题'"
      >
        换一个话题
      </button>
    </div>
    
    <div class="user-section">
      <div class="connection-indicator" :class="connectionClass">
        <span class="connection-dot"></span>
        <span class="connection-text">{{ connectionText }}</span>
      </div>
      <div class="user-info" v-if="userStore.nickname">
        <span class="user-emoji">👋</span>
        <span class="user-nickname">{{ userStore.nickname }}</span>
      </div>
      <div class="coins-display">
        <span class="coin-icon">💰</span>
        <span class="coin-count">{{ userStore.fishingCoins }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'

// 状态管理
const userStore = useUserStore()
const chatStore = useChatStore()

// 计算属性
const connectionClass = computed(() => {
  return {
    'connected': chatStore.isConnected,
    'connecting': chatStore.connectionStatus === 'connecting',
    'disconnected': chatStore.connectionStatus === 'disconnected'
  }
})

const connectionText = computed(() => {
  if (chatStore.isConnected) {
    return `${chatStore.onlineUserCount}人在线`
  }
  return chatStore.connectionStatus === 'connecting' ? '连接中' : '离线模式'
})

// 方法
const changeTopic = () => {
  if (chatStore.isConnected) {
    chatStore.changeTopic()
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  background: $gradient-topbar;
  padding: $spacing-md $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: $shadow-light;
  min-height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: $font-size-xl;
  font-weight: bold;
  color: white;
  
  .emoji {
    margin-right: $spacing-sm;
    font-size: $font-size-xxl;
  }
}

.topic-section {
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 $spacing-lg;
  max-width: 600px;
}

.topic-banner {
  background: rgba(255,255,255,0.9);
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-large;
  color: #333;
  margin-right: $spacing-sm;
  flex: 1;
  display: flex;
  align-items: center;
  font-size: $font-size-base;
  box-shadow: $shadow-light;
  
  .topic-icon {
    margin-right: $spacing-xs;
  }
  
  .topic-text {
    font-weight: 500;
  }
}

.topic-button {
  background: $warning-color;
  color: white;
  border: none;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  cursor: pointer;
  font-size: $font-size-small;
  white-space: nowrap;
  transition: all 0.3s ease;
  
  &:not(:disabled):hover {
    background: darken($warning-color, 10%);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.connection-indicator {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  background: rgba(255,255,255,0.2);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  color: white;
  font-size: $font-size-small;
  
  &.connected .connection-dot {
    background: #4caf50;
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.6);
  }
  
  &.connecting .connection-dot {
    background: #ff9800;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  &.disconnected .connection-dot {
    background: #f44336;
  }
}

.connection-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f44336;
}

.connection-text {
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  color: white;
  
  .user-emoji {
    margin-right: $spacing-xs;
  }
  
  .user-nickname {
    font-weight: 500;
    font-size: $font-size-small;
  }
}

.coins-display {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.9);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  color: $warning-color;
  font-weight: bold;
  box-shadow: $shadow-light;
  
  .coin-icon {
    margin-right: $spacing-xs;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-sm;
  }
  
  .topic-section {
    width: 100%;
    margin: 0;
    max-width: none;
  }
  
  .topic-banner {
    margin-right: $spacing-xs;
    font-size: $font-size-small;
  }
  
  .user-section {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 
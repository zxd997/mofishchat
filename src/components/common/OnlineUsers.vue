<template>
  <div class="online-users" v-if="chatStore.isConnected && chatStore.onlineUsers.length > 0">
    <div class="users-header">
      <span class="users-title">🌟 在线摸鱼者</span>
      <span class="users-count">({{ chatStore.onlineUserCount }})</span>
    </div>
    <div class="users-list">
      <div 
        v-for="user in chatStore.onlineUsers"
        :key="user.id"
        class="user-item"
        :class="{ 'is-self': user.nickname === userStore.nickname }"
      >
        <div class="user-avatar">{{ getAvatar(user.nickname) }}</div>
        <div class="user-info">
          <div class="user-nickname">
            {{ user.nickname === userStore.nickname ? '我' : user.nickname }}
          </div>
          <div class="user-status">{{ getJoinTime(user.joinTime) }}</div>
        </div>
        <div class="user-indicator" v-if="user.nickname === userStore.nickname">👤</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'

// 状态管理
const chatStore = useChatStore()
const userStore = useUserStore()

// 方法
const getAvatar = (nickname) => {
  const avatars = ['🐟', '🦈', '🐠', '🐡', '🦑', '🐙', '🐚', '⭐', '🌊', '🏄‍♂️', '🚀', '🎯', '🌟', '🎭', '🎨', '🎪']
  const index = (nickname || '').length % avatars.length
  return avatars[index]
}

const getJoinTime = (joinTime) => {
  if (!joinTime) return ''
  const now = new Date()
  const join = new Date(joinTime)
  const diffMinutes = Math.floor((now - join) / (1000 * 60))
  
  if (diffMinutes < 1) return '刚刚加入'
  if (diffMinutes < 60) return `${diffMinutes}分钟前加入`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}小时前加入`
  return '很久之前加入'
}
</script>

<style lang="scss" scoped>
.online-users {
  background: white;
  border-radius: $border-radius;
  box-shadow: $shadow-light;
  overflow: hidden;
  margin-bottom: $spacing-lg;
}

.users-header {
  background: linear-gradient(45deg, $primary-color, #64b5f6);
  color: white;
  padding: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.users-title {
  font-size: $font-size-base;
}

.users-count {
  background: rgba(255,255,255,0.2);
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-small;
  font-size: $font-size-small;
}

.users-list {
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
}

.user-item {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &.is-self {
    background: linear-gradient(90deg, rgba(66, 165, 245, 0.1), rgba(255, 255, 255, 0));
    border-left: 3px solid $primary-color;
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42a5f5, #64b5f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-base;
  margin-right: $spacing-sm;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-nickname {
  font-weight: 500;
  color: #333;
  font-size: $font-size-small;
  margin-bottom: 2px;
  
  .is-self & {
    color: $primary-color;
    font-weight: 600;
  }
}

.user-status {
  font-size: 0.75em;
  color: #999;
}

.user-indicator {
  font-size: $font-size-small;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .user-item {
    padding: $spacing-xs $spacing-sm;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: $font-size-small;
  }
}
</style> 
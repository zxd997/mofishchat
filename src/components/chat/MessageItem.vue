<template>
  <div class="message-item" :class="messageClasses">
    <!-- 消息头像 -->
    <div class="message-avatar" v-if="!isSystemMessage">
      {{ getAvatar(message.author) }}
    </div>
    
    <div class="message-content">
      <div class="message-header" v-if="showHeader">
        <span class="author">{{ displayAuthor }}</span>
        <span class="timestamp">{{ message.timestamp }}</span>
      </div>
      
      <div class="message-body">
        <component 
          :is="messageComponent" 
          :content="message.content"
          :type="message.type"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TextMessage from './messages/TextMessage.vue'
import SystemMessage from './messages/SystemMessage.vue'
import RobotMessage from './messages/RobotMessage.vue'

// 定义属性
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

// 计算属性
const messageClasses = computed(() => {
  return {
    'is-own': props.message.isOwn,
    'is-system': props.message.type === 'system',
    'is-robot': props.message.type === 'robot',
    [`type-${props.message.type}`]: true
  }
})

const isSystemMessage = computed(() => {
  return props.message.type === 'system'
})

const showHeader = computed(() => {
  return props.message.type !== 'system'
})

const displayAuthor = computed(() => {
  console.log('💬 消息显示调试:', {
    isOwn: props.message.isOwn,
    author: props.message.author,
    content: props.message.content.substring(0, 20) + '...'
  })
  
  if (props.message.isOwn) {
    return '我'
  }
  return props.message.author || '匿名用户'
})

const messageComponent = computed(() => {
  switch (props.message.type) {
    case 'system':
      return SystemMessage
    case 'robot':
      return RobotMessage
    default:
      return TextMessage
  }
})

// 方法
const getAvatar = (author) => {
  // 如果是自己的消息，使用特定头像
  if (props.message.isOwn) {
    return '👤'
  }
  
  // 如果是机器人消息
  if (props.message.type === 'robot') {
    return '🤖'
  }
  
  // 其他用户根据昵称生成头像
  const avatars = ['🐟', '🦈', '🐠', '🐡', '🦑', '🐙', '🐚', '⭐', '🌊', '🏄‍♂️', '🚀', '🎯', '🌟', '🎭', '🎨', '🎪']
  const index = (author || '').length % avatars.length
  return avatars[index]
}
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  margin: $spacing-md 0;
  max-width: 100%;
  gap: $spacing-sm;
  
  &.is-own {
    flex-direction: row-reverse;
    
    .message-content {
      margin-right: 0;
      margin-left: auto;
      background: $gradient-message;
      color: white;
      max-width: 70%;
    }
    
    .message-avatar {
      background: linear-gradient(45deg, $primary-color, #1976d2);
      color: white;
    }
  }
  
  &.is-system {
    justify-content: center;
    
    .message-content {
      background: rgba(0,0,0,0.1);
      color: #666;
      border-radius: $border-radius;
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-small;
      margin: 0;
      max-width: 80%;
      text-align: center;
    }
  }
  
  &.is-robot {
    .message-content {
      background: linear-gradient(45deg, #9c27b0, #e91e63);
      color: white;
    }
    
    .message-avatar {
      background: linear-gradient(45deg, #9c27b0, #e91e63);
      color: white;
    }
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42a5f5, #64b5f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-large;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: $spacing-xs;
  box-shadow: $shadow-light;
  border: 2px solid white;
  
  // 添加悬浮效果
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
}

.message-content {
  background: white;
  border-radius: $border-radius;
  padding: $spacing-md;
  box-shadow: $shadow-light;
  max-width: 70%;
  word-wrap: break-word;
  position: relative;
  
  // 消息气泡箭头
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    width: 0;
    height: 0;
    border: 8px solid transparent;
  }
  
  .is-own & {
    &::before {
      right: -16px;
      border-left-color: #64b5f6;
    }
  }
  
  .is-robot & {
    &::before {
      left: -16px;
      border-right-color: #e91e63;
    }
  }
  
  .message-item:not(.is-own):not(.is-system):not(.is-robot) & {
    &::before {
      left: -16px;
      border-right-color: white;
    }
  }
}

.message-header {
  font-size: $font-size-small;
  opacity: 0.8;
  margin-bottom: $spacing-xs;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  font-weight: 600;
  
  .is-own & {
    color: rgba(255,255,255,0.9);
  }
  
  .is-robot & {
    color: rgba(255,255,255,0.9);
    
    &::before {
      content: '🤖 ';
    }
  }
}

.timestamp {
  font-size: 0.8em;
  opacity: 0.7;
  
  .is-own &,
  .is-robot & {
    color: rgba(255,255,255,0.8);
  }
}

.message-body {
  line-height: 1.4;
}

@media (max-width: 768px) {
  .message-avatar {
    width: 36px;
    height: 36px;
    font-size: $font-size-base;
  }
  
  .message-content {
    max-width: 80%;
    padding: $spacing-sm;
  }
}
</style> 
<template>
  <div class="robot-panel">
    <div class="panel-header">
      <h2 class="panel-title">🤖 AI 摸鱼机器人</h2>
    </div>
    
    <div class="panel-content">
      <!-- 机器人状态 -->
      <div class="robot-status">
        <div class="robot-avatar">
          <div class="avatar-circle">🤖</div>
          <div class="status-indicator" :class="{ active: isOnline }"></div>
        </div>
        <div class="robot-info">
          <div class="robot-name">摸鱼助手小鱼</div>
          <div class="robot-description">您的专属摸鱼伙伴，随时为您提供帮助</div>
        </div>
      </div>
      
      <!-- 聊天区域 -->
      <div class="robot-chat" ref="chatContainer">
        <div 
          v-for="message in chatStore.robotMessages"
          :key="message.id"
          class="robot-message"
          :class="{ 'user-message': message.isUser }"
        >
          <div class="message-content">
            <div v-if="!message.isUser" class="message-avatar">🤖</div>
            <div class="message-bubble">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-time">{{ message.timestamp }}</div>
            </div>
          </div>
        </div>
        
        <!-- 输入状态指示器 -->
        <div v-if="isTyping" class="typing-indicator">
          <div class="message-content">
            <div class="message-avatar">🤖</div>
            <div class="message-bubble typing">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快捷命令 -->
      <div class="robot-commands">
        <div class="commands-title">快捷命令：</div>
        <div class="commands-list">
          <button 
            v-for="cmd in quickCommands"
            :key="cmd.command"
            class="command-btn"
            @click="executeCommand(cmd.command)"
            :title="cmd.description"
          >
            <span class="cmd-icon">{{ cmd.icon }}</span>
            <span class="cmd-text">{{ cmd.label }}</span>
          </button>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="robot-input">
        <input 
          v-model="inputText"
          type="text"
          placeholder="和机器人聊天..."
          @keyup.enter="sendMessage"
          @input="handleInput"
          ref="inputRef"
          class="input-field"
        />
        <button 
          class="send-btn btn btn-primary"
          @click="sendMessage"
          :disabled="!inputText.trim() || isTyping"
        >
          发送
        </button>
      </div>
      
      <!-- 功能介绍 -->
      <div class="robot-features">
        <div class="features-title">🌟 功能介绍</div>
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">😄</span>
            <span class="feature-text">冷笑话生成器</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏥</span>
            <span class="feature-text">请假理由助手</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">😤</span>
            <span class="feature-text">工作吐槽聊天</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💡</span>
            <span class="feature-text">摸鱼技巧分享</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'

// 状态管理
const chatStore = useChatStore()

// 响应式数据
const inputText = ref('')
const isTyping = ref(false)
const isOnline = ref(true)
const inputRef = ref(null)
const chatContainer = ref(null)

const quickCommands = ref([
  { command: '/joke', label: '冷笑话', icon: '😄', description: '让机器人讲个冷笑话' },
  { command: '/excuse', label: '请假理由', icon: '🏥', description: '生成一个请假借口' },
  { command: '/rant', label: '吐槽老板', icon: '😤', description: '和机器人一起吐槽' },
  { command: '/tip', label: '摸鱼技巧', icon: '💡', description: '获取摸鱼小贴士' }
])

// 方法
const sendMessage = () => {
  if (!inputText.value.trim() || isTyping.value) return
  
  // 添加用户消息
  chatStore.addRobotMessage(inputText.value, true)
  
  const message = inputText.value
  inputText.value = ''
  
  // 模拟机器人思考
  isTyping.value = true
  
  setTimeout(() => {
    if (message.startsWith('/')) {
      chatStore.executeRobotCommand(message)
    } else {
      // 普通聊天回复
      const responses = [
        '哈哈，我懂你的感受！工作就是这样，总有摸鱼的冲动 😅',
        '说得对！有时候适当的休息才能更好地工作呢 🐟',
        '我觉得你说的很有道理，要劳逸结合嘛 💭',
        'emmm...听起来你今天心情不错哦 😊',
        '嗯嗯，我完全理解！我们都需要一些放松的时间 🌟'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      chatStore.addRobotMessage(randomResponse, false)
    }
    isTyping.value = false
  }, 1500)
  
  // 重新聚焦输入框
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const executeCommand = (command) => {
  inputText.value = command
  sendMessage()
}

const handleInput = () => {
  // 可以在这里添加输入预处理逻辑
}

const formatMessage = (content) => {
  // 格式化消息内容
  return content.replace(/\n/g, '<br>')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.robotMessages.length, () => {
  scrollToBottom()
})

watch(isTyping, () => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.robot-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $gradient-robot;
  color: white;
}

.panel-header {
  padding: $spacing-lg;
  text-align: center;
  background: rgba(0,0,0,0.1);
}

.panel-title {
  font-size: $font-size-xl;
  font-weight: bold;
  margin: 0;
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: $spacing-lg;
  overflow: hidden;
}

.robot-status {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  background: rgba(255,255,255,0.1);
  padding: $spacing-md;
  border-radius: $border-radius;
}

.robot-avatar {
  position: relative;
}

.avatar-circle {
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: $primary-color;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #dc3545;
  border-radius: 50%;
  border: 2px solid white;
  
  &.active {
    background: $success-color;
  }
}

.robot-info {
  flex: 1;
}

.robot-name {
  font-size: $font-size-large;
  font-weight: bold;
  margin-bottom: $spacing-xs;
}

.robot-description {
  font-size: $font-size-small;
  opacity: 0.8;
}

.robot-chat {
  flex: 1;
  background: rgba(255,255,255,0.1);
  border-radius: $border-radius;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  overflow-y: auto;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 2px;
  }
}

.robot-message {
  margin-bottom: $spacing-md;
  
  &.user-message {
    .message-content {
      justify-content: flex-end;
    }
    
    .message-bubble {
      background: rgba(255,255,255,0.2);
      color: white;
    }
  }
}

.message-content {
  display: flex;
  align-items: flex-end;
  gap: $spacing-sm;
}

.message-avatar {
  width: 30px;
  height: 30px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-small;
  flex-shrink: 0;
}

.message-bubble {
  background: rgba(255,255,255,0.9);
  color: #333;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  max-width: 80%;
  word-wrap: break-word;
  
  &.typing {
    padding: $spacing-md;
  }
}

.message-text {
  line-height: 1.4;
  margin-bottom: $spacing-xs;
}

.message-time {
  font-size: 0.8em;
  opacity: 0.7;
  text-align: right;
}

.typing-indicator {
  margin-bottom: $spacing-md;
}

.typing-dots {
  display: flex;
  gap: 3px;
  
  span {
    width: 6px;
    height: 6px;
    background: #666;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

.robot-commands {
  margin-bottom: $spacing-md;
}

.commands-title {
  font-size: $font-size-small;
  margin-bottom: $spacing-sm;
  opacity: 0.9;
}

.commands-list {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.command-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius;
  cursor: pointer;
  font-size: $font-size-small;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-1px);
  }
}

.cmd-icon {
  font-size: 1em;
}

.robot-input {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.input-field {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  border: none;
  border-radius: $border-radius;
  background: rgba(255,255,255,0.9);
  color: #333;
  font-size: $font-size-base;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
}

.send-btn {
  background: $success-color;
  color: white;
  border: none;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:not(:disabled):hover {
    background: darken($success-color, 10%);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.robot-features {
  background: rgba(255,255,255,0.1);
  padding: $spacing-md;
  border-radius: $border-radius;
}

.features-title {
  font-size: $font-size-base;
  font-weight: bold;
  margin-bottom: $spacing-sm;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xs;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-small;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1em;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .panel-content {
    padding: $spacing-md;
  }
  
  .robot-status {
    flex-direction: column;
    text-align: center;
  }
  
  .commands-list {
    justify-content: center;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .robot-input {
    flex-direction: column;
  }
  
  .send-btn {
    width: 100%;
  }
}
</style> 
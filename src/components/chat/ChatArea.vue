<template>
  <div class="chat-area">
    <div class="messages-container" ref="messagesContainer">
      <MessageItem 
        v-for="message in chatStore.latestMessages"
        :key="message.id"
        :message="message"
      />
    </div>
    
    <InputArea @send-message="handleSendMessage" />
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import MessageItem from './MessageItem.vue'
import InputArea from './InputArea.vue'

// 状态管理
const chatStore = useChatStore()
const userStore = useUserStore()

// 响应式数据
const messagesContainer = ref(null)

// 方法
const handleSendMessage = (content, type = 'text') => {
  if (!content.trim()) return
  
  // 获取用户昵称，如果没有则使用默认值
  const userName = userStore.nickname || '摸鱼新手'
  
  // 如果是命令，处理机器人命令
  if (content.startsWith('/')) {
    chatStore.addMessage(content, userName, true, type)
    // 添加机器人响应
    setTimeout(() => {
      chatStore.executeRobotCommand(content)
    }, 500)
    return
  }
  
  // 普通消息
  chatStore.addMessage(content, userName, true, type)
  
  // 模拟其他用户的回复（演示用）
  setTimeout(() => {
    const responses = [
      { content: '哈哈，说得对！👍', author: '摸鱼大神' },
      { content: '我也是这样想的 😄', author: '划水专家' },
      { content: '有道理有道理 🎯', author: '工位躺尸王' },
      { content: '同感同感 💯', author: '假装忙碌者' }
    ]
    
    // 随机决定是否有人回复
    if (Math.random() > 0.7) {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      chatStore.addMessage(randomResponse.content, randomResponse.author, false, 'text')
    }
  }, 2000 + Math.random() * 3000) // 2-5秒后随机回复
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
</script>

<style lang="scss" scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fafafa;
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
  .messages-container {
    padding: $spacing-sm;
  }
}
</style> 
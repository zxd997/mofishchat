<template>
  <div class="input-area">
    <div class="input-container">
      <input 
        v-model="inputText"
        type="text" 
        class="input-box"
        placeholder="输入消息或命令（如 /joke, /excuse, /rant）..."
        @keyup.enter="handleSend"
        @keydown="handleKeyDown"
        ref="inputRef"
      />
      
      <div class="quick-buttons">
        <button 
          class="quick-button btn btn-secondary"
          @click="sendQuickMessage('/joke')"
        >
          😄 冷笑话
        </button>
        <button 
          class="quick-button btn btn-secondary"
          @click="sendQuickMessage('/excuse')"
        >
          🏥 请假理由
        </button>
        <button 
          class="quick-button btn btn-secondary"
          @click="sendQuickMessage('/rant')"
        >
          😤 吐槽模式
        </button>
      </div>
      
      <button 
        class="send-button btn btn-primary"
        @click="handleSend"
        :disabled="!inputText.trim()"
      >
        <span class="send-icon">📤</span>
        <span class="send-text">发送</span>
      </button>
    </div>
    
    <!-- 命令提示 -->
    <div v-if="showCommandHints" class="command-hints">
      <div class="hint-title">💡 可用命令：</div>
      <div class="hints-list">
        <span class="hint-item" @click="selectCommand('/joke')">😄 /joke - 讲个冷笑话</span>
        <span class="hint-item" @click="selectCommand('/excuse')">🏥 /excuse - 生成请假理由</span>
        <span class="hint-item" @click="selectCommand('/rant')">😤 /rant - 吐槽老板</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// 定义事件
const emit = defineEmits(['send-message'])

// 响应式数据
const inputText = ref('')
const inputRef = ref(null)

// 计算属性
const showCommandHints = computed(() => {
  return inputText.value.startsWith('/') && inputText.value.length > 1
})

// 方法
const handleSend = () => {
  if (!inputText.value.trim()) return
  
  emit('send-message', inputText.value)
  inputText.value = ''
  
  // 重新聚焦输入框
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const sendQuickMessage = (command) => {
  emit('send-message', command)
  inputRef.value?.focus()
}

const selectCommand = (command) => {
  inputText.value = command + ' '
  inputRef.value?.focus()
}

const handleKeyDown = (event) => {
  // Ctrl+Enter 也可以发送
  if (event.ctrlKey && event.key === 'Enter') {
    handleSend()
  }
}
</script>

<style lang="scss" scoped>
.input-area {
  background: white;
  border-top: 1px solid #e0e0e0;
  position: relative;
}

.input-container {
  padding: $spacing-lg;
  display: flex;
  gap: $spacing-sm;
  align-items: flex-end;
  flex-wrap: wrap;
}

.input-box {
  flex: 1;
  min-width: 200px;
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: $font-size-base;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: $primary-color;
  }
  
  &::placeholder {
    color: #999;
  }
}

.quick-buttons {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.quick-button {
  font-size: $font-size-small;
  padding: 8px 15px;
  border-radius: $border-radius;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  
  &:hover {
    transform: translateY(-1px);
  }
}

.send-button {
  border-radius: $border-radius-large;
  padding: 12px 24px;
  font-weight: 600;
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: $shadow-medium;
  }
}

.send-icon {
  font-size: 1.1em;
}

.command-hints {
  position: absolute;
  bottom: 100%;
  left: $spacing-lg;
  right: $spacing-lg;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: $border-radius $border-radius 0 0;
  padding: $spacing-sm $spacing-md;
  box-shadow: $shadow-light;
  z-index: 10;
}

.hint-title {
  font-size: $font-size-small;
  color: #666;
  margin-bottom: $spacing-xs;
  font-weight: 600;
}

.hints-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.hint-item {
  font-size: $font-size-small;
  color: $primary-color;
  cursor: pointer;
  padding: $spacing-xs;
  border-radius: $spacing-xs;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(66, 165, 245, 0.1);
  }
}

@media (max-width: 768px) {
  .input-container {
    padding: $spacing-sm;
    flex-direction: column;
    align-items: stretch;
  }
  
  .input-box {
    min-width: auto;
    margin-bottom: $spacing-sm;
  }
  
  .quick-buttons {
    margin-bottom: $spacing-sm;
    justify-content: center;
  }
  
  .quick-button {
    flex: 1;
    min-width: 0;
  }
  
  .send-button {
    width: 100%;
  }
  
  .command-hints {
    left: $spacing-sm;
    right: $spacing-sm;
  }
}
</style> 
<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal" @click.stop>
      <div class="modal-title">设置你的今日昵称</div>
      
      <div class="modal-content">
        <input 
          v-model="nickname"
          type="text" 
          class="modal-input"
          placeholder="输入昵称..."
          @keyup.enter="handleSave"
          ref="inputRef"
          maxlength="20"
        />
        
        <button 
          class="random-button btn btn-secondary w-full"
          @click="generateRandom"
        >
          🎲 随机生成
        </button>
        
        <div class="modal-hint">
          💡 昵称每天更新，仅今日有效
        </div>
      </div>
      
      <div class="modal-buttons">
        <button 
          class="modal-button btn btn-secondary"
          @click="handleClose"
        >
          取消
        </button>
        <button 
          class="modal-button btn btn-primary"
          @click="handleSave"
          :disabled="!nickname.trim()"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// 定义事件
const emit = defineEmits(['close', 'save'])

// 状态管理
const userStore = useUserStore()

// 响应式数据
const nickname = ref('')
const inputRef = ref(null)

// 方法
const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  if (!nickname.value.trim()) return
  emit('save', nickname.value.trim())
}

const generateRandom = () => {
  nickname.value = userStore.generateRandomNickname()
}

// 生命周期
onMounted(() => {
  // 自动聚焦输入框
  nextTick(() => {
    inputRef.value?.focus()
  })
  
  // 如果已有昵称，预填
  if (userStore.nickname) {
    nickname.value = userStore.nickname
  } else {
    // 默认生成一个随机昵称
    generateRandom()
  }
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal {
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-large;
  box-shadow: $shadow-heavy;
  min-width: 400px;
  max-width: 90vw;
  animation: slideIn 0.3s ease;
}

.modal-title {
  font-size: $font-size-xl;
  color: $primary-color;
  margin-bottom: $spacing-lg;
  text-align: center;
  font-weight: bold;
}

.modal-content {
  margin-bottom: $spacing-lg;
}

.modal-input {
  width: 100%;
  padding: $spacing-md;
  border: 2px solid #e0e0e0;
  border-radius: $border-radius;
  margin-bottom: $spacing-md;
  font-size: $font-size-base;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: $primary-color;
  }
}

.random-button {
  margin-bottom: $spacing-md;
  
  &:hover {
    transform: scale(1.02);
  }
}

.modal-hint {
  text-align: center;
  color: #666;
  font-size: $font-size-small;
  background: #f5f5f5;
  padding: $spacing-sm;
  border-radius: $border-radius;
  margin-bottom: $spacing-md;
}

.modal-buttons {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
}

.modal-button {
  padding: 12px 30px;
  border-radius: $border-radius;
  font-size: $font-size-base;
  font-weight: 600;
  min-width: 100px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal {
    min-width: 90%;
    margin: 0 5%;
    padding: $spacing-lg;
  }
  
  .modal-buttons {
    flex-direction: column;
  }
  
  .modal-button {
    width: 100%;
  }
}
</style> 
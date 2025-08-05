<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="win-modal" @click.stop>
      <div class="celebration-animation">
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
      </div>
      
      <div class="win-content">
        <div class="win-title">🎉 恭喜中奖！</div>
        
        <div class="prize-display">
          <div class="prize-icon-large">{{ prize.icon }}</div>
          <div class="prize-name-large">{{ prize.name }}</div>
        </div>
        
        <div class="win-message">
          恭喜您获得了"{{ prize.name }}"！<br>
          继续摸鱼，祝您工作愉快！
        </div>
        
        <button class="close-button btn btn-primary" @click="handleClose">
          太棒了！
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// 定义属性
const props = defineProps({
  prize: {
    type: Object,
    required: true
  }
})

// 定义事件
const emit = defineEmits(['close'])

// 方法
const handleClose = () => {
  emit('close')
}

// 生命周期
onMounted(() => {
  // 播放庆祝音效（如果需要）
  // 可以在这里添加音效播放逻辑
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.win-modal {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  padding: $spacing-xxl;
  border-radius: $border-radius-large;
  box-shadow: $shadow-heavy;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-width: 350px;
  max-width: 90vw;
  animation: bounceIn 0.6s ease;
}

.celebration-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ffd700;
  animation: confettifall 3s infinite ease-in-out;
  
  &:nth-child(1) {
    left: 10%;
    animation-delay: 0s;
    background: #ff6b6b;
  }
  
  &:nth-child(2) {
    left: 30%;
    animation-delay: 0.5s;
    background: #4ecdc4;
  }
  
  &:nth-child(3) {
    left: 50%;
    animation-delay: 1s;
    background: #45b7d1;
  }
  
  &:nth-child(4) {
    left: 70%;
    animation-delay: 1.5s;
    background: #96ceb4;
  }
  
  &:nth-child(5) {
    left: 90%;
    animation-delay: 2s;
    background: #ffeaa7;
  }
}

.win-content {
  position: relative;
  z-index: 1;
  color: white;
}

.win-title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: $spacing-lg;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}

.prize-display {
  background: rgba(255,255,255,0.2);
  border-radius: $border-radius-large;
  padding: $spacing-xl;
  margin: $spacing-lg 0;
  border: 3px solid rgba(255,255,255,0.3);
}

.prize-icon-large {
  font-size: 4em;
  margin-bottom: $spacing-sm;
  animation: bounce 1s infinite;
}

.prize-name-large {
  font-size: $font-size-xl;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.win-message {
  font-size: $font-size-large;
  margin: $spacing-lg 0;
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.close-button {
  background: rgba(255,255,255,0.9);
  color: $primary-color;
  border: none;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-large;
  font-size: $font-size-large;
  font-weight: bold;
  cursor: pointer;
  margin-top: $spacing-lg;
  box-shadow: $shadow-medium;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: $shadow-heavy;
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

@keyframes bounceIn {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(5deg);
  }
  70% {
    transform: scale(0.9) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes confettifall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .win-modal {
    min-width: 90%;
    padding: $spacing-lg;
  }
  
  .win-title {
    font-size: 2em;
  }
  
  .prize-icon-large {
    font-size: 3em;
  }
}
</style> 
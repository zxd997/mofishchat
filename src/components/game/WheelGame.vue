<template>
  <div class="wheel-game">
    <div class="panel-header">
      <h2 class="panel-title">🎰 摸鱼大转盘</h2>
    </div>
    
    <div class="panel-content">
      <!-- 转盘区域 -->
      <div class="wheel-container">
        <div 
          class="wheel"
          :class="{ spinning: gameStore.wheelSpinning }"
          :style="{ transform: `rotate(${rotation}deg)` }"
        >
          <div 
            v-for="(prize, index) in gameStore.wheelPrizes"
            :key="index"
            class="wheel-section"
            :style="getSectionStyle(index)"
          >
            <div class="prize-content">
              <div class="prize-icon">{{ prize.icon }}</div>
              <div class="prize-text">{{ prize.name }}</div>
            </div>
          </div>
          
          <div class="wheel-center">🎯</div>
        </div>
        
        <!-- 指针 -->
        <div class="wheel-pointer"></div>
      </div>
      
      <!-- 奖品说明 -->
      <div class="prizes-grid">
        <div 
          v-for="(prize, index) in gameStore.wheelPrizes"
          :key="index"
          class="prize-item"
        >
          <span class="prize-icon-small">{{ prize.icon }}</span>
          <span class="prize-name">{{ prize.name }}</span>
        </div>
      </div>
      
      <!-- 抽奖按钮 -->
      <div class="spin-section">
        <button 
          class="spin-button btn btn-accent"
          @click="handleSpin"
          :disabled="gameStore.dailySpinUsed || gameStore.wheelSpinning"
        >
          <span class="spin-icon">🎲</span>
          <span class="spin-text">
            {{ gameStore.wheelSpinning ? '转盘旋转中...' : (gameStore.dailySpinUsed ? '今日已抽奖' : '开始抽奖') }}
          </span>
        </button>
        
        <div v-if="gameStore.dailySpinUsed && !gameStore.wheelSpinning" class="spin-hint">
          ⏰ 每天只能抽一次，明天再来～
        </div>
      </div>
      
      <!-- 中奖记录 -->
      <div class="winners-section">
        <div class="section-title">🏆 最近中奖记录</div>
        <div class="winners-list">
          <div 
            v-for="winner in gameStore.recentWinners"
            :key="winner.nickname + winner.prize"
            class="winner-item"
          >
            <span class="winner-icon">{{ winner.icon }}</span>
            <span class="winner-text">
              <strong>{{ winner.nickname }}</strong> 获得了 "{{ winner.prize }}"
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 中奖弹窗 -->
    <WinModal 
      v-if="showWinModal"
      :prize="currentPrize"
      @close="showWinModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import WinModal from './WinModal.vue'

// 状态管理
const gameStore = useGameStore()

// 响应式数据
const rotation = ref(0)
const showWinModal = ref(false)
const currentPrize = ref(null)

// 方法
const handleSpin = async () => {
  if (gameStore.dailySpinUsed || gameStore.wheelSpinning) return
  
  try {
    // 生成随机旋转角度
    const spins = 5 + Math.random() * 5 // 5-10圈
    const finalAngle = Math.random() * 360 // 最终停止角度
    const totalRotation = spins * 360 + finalAngle
    
    // 应用旋转动画
    rotation.value += totalRotation
    
    // 开始转盘
    const prize = await gameStore.spinWheel()
    
    if (prize) {
      currentPrize.value = prize
      showWinModal.value = true
    }
  } catch (error) {
    console.error('转盘抽奖失败:', error)
  }
}

const getSectionStyle = (index) => {
  const angle = (360 / gameStore.wheelPrizes.length) * index
  const sectionAngle = 360 / gameStore.wheelPrizes.length
  
  return {
    transform: `rotate(${angle}deg)`,
    background: `conic-gradient(from ${angle}deg, ${gameStore.wheelPrizes[index].color} 0deg, ${gameStore.wheelPrizes[index].color} ${sectionAngle}deg, transparent ${sectionAngle}deg)`
  }
}
</script>

<style lang="scss" scoped>
.wheel-game {
  height: 100%;
  overflow-y: auto;
  background: white;
}

.panel-header {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  padding: $spacing-lg;
  color: white;
  text-align: center;
}

.panel-title {
  font-size: $font-size-xl;
  font-weight: bold;
  margin: 0;
}

.panel-content {
  padding: $spacing-xl;
  text-align: center;
}

.wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: $spacing-xl auto;
}

.wheel {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #ff6b6b 0deg 45deg,
    #4ecdc4 45deg 90deg,
    #45b7d1 90deg 135deg,
    #96ceb4 135deg 180deg,
    #ffeaa7 180deg 225deg,
    #dda0dd 225deg 270deg,
    #98d8c8 270deg 315deg,
    #ffaaa5 315deg 360deg
  );
  border: 8px solid #333;
  box-shadow: $shadow-heavy;
  transition: transform 3s cubic-bezier(0.23, 1, 0.320, 1);
  
  &.spinning {
    transition: transform 3s cubic-bezier(0.23, 1, 0.320, 1);
  }
}

.wheel-section {
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prize-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(22.5deg);
  margin-top: -20px;
}

.prize-icon {
  font-size: 1.5em;
  margin-bottom: 5px;
}

.prize-text {
  font-size: 0.7em;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  text-align: center;
  line-height: 1.1;
}

.wheel-pointer {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #333;
  z-index: 10;
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: $font-size-large;
  z-index: 5;
}

.prizes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-sm;
  margin: $spacing-xl 0;
  background: #f5f5f5;
  padding: $spacing-lg;
  border-radius: $border-radius;
}

.prize-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background: white;
  border-radius: $border-radius-small;
  box-shadow: $shadow-light;
}

.prize-icon-small {
  font-size: $font-size-large;
}

.prize-name {
  font-size: $font-size-small;
  text-align: center;
  line-height: 1.2;
}

.spin-section {
  margin: $spacing-xl 0;
}

.spin-button {
  background: linear-gradient(45deg, $accent-color, #ff8e53);
  color: white;
  border: none;
  padding: $spacing-lg $spacing-xxl;
  border-radius: 25px;
  font-size: $font-size-large;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  box-shadow: $shadow-medium;
  transition: all 0.3s ease;
  
  &:not(:disabled):hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: $shadow-heavy;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.spin-icon {
  font-size: 1.3em;
}

.spin-hint {
  color: $warning-color;
  font-size: $font-size-small;
  margin-top: $spacing-sm;
  font-style: italic;
}

.winners-section {
  margin-top: $spacing-xl;
}

.section-title {
  font-size: $font-size-large;
  font-weight: bold;
  margin-bottom: $spacing-md;
  color: #333;
}

.winners-list {
  background: #f5f5f5;
  border-radius: $border-radius;
  padding: $spacing-lg;
  text-align: left;
}

.winner-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin: $spacing-sm 0;
  padding: $spacing-sm;
  background: white;
  border-radius: $border-radius-small;
  box-shadow: $shadow-light;
}

.winner-icon {
  font-size: $font-size-large;
}

.winner-text {
  font-size: $font-size-small;
  color: #666;
  
  strong {
    color: $primary-color;
  }
}

@media (max-width: 768px) {
  .wheel {
    width: 250px;
    height: 250px;
  }
  
  .prizes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .panel-content {
    padding: $spacing-lg;
  }
  
  .spin-button {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-base;
  }
}
</style> 
<template>
  <div class="welcome-panel">
    <div class="welcome-content">
      <!-- 主标题 -->
      <div class="welcome-header">
        <div class="logo-large">
          <span class="logo-icon">🐟</span>
          <span class="logo-text">摸鱼星球</span>
        </div>
        <div class="welcome-subtitle">
          您的专属摸鱼聊天室
        </div>
      </div>
      
      <!-- 功能介绍 -->
      <div class="features-showcase">
        <div class="feature-card" @click="navigateTo('chat')">
          <div class="feature-icon">💬</div>
          <div class="feature-title">匿名聊天</div>
          <div class="feature-desc">和其他摸鱼爱好者畅聊工作趣事</div>
        </div>
        
        <div class="feature-card" @click="navigateTo('checkin')">
          <div class="feature-icon">📊</div>
          <div class="feature-title">摸鱼打卡</div>
          <div class="feature-desc">记录您的摸鱼时光，冲击排行榜</div>
        </div>
        
        <div class="feature-card" @click="navigateTo('wheel')">
          <div class="feature-icon">🎲</div>
          <div class="feature-title">幸运转盘</div>
          <div class="feature-desc">每日转盘抽奖，获取神秘奖励</div>
        </div>
        
        <div class="feature-card" @click="navigateTo('robot')">
          <div class="feature-icon">🤖</div>
          <div class="feature-title">AI助手</div>
          <div class="feature-desc">智能机器人陪您聊天解闷</div>
        </div>
      </div>
      
      <!-- 使用统计 -->
      <div class="stats-section">
        <div class="stats-title">📈 实时数据</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ onlineUsers }}</div>
            <div class="stat-label">在线摸鱼</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ todayMessages }}</div>
            <div class="stat-label">今日消息</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalFishingTime }}</div>
            <div class="stat-label">总摸鱼时长</div>
          </div>
        </div>
      </div>
      
      <!-- 快速开始 -->
      <div class="quick-start">
        <div class="start-title">🚀 快速开始</div>
        <div class="start-buttons">
          <button class="start-btn primary" @click="navigateTo('chat')">
            <span class="btn-icon">💬</span>
            <span class="btn-text">开始聊天</span>
          </button>
          <button class="start-btn secondary" @click="showNicknameModal()">
            <span class="btn-icon">🧑‍🚀</span>
            <span class="btn-text">设置昵称</span>
          </button>
        </div>
      </div>
      
      <!-- 使用提示 -->
      <div class="tips-section">
        <div class="tips-title">💡 使用小贴士</div>
        <div class="tips-list">
          <div class="tip-item">
            <span class="tip-icon">🎭</span>
            <span class="tip-text">每天可以更换一次匿名昵称，保护隐私</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <span class="tip-text">使用命令 /joke, /excuse, /rant 与AI互动</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🎁</span>
            <span class="tip-text">每日签到打卡，获取摸鱼币奖励</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔥</span>
            <span class="tip-text">参与话题讨论，分享你的摸鱼心得</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// 状态管理
const userStore = useUserStore()

// 注入方法
const switchView = inject('switchView')
const showNicknameModal = inject('showNicknameModal')

// 响应式数据
const onlineUsers = ref(0)
const todayMessages = ref(0)
const totalFishingTime = ref('')

// 方法
const navigateTo = (view) => {
  switchView(view)
}

const animateNumber = (target, duration = 2000) => {
  return new Promise((resolve) => {
    const startValue = 0
    const endValue = target
    const startTime = Date.now()
    
    const updateValue = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress)
      
      if (progress < 1) {
        requestAnimationFrame(updateValue)
      } else {
        resolve()
      }
      
      return currentValue
    }
    
    updateValue()
  })
}

// 生命周期
onMounted(async () => {
  // 模拟实时数据动画
  const targetOnline = 15 + Math.floor(Math.random() * 10)
  const targetMessages = 180 + Math.floor(Math.random() * 50)
  
  // 数字动画
  let onlineAnimation = { value: 0 }
  let messagesAnimation = { value: 0 }
  
  const animateOnline = () => {
    const duration = 1500
    const startTime = Date.now()
    
    const update = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      onlineAnimation.value = Math.floor(targetOnline * progress)
      onlineUsers.value = onlineAnimation.value
      
      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }
    update()
  }
  
  const animateMessages = () => {
    const duration = 2000
    const startTime = Date.now()
    
    const update = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      messagesAnimation.value = Math.floor(targetMessages * progress)
      todayMessages.value = messagesAnimation.value
      
      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }
    update()
  }
  
  // 延迟启动动画
  setTimeout(animateOnline, 500)
  setTimeout(animateMessages, 800)
  
  // 摸鱼时长
  totalFishingTime.value = '2847小时'
})
</script>

<style lang="scss" scoped>
.welcome-panel {
  height: 100%;
  overflow-y: auto;
  background: $gradient-primary;
  padding: $spacing-xl;
}

.welcome-content {
  max-width: 1000px;
  margin: 0 auto;
}

.welcome-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
}

.logo-large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.logo-icon {
  font-size: 4em;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-size: 3em;
  font-weight: bold;
  background: linear-gradient(45deg, $primary-color, $secondary-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: $font-size-xl;
  color: #666;
  font-weight: 500;
}

.features-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xxl;
}

.feature-card {
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-large;
  text-align: center;
  box-shadow: $shadow-medium;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-heavy;
  }
}

.feature-icon {
  font-size: 3em;
  margin-bottom: $spacing-md;
}

.feature-title {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: $spacing-sm;
}

.feature-desc {
  color: #666;
  line-height: 1.5;
}

.stats-section {
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-large;
  text-align: center;
  margin-bottom: $spacing-xxl;
  box-shadow: $shadow-medium;
}

.stats-title {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: $spacing-lg;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.stat-item {
  padding: $spacing-lg;
  background: #f8f9fa;
  border-radius: $border-radius;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: $spacing-xs;
  font-family: 'Courier New', monospace;
}

.stat-label {
  color: #666;
  font-size: $font-size-small;
}

.quick-start {
  text-align: center;
  margin-bottom: $spacing-xxl;
}

.start-title {
  font-size: $font-size-xl;
  font-weight: bold;
  color: #333;
  margin-bottom: $spacing-lg;
}

.start-buttons {
  display: flex;
  gap: $spacing-lg;
  justify-content: center;
  flex-wrap: wrap;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border: none;
  border-radius: $border-radius-large;
  font-size: $font-size-large;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(45deg, $primary-color, #1976d2);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: $shadow-heavy;
    }
  }
  
  &.secondary {
    background: linear-gradient(45deg, $secondary-color, #ff9800);
    color: white;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: $shadow-heavy;
    }
  }
}

.btn-icon {
  font-size: 1.2em;
}

.tips-section {
  background: rgba(255,255,255,0.8);
  padding: $spacing-xl;
  border-radius: $border-radius-large;
  backdrop-filter: blur(10px);
}

.tips-title {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: $spacing-lg;
  text-align: center;
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-md;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: white;
  border-radius: $border-radius;
  box-shadow: $shadow-light;
}

.tip-icon {
  font-size: $font-size-large;
  flex-shrink: 0;
}

.tip-text {
  color: #666;
  line-height: 1.4;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .welcome-panel {
    padding: $spacing-lg;
  }
  
  .logo-icon {
    font-size: 3em;
  }
  
  .logo-text {
    font-size: 2em;
  }
  
  .features-showcase {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .start-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .start-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .tips-list {
    grid-template-columns: 1fr;
  }
}
</style> 
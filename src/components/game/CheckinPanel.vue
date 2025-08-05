<template>
  <div class="checkin-panel">
    <div class="panel-header">
      <h2 class="panel-title">🕘 摸鱼打卡面板</h2>
    </div>
    
    <div class="panel-content">
      <!-- 打卡区域 -->
      <div class="checkin-section">
        <div class="time-display-label">今日摸鱼时长</div>
        <div class="timer-display">{{ gameStore.formattedTodayTime }}</div>
        
        <button 
          class="checkin-button btn"
          :class="gameStore.isCheckedIn ? 'btn-accent' : 'btn-success'"
          @click="toggleCheckIn"
        >
          <span class="button-icon">{{ gameStore.isCheckedIn ? '⏸️' : '▶️' }}</span>
          <span class="button-text">{{ gameStore.isCheckedIn ? '暂停摸鱼' : '继续摸鱼' }}</span>
        </button>
      </div>
      
      <!-- 排行榜 -->
      <div class="ranking-section">
        <div class="section-title">🏆 今日摸鱼排行榜</div>
        <div class="ranking-list">
          <div 
            v-for="(item, index) in gameStore.rankingList"
            :key="item.nickname"
            class="ranking-item"
            :class="getRankingClass(index + 1)"
          >
            <div class="rank-info">
              <span class="rank-icon">{{ getRankIcon(index + 1) }}</span>
              <span class="rank-nickname">{{ item.nickname }}</span>
            </div>
            <span class="rank-time">{{ gameStore.formatTime(item.time) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 历史记录 -->
      <div class="history-section">
        <div class="section-title">📅 最近7日记录</div>
        <div class="history-list">
          <div 
            v-for="record in gameStore.fishingHistory"
            :key="record.date"
            class="history-item"
          >
            <span class="history-date">{{ record.date }}:</span>
            <span class="history-time">{{ gameStore.formatTime(record.time) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'

// 状态管理
const gameStore = useGameStore()
const userStore = useUserStore()

// 方法
const toggleCheckIn = () => {
  if (gameStore.isCheckedIn) {
    gameStore.stopCheckIn()
  } else {
    gameStore.startCheckIn()
  }
}

const getRankingClass = (rank) => {
  const classes = ['top1', 'top2', 'top3']
  return rank <= 3 ? classes[rank - 1] : ''
}

const getRankIcon = (rank) => {
  const icons = ['👑', '🥈', '🥉']
  return rank <= 3 ? icons[rank - 1] : '🚀'
}
</script>

<style lang="scss" scoped>
.checkin-panel {
  height: 100%;
  overflow-y: auto;
  background: white;
}

.panel-header {
  background: $gradient-topbar;
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
}

.checkin-section {
  text-align: center;
  margin-bottom: $spacing-xxl;
}

.time-display-label {
  font-size: $font-size-large;
  color: #666;
  margin-bottom: $spacing-sm;
  font-weight: 500;
}

.timer-display {
  font-size: 3em;
  color: $primary-color;
  margin: $spacing-lg 0;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.checkin-button {
  background: linear-gradient(45deg, $success-color, #66bb6a);
  color: white;
  border: none;
  padding: $spacing-lg $spacing-xxl;
  border-radius: 25px;
  font-size: $font-size-large;
  cursor: pointer;
  margin: $spacing-lg 0;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  box-shadow: $shadow-medium;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-heavy;
  }
  
  &.btn-accent {
    background: linear-gradient(45deg, $accent-color, #ff8e53);
  }
}

.button-icon {
  font-size: 1.2em;
}

.section-title {
  font-size: $font-size-large;
  font-weight: bold;
  margin-bottom: $spacing-md;
  color: #333;
  text-align: center;
}

.ranking-section {
  margin-bottom: $spacing-xxl;
}

.ranking-list {
  background: #f5f5f5;
  border-radius: $border-radius;
  padding: $spacing-lg;
}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  margin: $spacing-xs 0;
  background: white;
  border-radius: $border-radius-small;
  box-shadow: $shadow-light;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
  }
  
  &.top1 {
    background: linear-gradient(45deg, #ffd700, #ffeb3b);
    color: #333;
    font-weight: bold;
  }
  
  &.top2 {
    background: linear-gradient(45deg, #c0c0c0, #e0e0e0);
    color: #333;
    font-weight: bold;
  }
  
  &.top3 {
    background: linear-gradient(45deg, #cd7f32, #d4af37);
    color: white;
    font-weight: bold;
  }
}

.rank-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.rank-icon {
  font-size: $font-size-large;
}

.rank-nickname {
  font-weight: 500;
}

.rank-time {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.history-section {
  text-align: center;
}

.history-list {
  background: #f9f9f9;
  border-radius: $border-radius;
  padding: $spacing-lg;
}

.history-item {
  display: flex;
  justify-content: center;
  gap: $spacing-sm;
  margin: $spacing-xs 0;
  font-size: $font-size-small;
  color: #666;
}

.history-date {
  font-weight: 500;
}

.history-time {
  font-family: 'Courier New', monospace;
  color: $primary-color;
  font-weight: bold;
}

@media (max-width: 768px) {
  .panel-content {
    padding: $spacing-lg;
  }
  
  .timer-display {
    font-size: 2.5em;
  }
  
  .checkin-button {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-base;
  }
  
  .ranking-item {
    padding: $spacing-sm;
  }
  
  .rank-info {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-xs;
  }
}
</style> 
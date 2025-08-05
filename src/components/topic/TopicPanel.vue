<template>
  <div class="topic-panel">
    <div class="panel-header">
      <h2 class="panel-title">📅 每日摸鱼话题栏</h2>
    </div>
    
    <div class="panel-content">
      <!-- 当前话题 -->
      <div class="current-topic">
        <div class="topic-card">
          <div class="topic-header">💬 今日话题</div>
          <div class="topic-content">{{ chatStore.currentTopic }}</div>
          <div class="topic-actions">
            <button 
              class="topic-action-btn btn btn-secondary"
              @click="changeTopic"
            >
              换一个话题
            </button>
            <button 
              class="topic-action-btn btn btn-primary"
              @click="joinDiscussion"
            >
              参与讨论
            </button>
          </div>
        </div>
      </div>
      
      <!-- 话题统计 -->
      <div class="topic-stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">💬</div>
            <div class="stat-value">{{ todayDiscussions }}</div>
            <div class="stat-label">今日讨论</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">👥</div>
            <div class="stat-value">{{ activeUsers }}</div>
            <div class="stat-label">活跃用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ hotTopics }}</div>
            <div class="stat-label">热门话题</div>
          </div>
        </div>
      </div>
      
      <!-- 话题历史 -->
      <div class="topic-history">
        <div class="section-title">🔥 热门话题历史</div>
        <div class="history-list">
          <div 
            v-for="(topic, index) in chatStore.topicHistory"
            :key="index"
            class="history-item"
            @click="selectHistoryTopic(topic)"
          >
            <div class="history-content">
              <span class="history-icon">📝</span>
              <span class="history-text">{{ topic }}</span>
            </div>
            <div class="history-meta">
              <span class="history-engagement">{{ getRandomEngagement() }}人参与</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 话题建议 -->
      <div class="topic-suggestions">
        <div class="section-title">💡 话题建议</div>
        <div class="suggestions-grid">
          <div 
            v-for="suggestion in topicSuggestions"
            :key="suggestion"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <span class="suggestion-icon">💭</span>
            <span class="suggestion-text">{{ suggestion }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useChatStore } from '@/stores/chat'

// 状态管理
const chatStore = useChatStore()

// 注入方法
const switchView = inject('switchView')

// 响应式数据
const todayDiscussions = ref(23)
const activeUsers = ref(12)
const hotTopics = ref(5)

const topicSuggestions = ref([
  '分享一个上班划水的好方法',
  '如果老板能听到你的心声',
  '最想对同事说的一句话',
  '描述你理想中的工作环境',
  '上班时最怕遇到的事情',
  '你的摸鱼技能等级是多少'
])

// 方法
const changeTopic = () => {
  chatStore.changeTopic()
}

const joinDiscussion = () => {
  // 切换到聊天界面
  switchView('chat')
}

const selectHistoryTopic = (topic) => {
  // 设置选中的历史话题为当前话题
  chatStore.currentTopic = topic
  chatStore.addMessage(`话题已切换：${topic}`, '系统', false, 'system')
  joinDiscussion()
}

const selectSuggestion = (suggestion) => {
  // 设置建议话题为当前话题
  chatStore.currentTopic = suggestion
  chatStore.addMessage(`新话题：${suggestion}`, '系统', false, 'system')
  joinDiscussion()
}

const getRandomEngagement = () => {
  return Math.floor(Math.random() * 20) + 5 // 5-24人参与
}
</script>

<style lang="scss" scoped>
.topic-panel {
  height: 100%;
  overflow-y: auto;
  background: white;
}

.panel-header {
  background: linear-gradient(45deg, $primary-color, #ab47bc);
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

.current-topic {
  margin-bottom: $spacing-xl;
}

.topic-card {
  background: linear-gradient(45deg, $primary-color, #ab47bc);
  color: white;
  padding: $spacing-xl;
  border-radius: $border-radius-large;
  text-align: center;
  box-shadow: $shadow-medium;
}

.topic-header {
  font-size: $font-size-large;
  margin-bottom: $spacing-sm;
  font-weight: 600;
}

.topic-content {
  font-size: $font-size-large;
  margin-bottom: $spacing-md;
  line-height: 1.4;
  font-weight: 500;
}

.topic-actions {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
  flex-wrap: wrap;
}

.topic-action-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
  
  &.btn-primary {
    background: $success-color;
    
    &:hover {
      background: darken($success-color, 10%);
    }
  }
}

.topic-stats {
  margin-bottom: $spacing-xl;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.stat-item {
  background: #f8f9fa;
  padding: $spacing-lg;
  border-radius: $border-radius;
  text-align: center;
  box-shadow: $shadow-light;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.stat-icon {
  font-size: 2em;
  margin-bottom: $spacing-sm;
}

.stat-value {
  font-size: $font-size-xl;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: $font-size-small;
  color: #666;
}

.section-title {
  font-size: $font-size-large;
  font-weight: bold;
  margin-bottom: $spacing-md;
  color: #333;
  text-align: center;
}

.topic-history {
  margin-bottom: $spacing-xl;
}

.history-list {
  background: #f5f5f5;
  border-radius: $border-radius;
  padding: $spacing-lg;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  margin: $spacing-xs 0;
  background: white;
  border-radius: $border-radius-small;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: $shadow-light;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: $shadow-medium;
  }
}

.history-content {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
}

.history-icon {
  font-size: $font-size-large;
}

.history-text {
  font-size: $font-size-small;
  line-height: 1.3;
}

.history-meta {
  font-size: $font-size-small;
  color: #666;
}

.topic-suggestions {
  margin-bottom: $spacing-xl;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
}

.suggestion-item {
  background: linear-gradient(45deg, #e8f5e8, #fff3e0);
  padding: $spacing-md;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: $shadow-medium;
  }
}

.suggestion-icon {
  font-size: $font-size-large;
}

.suggestion-text {
  font-size: $font-size-small;
  line-height: 1.3;
  color: #2e7d32;
  font-weight: 500;
}

@media (max-width: 768px) {
  .panel-content {
    padding: $spacing-lg;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
  
  .topic-actions {
    flex-direction: column;
  }
  
  .topic-action-btn {
    width: 100%;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-xs;
  }
}
</style> 
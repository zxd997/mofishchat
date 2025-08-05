<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div 
        v-for="item in menuItems" 
        :key="item.key"
        class="sidebar-item"
        :class="{ active: activeView === item.key }"
        @click="handleItemClick(item.key)"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="text">{{ item.label }}</span>
      </div>
    </div>
    
    <!-- 在线用户显示 -->
    <div class="sidebar-footer">
      <OnlineUsers />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import OnlineUsers from '@/components/common/OnlineUsers.vue'

// 定义事件
const emit = defineEmits(['view-change'])

// 注入方法
const showNicknameModal = inject('showNicknameModal')

// 响应式数据
const activeView = ref('chat')

const menuItems = [
  { key: 'chat', icon: '🏠', label: '首页' },
  { key: 'nickname', icon: '🧑‍🚀', label: '今日昵称' },
  { key: 'checkin', icon: '📊', label: '摸鱼排行榜' },
  { key: 'wheel', icon: '🎲', label: '摸鱼大转盘' },
  { key: 'robot', icon: '🤖', label: '摸鱼机器人' }
]

// 方法
const handleItemClick = (key) => {
  if (key === 'nickname') {
    // 触发昵称设置弹窗
    showNicknameModal()
    return
  }
  
  activeView.value = key
  emit('view-change', key)
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sidebar-width;
  background: $gradient-sidebar;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-medium;
  height: 100vh;
}

.sidebar-content {
  padding: $spacing-lg 0;
  flex-shrink: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
  
  &.active {
    background: rgba(255,255,255,0.2);
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: $secondary-color;
    }
  }
}

.icon {
  font-size: $font-size-large;
  margin-right: $spacing-sm;
  width: 24px;
  text-align: center;
}

.text {
  font-size: $font-size-base;
  font-weight: 500;
}

.sidebar-footer {
  flex: 1;
  padding: 0 $spacing-md $spacing-lg;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  
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

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    
    .sidebar-content {
      display: flex;
      padding: $spacing-sm 0;
      overflow-x: auto;
    }
    
    .sidebar-item {
      flex-shrink: 0;
      flex-direction: column;
      padding: $spacing-sm;
      min-width: 80px;
      
      .icon {
        margin-right: 0;
        margin-bottom: $spacing-xs;
      }
      
      .text {
        font-size: $font-size-small;
      }
    }
    
    .sidebar-footer {
      padding: $spacing-sm;
      flex: none;
    }
  }
}
</style> 
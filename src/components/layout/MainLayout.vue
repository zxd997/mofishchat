<template>
  <div class="main-layout">
    <Sidebar @view-change="handleViewChange" />
    
    <div class="main-content">
      <TopBar />
      
      <div class="content-area">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'

// 注入方法
const switchView = inject('switchView')

// 方法
const handleViewChange = (view) => {
  switchView(view)
}
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow: hidden;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
}
</style> 
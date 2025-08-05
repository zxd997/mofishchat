<template>
  <div class="home-container">
    <MainLayout>
      <template #content>
        <ChatArea v-if="currentView === 'chat'" />
        <CheckinPanel v-else-if="currentView === 'checkin'" />
        <WheelGame v-else-if="currentView === 'wheel'" />
        <TopicPanel v-else-if="currentView === 'topic'" />
        <RobotPanel v-else-if="currentView === 'robot'" />
        <WelcomePanel v-else />
      </template>
    </MainLayout>
    
    <!-- 昵称设置弹窗 -->
    <NicknameModal 
      v-if="showNicknameModal"
      @close="showNicknameModal = false"
      @save="handleNicknameSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { useGameStore } from '@/stores/game'

import MainLayout from '@/components/layout/MainLayout.vue'
import ChatArea from '@/components/chat/ChatArea.vue'
import CheckinPanel from '@/components/game/CheckinPanel.vue'
import WheelGame from '@/components/game/WheelGame.vue'
import TopicPanel from '@/components/topic/TopicPanel.vue'
import RobotPanel from '@/components/robot/RobotPanel.vue'
import WelcomePanel from '@/components/common/WelcomePanel.vue'
import NicknameModal from '@/components/modal/NicknameModal.vue'

// 状态管理
const userStore = useUserStore()
const chatStore = useChatStore()
const gameStore = useGameStore()

// 响应式数据
const currentView = ref('chat')
const showNicknameModal = ref(false)

// 提供给子组件的方法
provide('switchView', (view) => {
  currentView.value = view
})

provide('showNicknameModal', () => {
  showNicknameModal.value = true
})

// 方法
const handleNicknameSave = (nickname) => {
  userStore.setNickname(nickname)
  userStore.login(nickname)
  showNicknameModal.value = false
}

// 生命周期
onMounted(() => {
  // 初始化数据
  chatStore.initializeMessages()
  
  // 如果没有昵称，显示昵称设置弹窗
  if (!userStore.nickname) {
    showNicknameModal.value = true
  }
})
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style> 
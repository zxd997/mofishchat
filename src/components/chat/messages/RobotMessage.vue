<template>
  <div class="robot-message">
    <div class="robot-content" v-html="formattedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义属性
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// 计算属性
const formattedContent = computed(() => {
  let content = props.content
  
  // 转换换行符
  content = content.replace(/\n/g, '<br>')
  
  // 高亮星级评分
  content = content.replace(/⭐/g, '<span class="star">⭐</span>')
  
  // 高亮成功率
  content = content.replace(/(成功率：[^<\n]+)/g, '<span class="success-rate">$1</span>')
  
  return content
})
</script>

<style lang="scss" scoped>
.robot-message {
  line-height: 1.5;
}

.robot-content {
  :deep(.star) {
    color: #ffd700;
  }
  
  :deep(.success-rate) {
    font-weight: bold;
    color: #fff59d;
  }
}
</style> 
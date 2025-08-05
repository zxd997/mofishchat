<template>
  <div class="text-message">
    <div v-html="formattedContent"></div>
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
  
  // 转换emoji（可以扩展更多表情）
  const emojiMap = {
    ':)': '😊',
    ':D': '😃',
    ':(': '😢',
    ':P': '😛',
    ';)': '😉'
  }
  
  Object.keys(emojiMap).forEach(key => {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emojiMap[key])
  })
  
  return content
})
</script>

<style lang="scss" scoped>
.text-message {
  word-wrap: break-word;
  line-height: 1.5;
}
</style> 
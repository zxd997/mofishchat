<template>
  <div class="system-message">
    <span class="system-icon">ℹ️</span>
    <span class="system-text">{{ content }}</span>
  </div>
</template>

<script setup>
// 定义属性
defineProps({
  content: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.system-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  font-style: italic;
}

.system-icon {
  opacity: 0.8;
}

.system-text {
  opacity: 0.9;
}
</style> 
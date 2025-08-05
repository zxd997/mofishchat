import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const nickname = ref(localStorage.getItem('mofish_nickname') || '')
  const isLoggedIn = ref(!!localStorage.getItem('mofish_nickname'))
  const fishingTime = ref(parseInt(localStorage.getItem('mofish_fishingTime') || '0'))
  const fishingCoins = ref(parseInt(localStorage.getItem('mofish_fishingCoins') || '100'))
  const dailyCheckIn = ref(JSON.parse(localStorage.getItem('mofish_dailyCheckIn') || 'false'))
  
  // 计算属性
  const formattedFishingTime = computed(() => {
    const hours = Math.floor(fishingTime.value / 3600)
    const minutes = Math.floor((fishingTime.value % 3600) / 60)
    const seconds = fishingTime.value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  // 方法
  function setNickname(name) {
    nickname.value = name
    localStorage.setItem('mofish_nickname', name)
    console.log('✅ 昵称已保存:', name)
  }
  
  function login(name) {
    setNickname(name)
    isLoggedIn.value = true
    localStorage.setItem('mofish_isLoggedIn', 'true')
  }
  
  function logout() {
    nickname.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('mofish_nickname')
    localStorage.removeItem('mofish_isLoggedIn')
  }
  
  function addFishingTime(seconds) {
    fishingTime.value += seconds
    localStorage.setItem('mofish_fishingTime', fishingTime.value.toString())
  }
  
  function addFishingCoins(amount) {
    fishingCoins.value += amount
    localStorage.setItem('mofish_fishingCoins', fishingCoins.value.toString())
  }
  
  function setDailyCheckIn(status) {
    dailyCheckIn.value = status
    localStorage.setItem('mofish_dailyCheckIn', JSON.stringify(status))
  }
  
  function generateRandomNickname() {
    const prefixes = ['摸鱼', '划水', '偷懒', '躺平', '佛系', '咸鱼']
    const suffixes = ['大师', '专家', '高手', '达人', '王者', '传说', '新手', '学徒']
    const numbers = Math.floor(Math.random() * 999) + 1
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    
    return `${prefix}${suffix}${numbers}`
  }
  
  return {
    // 状态
    nickname,
    isLoggedIn,
    fishingTime,
    fishingCoins,
    dailyCheckIn,
    // 计算属性
    formattedFishingTime,
    // 方法
    setNickname,
    login,
    logout,
    addFishingTime,
    addFishingCoins,
    setDailyCheckIn,
    generateRandomNickname
  }
}) 
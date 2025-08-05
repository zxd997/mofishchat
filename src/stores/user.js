import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const nickname = ref('')
  const isLoggedIn = ref(false)
  const fishingTime = ref(0) // 摸鱼时长（秒）
  const fishingCoins = ref(0) // 摸鱼币
  const dailyCheckIn = ref(false) // 今日是否已打卡
  
  // 计算属性
  const formattedFishingTime = computed(() => {
    const hours = Math.floor(fishingTime.value / 3600)
    const minutes = Math.floor((fishingTime.value % 3600) / 60)
    const seconds = fishingTime.value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  // 方法
  function setNickname(newNickname) {
    nickname.value = newNickname
  }
  
  function login(userNickname) {
    nickname.value = userNickname
    isLoggedIn.value = true
  }
  
  function logout() {
    nickname.value = ''
    isLoggedIn.value = false
    fishingTime.value = 0
    fishingCoins.value = 0
    dailyCheckIn.value = false
  }
  
  function addFishingTime(seconds) {
    fishingTime.value += seconds
  }
  
  function addFishingCoins(coins) {
    fishingCoins.value += coins
  }
  
  function setDailyCheckIn(status) {
    dailyCheckIn.value = status
  }
  
  function generateRandomNickname() {
    const prefixes = ['摸鱼侠', '划水专家', '工位躺尸王', '假装忙碌', '神秘打工人', '咸鱼王', '摸鱼大师']
    const suffixes = ['007', '999', '666', '233', '520', '888', '123']
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `${randomPrefix}${randomSuffix}`
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
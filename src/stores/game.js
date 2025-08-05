import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

export const useGameStore = defineStore('game', () => {
  // 状态
  const isCheckedIn = ref(false)
  const checkInStartTime = ref(null)
  const todayFishingTime = ref(9138) // 今日摸鱼时长（秒）
  const rankingList = ref([
    { nickname: '超级摸鱼王', time: 20553, rank: 1 },
    { nickname: '划水专家', time: 15322, rank: 2 },
    { nickname: '慢动作高手', time: 14297, rank: 3 },
    { nickname: '摸鱼侠007', time: 9138, rank: 4 }
  ])
  const wheelSpinning = ref(false)
  const dailySpinUsed = ref(false)
  const recentWinners = ref([
    { nickname: '摸鱼侠007', prize: '今日摸鱼王称号', icon: '🏆' },
    { nickname: '划水专家', prize: '+10摸鱼币', icon: '💰' },
    { nickname: '工位躺尸王', prize: '免费咖啡券', icon: '☕' }
  ])
  const fishingHistory = ref([
    { date: '昨天', time: 12165 },
    { date: '前天', time: 8313 },
    { date: '3天前', time: 14712 }
  ])
  
  // 转盘奖品配置
  const wheelPrizes = ref([
    { name: '摸鱼王称号', icon: '🏆', color: '#ffd700' },
    { name: '+10摸鱼币', icon: '💰', color: '#4caf50' },
    { name: '讲个冷笑话', icon: '😄', color: '#ff9800' },
    { name: '帮你请半天假', icon: '🏖️', color: '#2196f3' },
    { name: '免费咖啡券', icon: '☕', color: '#795548' },
    { name: '神秘奖励', icon: '🎪', color: '#9c27b0' },
    { name: '幸运加成', icon: '🍀', color: '#4caf50' },
    { name: '摸鱼时间+1小时', icon: '💤', color: '#607d8b' }
  ])
  
  // 计算属性
  const formattedTodayTime = computed(() => {
    const hours = Math.floor(todayFishingTime.value / 3600)
    const minutes = Math.floor((todayFishingTime.value % 3600) / 60)
    const seconds = todayFishingTime.value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })
  
  const currentUserRank = computed(() => {
    const userStore = useUserStore()
    const userRank = rankingList.value.find(item => 
      item.nickname === userStore.nickname || item.nickname === '摸鱼侠007'
    )
    return userRank || null
  })
  
  // 方法
  function startCheckIn() {
    isCheckedIn.value = true
    checkInStartTime.value = Date.now()
    
    // 开始计时
    const timer = setInterval(() => {
      if (isCheckedIn.value) {
        todayFishingTime.value += 1
        
        // 更新排行榜中的用户时间
        const userStore = useUserStore()
        const userRankIndex = rankingList.value.findIndex(item => 
          item.nickname === userStore.nickname || item.nickname === '摸鱼侠007'
        )
        if (userRankIndex !== -1) {
          rankingList.value[userRankIndex].time = todayFishingTime.value
          // 重新排序
          rankingList.value.sort((a, b) => b.time - a.time)
          // 更新排名
          rankingList.value.forEach((item, index) => {
            item.rank = index + 1
          })
        }
      } else {
        clearInterval(timer)
      }
    }, 1000)
  }
  
  function stopCheckIn() {
    isCheckedIn.value = false
    checkInStartTime.value = null
  }
  
  function spinWheel() {
    if (dailySpinUsed.value || wheelSpinning.value) return null
    
    wheelSpinning.value = true
    dailySpinUsed.value = true
    
    // 模拟转盘旋转
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * wheelPrizes.value.length)
        const prize = wheelPrizes.value[randomIndex]
        
        // 添加到中奖记录
        const userStore = useUserStore()
        recentWinners.value.unshift({
          nickname: userStore.nickname || '摸鱼侠007',
          prize: prize.name,
          icon: prize.icon
        })
        if (recentWinners.value.length > 5) {
          recentWinners.value.pop()
        }
        
        // 应用奖励效果
        applyPrizeEffect(prize)
        
        wheelSpinning.value = false
        resolve(prize)
      }, 3000) // 3秒转盘动画
    })
  }
  
  function applyPrizeEffect(prize) {
    const userStore = useUserStore()
    
    switch (prize.name) {
      case '+10摸鱼币':
        userStore.addFishingCoins(10)
        break
      case '摸鱼时间+1小时':
        todayFishingTime.value += 3600
        break
      case '摸鱼王称号':
        // 可以在用户状态中添加称号系统
        break
      default:
        // 其他奖励的处理逻辑
        break
    }
  }
  
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  function resetDaily() {
    // 重置每日数据
    dailySpinUsed.value = false
    isCheckedIn.value = false
    checkInStartTime.value = null
    
    // 将今日摸鱼时间添加到历史记录
    fishingHistory.value.unshift({
      date: '昨天',
      time: todayFishingTime.value
    })
    if (fishingHistory.value.length > 7) {
      fishingHistory.value.pop()
    }
    
    todayFishingTime.value = 0
  }
  
  return {
    // 状态
    isCheckedIn,
    checkInStartTime,
    todayFishingTime,
    rankingList,
    wheelSpinning,
    dailySpinUsed,
    recentWinners,
    fishingHistory,
    wheelPrizes,
    // 计算属性
    formattedTodayTime,
    currentUserRank,
    // 方法
    startCheckIn,
    stopCheckIn,
    spinWheel,
    applyPrizeEffect,
    formatTime,
    resetDaily
  }
}) 
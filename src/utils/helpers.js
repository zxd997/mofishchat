// 工具函数库

/**
 * 格式化时间（秒转HH:MM:SS格式）
 * @param {number} seconds 秒数
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 生成随机昵称
 * @returns {string} 随机昵称
 */
export const generateRandomNickname = () => {
  const prefixes = ['摸鱼侠', '划水专家', '工位躺尸王', '假装忙碌', '神秘打工人', '咸鱼王', '摸鱼大师', '偷懒能手']
  const suffixes = ['007', '999', '666', '233', '520', '888', '123', '456', '789', '999']
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return `${randomPrefix}${randomSuffix}`
}

/**
 * 获取随机头像emoji
 * @param {string} text 基于文本生成
 * @returns {string} emoji头像
 */
export const getRandomAvatar = (text) => {
  const avatars = ['🐟', '🦈', '🐠', '🐡', '🦑', '🐙', '🐚', '⭐', '🌊', '🏄‍♂️', '🚀', '🎯']
  const index = text.length % avatars.length
  return avatars[index]
}

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间限制
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 检查是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 本地存储操作
 */
export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('localStorage set error:', error)
    }
  },
  
  get(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('localStorage get error:', error)
      return null
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage remove error:', error)
    }
  },
  
  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  }
}

/**
 * 获取当前时间戳
 * @returns {number} 时间戳
 */
export const getCurrentTimestamp = () => Date.now()

/**
 * 检查是否为今天
 * @param {number} timestamp 时间戳
 * @returns {boolean} 是否为今天
 */
export const isToday = (timestamp) => {
  const today = new Date()
  const date = new Date(timestamp)
  return today.toDateString() === date.toDateString()
}

/**
 * 生成随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机数
 */
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数字动画
 * @param {number} start 开始值
 * @param {number} end 结束值
 * @param {number} duration 持续时间
 * @param {Function} callback 回调函数
 */
export const animateNumber = (start, end, duration, callback) => {
  const startTime = Date.now()
  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const current = Math.floor(start + (end - start) * progress)
    callback(current)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  animate()
} 
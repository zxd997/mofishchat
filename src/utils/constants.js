// 应用常量配置

// 主题配置
export const THEME = {
  PRIMARY_COLOR: '#42a5f5',
  SECONDARY_COLOR: '#ffa726',
  ACCENT_COLOR: '#ff6b6b',
  SUCCESS_COLOR: '#4caf50',
  WARNING_COLOR: '#ff9800',
  INFO_COLOR: '#2196f3'
}

// 应用配置
export const APP_CONFIG = {
  NAME: '摸鱼星球',
  VERSION: '1.0.0',
  DESCRIPTION: '您的专属摸鱼聊天室'
}

// 聊天配置
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_MESSAGES_DISPLAY: 50,
  MESSAGE_TYPES: {
    TEXT: 'text',
    SYSTEM: 'system',
    ROBOT: 'robot'
  }
}

// 游戏配置
export const GAME_CONFIG = {
  DAILY_SPIN_LIMIT: 1,
  MAX_NICKNAME_LENGTH: 20,
  RANKING_DISPLAY_COUNT: 10,
  HISTORY_DAYS: 7
}

// 机器人命令
export const ROBOT_COMMANDS = {
  JOKE: '/joke',
  EXCUSE: '/excuse',
  RANT: '/rant',
  TIP: '/tip'
}

// 本地存储键名
export const STORAGE_KEYS = {
  USER_NICKNAME: 'mofish_user_nickname',
  FISHING_TIME: 'mofish_fishing_time',
  DAILY_SPIN: 'mofish_daily_spin',
  LAST_LOGIN: 'mofish_last_login'
} 
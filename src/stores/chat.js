import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref([])
  const currentTopic = ref('今天你装忙了吗？')
  const topicHistory = ref([
    '你见过最奇葩的加班理由是什么？',
    '如果可以给老板一个建议，你会说什么？',
    '上班时间你做过最勇敢的事是什么？',
    '形容一下你的工作状态用一个emoji'
  ])
  const robotMessages = ref([])
  
  // 计算属性
  const latestMessages = computed(() => {
    return messages.value.slice(-50) // 只显示最新50条消息
  })
  
  // 方法
  function addMessage(content, author = '', isOwn = false, type = 'text') {
    const message = {
      id: Date.now() + Math.random(),
      content,
      author: author || (isOwn ? '我' : '匿名用户'),
      timestamp: dayjs().format('HH:mm'),
      isOwn,
      type // 'text', 'system', 'robot'
    }
    messages.value.push(message)
  }
  
  function addRobotMessage(content, isUser = false) {
    const message = {
      id: Date.now() + Math.random(),
      content,
      isUser,
      timestamp: dayjs().format('HH:mm')
    }
    robotMessages.value.push(message)
  }
  
  function changeTopic() {
    const topics = [
      '今天你装忙了吗？',
      '分享一个摸鱼小技巧',
      '老板不在的时候你在干什么？',
      '最喜欢的摸鱼网站是什么？',
      '如果摸鱼是一门艺术，你是什么级别？',
      '说说你的摸鱼日常',
      '摸鱼被发现的尴尬时刻',
      '理想的工作状态是什么样的？'
    ]
    let newTopic
    do {
      newTopic = topics[Math.floor(Math.random() * topics.length)]
    } while (newTopic === currentTopic.value)
    
    // 将当前话题加入历史
    if (!topicHistory.value.includes(currentTopic.value)) {
      topicHistory.value.unshift(currentTopic.value)
      if (topicHistory.value.length > 10) {
        topicHistory.value.pop()
      }
    }
    
    currentTopic.value = newTopic
    
    // 添加系统消息
    addMessage(`话题已更新：${newTopic}`, '系统', false, 'system')
  }
  
  function initializeMessages() {
    // 初始化一些示例消息
    messages.value = [
      {
        id: 1,
        content: '哈哈哈，老板刚刚走过来，我火速切换到工作界面 😂',
        author: '摸鱼侠007',
        timestamp: '09:23',
        isOwn: false,
        type: 'text'
      },
      {
        id: 2,
        content: '我在开会，但是其实在看小说 📖',
        author: '工位躺尸王',
        timestamp: '09:25',
        isOwn: false,
        type: 'text'
      },
      {
        id: 3,
        content: '同道中人！我正在假装写代码呢 💻',
        author: '我',
        timestamp: '09:27',
        isOwn: true,
        type: 'text'
      },
      {
        id: 4,
        content: '/joke',
        author: '划水专家',
        timestamp: '09:30',
        isOwn: false,
        type: 'text'
      },
      {
        id: 5,
        content: '为什么程序员总是分不清圣诞节和万圣节？\n因为 Oct 31 == Dec 25 😄',
        author: '🤖 摸鱼机器人',
        timestamp: '09:30',
        isOwn: false,
        type: 'robot'
      }
    ]
    
    // 初始化机器人消息
    robotMessages.value = [
      {
        id: 1,
        content: '嘿！我是你的摸鱼伙伴 🤖 需要什么帮助吗？',
        isUser: false,
        timestamp: '09:00'
      }
    ]
  }
  
  function executeRobotCommand(command) {
    // 添加用户消息
    addRobotMessage(command, true)
    
    let response = ''
    switch (command) {
      case '/joke':
        const jokes = [
          '为什么程序员总是分不清圣诞节和万圣节？\n因为 Oct 31 == Dec 25 😄',
          '为什么程序员喜欢黑暗？\n因为光明会产生bug！💡➡️🐛',
          '程序员的三大美德：懒惰、急躁、傲慢\n所以我们才需要摸鱼 😎',
          '为什么程序员总是戴耳机？\n因为这样别人就不会打扰我们摸鱼了 🎧'
        ]
        response = jokes[Math.floor(Math.random() * jokes.length)]
        // 同时在主聊天区添加机器人回复
        addMessage(response, '🤖 摸鱼机器人', false, 'robot')
        break
        
      case '/excuse':
        const excuses = [
          '🏥 建议：家里水管爆了，需要在家等维修师傅\n成功率：⭐⭐⭐⭐☆\n使用过的同事：还没有人用过哦～',
          '🚗 建议：车子突然坏了，需要等拖车\n成功率：⭐⭐⭐☆☆\n使用过的同事：2人',
          '👵 建议：奶奶生病了，需要陪她去医院\n成功率：⭐⭐⭐⭐⭐\n使用过的同事：1人',
          '📱 建议：手机丢了，需要去补办卡\n成功率：⭐⭐⭐☆☆\n使用过的同事：3人'
        ]
        response = excuses[Math.floor(Math.random() * excuses.length)]
        addMessage(response, '🤖 摸鱼机器人', false, 'robot')
        break
        
      case '/rant':
        const rants = [
          '老板又在画饼了，说什么"我们是一家人"，家人会让你996吗？😤',
          '为什么开会总是没有结论？大家聚在一起就是为了浪费时间吗？🙄',
          '说好的工作量，怎么越做越多？这就是传说中的工作膨胀吗？📈',
          '同事总是甩锅，出了问题就找别人背责任，太难了 😮‍💨'
        ]
        response = rants[Math.floor(Math.random() * rants.length)]
        addMessage(response, '🤖 摸鱼机器人', false, 'robot')
        break
        
      default:
        response = '我不太理解你的意思呢，试试这些命令：\n/joke - 讲个冷笑话\n/excuse - 生成请假理由\n/rant - 吐槽老板'
        addMessage(response, '🤖 摸鱼机器人', false, 'robot')
    }
    
    // 延迟回复，模拟机器人思考
    setTimeout(() => {
      addRobotMessage(response, false)
    }, 1000)
  }
  
  return {
    // 状态
    messages,
    currentTopic,
    topicHistory,
    robotMessages,
    // 计算属性
    latestMessages,
    // 方法
    addMessage,
    addRobotMessage,
    changeTopic,
    initializeMessages,
    executeRobotCommand
  }
}) 
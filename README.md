# 🐟 摸鱼星球聊天室

一个基于Vue3的有趣匿名聊天室项目，专为上班族打造的摸鱼社交平台。

## ✨ 功能特性

### 🎭 匿名聊天系统
- 每日更换匿名昵称，保护用户隐私
- 实时聊天功能，支持表情和命令
- 话题讨论系统，每日推荐有趣话题

### 🕘 摸鱼打卡功能
- 记录每日摸鱼时长
- 摸鱼排行榜，比拼谁更会摸鱼
- 历史记录查看，统计摸鱼数据

### 🎲 幸运大转盘
- 每日抽奖机会，获取神秘奖励
- 摸鱼币系统，积累虚拟财富
- 多种奖品类型，增加趣味性

### 🤖 AI摸鱼助手
- 智能聊天机器人，缓解工作压力
- 冷笑话生成器，随时来点乐子
- 请假理由助手，创意满满的借口
- 工作吐槽陪聊，释放负面情绪

## 🛠️ 技术栈

### 前端
- **前端框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **构建工具**: Vite
- **样式**: SCSS + CSS变量
- **工具库**: @vueuse/core, dayjs
- **实时通信**: WebSocket API

### 后端
- **后端框架**: Spring Boot 2.7.18
- **数据库**: MySQL 8.0 + MyBatis Plus 3.5.7
- **实时通信**: Spring WebSocket
- **API设计**: RESTful API

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── chat/           # 聊天相关组件
│   │   ├── ChatArea.vue
│   │   ├── MessageItem.vue
│   │   ├── InputArea.vue
│   │   └── messages/   # 消息类型组件
│   ├── game/           # 游戏相关组件
│   │   ├── CheckinPanel.vue
│   │   ├── WheelGame.vue
│   │   └── WinModal.vue
│   ├── layout/         # 布局组件
│   │   ├── MainLayout.vue
│   │   ├── Sidebar.vue
│   │   └── TopBar.vue
│   ├── modal/          # 弹窗组件
│   │   └── NicknameModal.vue
│   ├── robot/          # 机器人组件
│   │   └── RobotPanel.vue
│   ├── topic/          # 话题组件
│   │   └── TopicPanel.vue
│   └── common/         # 通用组件
│       └── WelcomePanel.vue
├── config/             # 配置文件
│   └── websocket.js    # WebSocket连接配置
├── services/           # API服务
│   ├── websocket.js    # WebSocket客户端
│   └── chatApi.js      # 聊天API服务
├── stores/             # 状态管理
│   ├── user.js         # 用户状态
│   ├── chat.js         # 聊天状态（含持久化）
│   └── game.js         # 游戏状态
├── styles/             # 样式文件
│   ├── main.scss       # 全局样式
│   └── variables.scss  # SCSS变量
├── views/              # 页面视图
│   ├── Home.vue        # 主页
│   └── Chat.vue        # 聊天页
├── router/             # 路由配置
│   └── index.js
├── App.vue             # 根组件
└── main.js             # 入口文件
```

## 🚀 快速开始

### 环境要求
- **前端**: Node.js >= 16.0.0, npm >= 7.0.0
- **后端**: Java 17, Maven 3.6+, MySQL 8.0+

### 1. 后端启动
```bash
# 进入后端目录
cd mofishchat-backend

# 配置数据库
# 编辑 src/main/resources/application.properties
# 修改数据库连接信息

# 启动后端服务
mvn spring-boot:run
```

### 2. 前端启动
```bash
# 进入前端目录
cd mofishchat

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 验证服务
- 后端健康检查: http://localhost:8081/api/chat/health
- 前端页面: http://localhost:3000

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🎨 设计理念

### 视觉设计
- **主题色彩**: 蓝色(#42a5f5) + 橙色(#ffa726)
- **设计风格**: 圆润、轻松、有趣
- **交互动效**: 悬浮、缩放、渐变过渡
- **响应式**: 支持桌面端和移动端

### 用户体验
- **匿名保护**: 每日昵称更换，保护隐私
- **即时反馈**: 实时消息、动画效果
- **游戏化**: 打卡、抽奖、排行榜
- **智能交互**: AI助手陪伴聊天

## 🔧 核心功能实现

### 状态管理
使用Pinia进行全局状态管理，分为三个主要store：
- `userStore`: 用户信息、昵称、摸鱼币等
- `chatStore`: 聊天消息、话题管理、机器人对话
- `gameStore`: 打卡记录、排行榜、转盘游戏

### 组件化架构
- 高度模块化的组件设计
- 明确的组件职责分离
- 可复用的业务组件
- 灵活的布局组件

### 响应式设计
- 移动端优先的设计策略
- 弹性布局和网格系统
- 适配不同屏幕尺寸
- 触摸友好的交互设计

## 🎮 功能演示

### 聊天功能
- 实时多用户聊天，WebSocket通信
- 消息持久化存储，刷新不丢失
- 支持文本消息、表情符号
- 命令系统：`/joke`, `/excuse`, `/rant`
- 实时消息滚动和时间戳
- 在线用户列表显示
- 用户加入/离开通知

### 打卡系统
- 一键开始/暂停摸鱼计时
- 实时排行榜更新
- 历史记录统计
- 可视化时间显示

### 转盘游戏
- 炫酷的转盘动画效果
- 多种奖励类型
- 每日限制一次抽奖
- 中奖记录展示

### AI助手
- 智能对话系统
- 命令响应机制
- 输入状态指示
- 多种功能集成

## 🌟 特色亮点

1. **创意主题**: 以"摸鱼"为主题，贴近上班族日常
2. **匿名安全**: 保护用户隐私，营造安全聊天环境
3. **游戏化元素**: 打卡、抽奖等功能增加趣味性
4. **AI交互**: 智能机器人提供陪伴和娱乐
5. **现代化技术**: Vue3 + Vite + Pinia 现代化技术栈

## 🔮 未来规划

- [x] WebSocket实时通信 ✅
- [x] 消息持久化存储 ✅
- [ ] 用户注册登录系统
- [ ] 私聊功能
- [ ] 消息加密
- [ ] 文件分享功能
- [ ] 更多游戏和互动功能
- [ ] 移动端App开发
- [ ] 社区功能扩展
- [ ] 多语言国际化支持

## 📄 开源协议

MIT License

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 👨‍💻 作者

这个项目是一个展示Vue3现代化开发的示例项目，展现了组件化架构、状态管理、响应式设计等最佳实践。

---

**注意**: 这是一个演示项目，仅用于技术展示和学习目的。在实际使用中，请注意数据安全和用户隐私保护。 
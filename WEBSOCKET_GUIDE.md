# 🔗 WebSocket实时聊天使用指南

## 🎉 功能介绍

摸鱼星球聊天室支持真正的实时多用户聊天功能！使用WebSocket技术连接到Spring Boot后端，多个用户可以实时看到彼此的消息，所有消息都会持久化存储到数据库。

## 🚀 启动系统

### 1. 启动后端服务
```bash
cd mofishchat-backend
mvn spring-boot:run
```
后端服务将启动在 **8081端口**，提供：
- WebSocket服务 (`ws://localhost:8081/ws/chat`)
- REST API (`http://localhost:8081/api`)

### 2. 启动前端开发服务器
```bash
cd mofishchat
npm run dev
```
前端服务将启动在 **3000端口**

### 3. 验证服务
- 后端健康检查：http://localhost:8081/api/chat/health
- 前端页面：http://localhost:3000

## 🌟 新功能特性

### 📡 实时通信 + 数据持久化
- **多用户聊天**：所有用户可以实时看到彼此的消息
- **消息持久化**：所有聊天记录保存到MySQL数据库
- **历史消息**：页面刷新后自动加载历史聊天记录
- **用户加入/离开通知**：实时显示用户进入和退出聊天室
- **连接状态指示**：顶部和聊天区域显示连接状态
- **自动重连**：网络断开时自动尝试重连

### 👥 用户管理
- **在线用户列表**：侧边栏显示当前在线用户
- **用户计数**：实时显示在线人数
- **加入时间**：显示每个用户的加入时间
- **用户标识**：清楚区分自己和其他用户

### 🤖 智能机器人
- **实时机器人回复**：所有用户都能看到机器人的回复
- **命令处理**：支持 `/joke`、`/excuse`、`/rant` 命令
- **延迟回复**：模拟真实的机器人思考时间

### 💬 话题系统
- **实时话题更换**：任何用户更换话题，所有人都能看到
- **话题同步**：新用户加入时自动同步当前话题
- **系统消息**：话题更换会发送系统通知

## 🎮 使用演示

### 1. 启动系统
按照上面的步骤先启动后端，再启动前端

### 2. 打开浏览器
访问 http://localhost:3000

### 3. 设置昵称
- 首次访问会弹出昵称设置界面
- 可以手动输入或随机生成昵称
- 设置完成后自动连接到后端WebSocket服务器

### 4. 多用户测试
- 在不同浏览器窗口/设备打开相同地址
- 使用不同昵称加入聊天室
- 体验实时聊天效果
- 刷新页面验证消息持久化

## 📱 界面说明

### 连接状态指示器
- 🟢 **已连接**：显示在线人数
- 🟡 **连接中**：正在连接服务器  
- 🔴 **未连接**：离线模式，可点击重连

### 在线用户列表
- 位于左侧边栏底部
- 显示所有在线用户的昵称和头像
- 自己的名称会特别标识
- 显示用户加入时间

### 聊天功能
- 实时消息同步
- 消息持久化存储
- 支持文本和表情符号
- 机器人命令：`/joke`、`/excuse`、`/rant`
- 连接断开时输入框会被禁用

## 🔧 技术架构

### 🎯 新架构优势
**之前**：前端 ←→ Node.js WebSocket ←→ Spring Boot API  
**现在**：前端 ←→ Spring Boot (WebSocket + API + 数据库)

### 后端（Spring Boot）
- **技术栈**：Spring Boot + WebSocket + MyBatis Plus + MySQL
- **端口**：8081
- **功能**：
  - WebSocket连接管理 (`/ws/chat`)
  - REST API (`/api/chat/*`)
  - 消息持久化存储
  - 用户会话管理
  - 机器人命令处理
  - 历史消息查询

### 前端（Vue3客户端）
- **技术栈**：Vue3 + WebSocket API + Pinia
- **功能**：
  - WebSocket连接管理
  - 实时消息显示
  - 连接状态监控
  - 自动重连机制
  - 历史消息加载

### 数据库存储
- **消息表**：`chat_content`
- **字段**：id, user_id, type, content, creator, create_time
- **消息类型**：0(用户消息), 1(系统消息), 2(机器人消息)

### 消息类型
- `user_join`：用户加入
- `user_leave`：用户离开
- `chat_message`：聊天消息
- `robot_command`：机器人命令
- `topic_change`：话题更换
- `user_list`：用户列表更新
- `message_history`：历史消息

## ⚙️ 配置管理

### WebSocket连接配置
文件：`src/config/websocket.js`
```javascript
export const WS_CONFIG = {
  // WebSocket聊天室连接URL
  CHAT_URL: 'ws://localhost:8081/ws/chat',
  
  // API基础URL  
  API_BASE_URL: 'http://localhost:8081/api',
  
  // 连接配置
  CONNECTION: {
    MAX_RECONNECT_ATTEMPTS: 5,    // 最大重连次数
    RECONNECT_DELAY: 1000,        // 重连延迟(毫秒)
    CONNECTION_TIMEOUT: 5000      // 连接超时时间(毫秒)
  }
}
```

## 🛠️ 开发说明

### 前端文件结构
```
src/
├── config/
│   └── websocket.js         # WebSocket连接配置
├── services/
│   ├── websocket.js         # WebSocket客户端服务
│   └── chatApi.js           # REST API服务
├── stores/
│   └── chat.js              # 聊天状态管理（含持久化）
└── components/
    ├── chat/                # 聊天组件
    ├── common/              # 通用组件
    └── layout/              # 布局组件
```

### 后端API接口
- `GET /api/chat/health` - 健康检查
- `POST /api/chat/save` - 保存消息
- `GET /api/chat/latest?limit=50` - 获取最新消息
- `GET /api/chat/all` - 获取所有消息
- `WS /ws/chat` - WebSocket连接

## 🐛 故障排除

### 连接失败
1. 检查后端服务是否启动（端口8081）
2. 访问 http://localhost:8081/api/chat/health 验证API
3. 确认防火墙没有阻止连接
4. 查看浏览器控制台错误信息

### 消息不同步
1. 刷新页面重新连接
2. 检查网络连接稳定性
3. 查看后端服务日志

### 数据库问题
1. 确认MySQL服务启动
2. 检查数据库连接配置
3. 验证数据表是否创建成功

### 启动失败
1. **后端**：确认Java 17、Maven、MySQL
2. **前端**：确认Node.js >= 16
3. **依赖**：重新安装 `npm install`
4. **端口**：检查8081/3000端口是否被占用

## 🎊 体验建议

1. **多窗口测试**：同时打开多个浏览器窗口，体验实时效果
2. **消息持久化**：发送消息后刷新页面，验证历史记录
3. **命令互动**：尝试发送机器人命令，观察所有用户都能看到回复
4. **话题讨论**：使用话题更换功能，体验实时同步
5. **连接测试**：断开网络再连接，测试自动重连功能

现在你的聊天室不仅支持实时通信，还能永久保存聊天记录！🐟✨
# 🔧 WebSocket连接故障排除指南

## 🔍 问题诊断

如果您看到"未连接"状态，请按以下步骤排查：

### 1. ✅ 检查服务状态

#### 检查服务器是否运行
```bash
# 检查WebSocket服务器（端口8080）
lsof -i :8080

# 检查前端服务器（端口3000）
curl -s http://localhost:3000 > /dev/null && echo "前端服务正常" || echo "前端服务异常"

# 检查进程状态
ps aux | grep -E "(node.*server|vite)" | grep -v grep
```

#### 预期结果
- WebSocket服务器应该在端口8080监听
- 前端服务器应该在端口3000响应
- 应该看到node服务器进程运行

### 2. 🚀 重启服务

#### 方法一：完全重启
```bash
# 停止所有相关进程
pkill -f "node.*server"
pkill -f "vite"
pkill -f "concurrently"

# 重新启动
npm run dev:full
```

#### 方法二：分别启动
```bash
# 终端1：启动WebSocket服务器
npm run server

# 终端2：启动前端开发服务器
npm run dev
```

### 3. 🔗 测试WebSocket连接

#### 使用测试页面
打开项目根目录的 `debug.html` 文件：
```bash
open debug.html
# 或
python3 -m http.server 8000  # 然后访问 http://localhost:8000/debug.html
```

#### 浏览器控制台测试
在浏览器控制台执行：
```javascript
// 测试WebSocket连接
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => console.log('✅ 连接成功');
ws.onerror = (error) => console.error('❌ 连接失败:', error);
ws.onclose = (event) => console.log('🔌 连接关闭:', event.code, event.reason);
```

### 4. 🐛 常见问题及解决方案

#### 问题1：端口被占用
**现象**：启动时报错端口已被占用
**解决**：
```bash
# 查找占用端口的进程
lsof -i :8080
lsof -i :3000

# 终止占用进程
kill -9 <PID>
```

#### 问题2：防火墙阻止连接
**现象**：浏览器无法连接到WebSocket
**解决**：
- macOS: 系统偏好设置 > 安全性与隐私 > 防火墙 > 允许Node.js
- Windows: Windows Defender防火墙 > 允许应用通过防火墙
- Linux: `sudo ufw allow 8080`

#### 问题3：浏览器缓存问题
**现象**：页面显示旧版本或连接异常
**解决**：
- 硬刷新：Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)
- 清除缓存：浏览器设置 > 清除浏览数据
- 无痕模式：Ctrl+Shift+N (Chrome) 或 Cmd+Shift+N (Safari)

#### 问题4：Node.js版本不兼容
**现象**：启动时出现语法错误
**解决**：
```bash
# 检查Node.js版本
node --version

# 需要Node.js >= 16
# 升级Node.js或使用nvm管理版本
```

#### 问题5：依赖安装问题
**现象**：模块未找到错误
**解决**：
```bash
# 清除依赖重新安装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 5. 📱 浏览器兼容性

#### 支持的浏览器
- Chrome 68+
- Firefox 60+
- Safari 12+
- Edge 79+

#### 检查WebSocket支持
在浏览器控制台执行：
```javascript
if (typeof WebSocket !== 'undefined') {
    console.log('✅ 浏览器支持WebSocket');
} else {
    console.log('❌ 浏览器不支持WebSocket');
}
```

### 6. 🔍 调试步骤

#### 1. 检查网络连接
```bash
# 测试本地回环
ping localhost

# 测试端口连通性
telnet localhost 8080
```

#### 2. 查看服务器日志
WebSocket服务器会在控制台输出详细日志：
- 用户连接/断开
- 消息收发
- 错误信息

#### 3. 浏览器开发者工具
1. 打开开发者工具 (F12)
2. 切换到 Network 标签
3. 过滤 WS (WebSocket)
4. 查看连接状态和消息

#### 4. 检查控制台错误
在浏览器控制台查看是否有错误信息：
- WebSocket连接错误
- JavaScript运行错误
- 网络请求失败

### 7. 📞 获取帮助

如果问题仍然存在，请提供以下信息：

1. **系统信息**：
   - 操作系统版本
   - Node.js版本 (`node --version`)
   - npm版本 (`npm --version`)

2. **错误日志**：
   - 服务器控制台输出
   - 浏览器控制台错误
   - 网络标签页的WebSocket状态

3. **测试结果**：
   - 端口检查结果
   - WebSocket测试页面结果
   - 进程状态

## ✨ 快速恢复命令

```bash
# 一键重启所有服务
pkill -f "node.*server|vite|concurrently" 2>/dev/null
sleep 2
npm run dev:full

# 等待5秒后测试
sleep 5
echo "测试连接..."
curl -s http://localhost:3000 > /dev/null && echo "✅ 前端服务正常" || echo "❌ 前端服务异常"
lsof -i :8080 > /dev/null && echo "✅ WebSocket服务正常" || echo "❌ WebSocket服务异常"
```

现在打开浏览器访问 http://localhost:3000 应该就能正常连接了！🎉 
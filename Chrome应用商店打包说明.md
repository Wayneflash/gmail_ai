# Gmail AI - Chrome应用商店打包说明

## 📦 打包准备

### 1. 需要打包的文件和文件夹
以下是需要包含在Chrome扩展包中的文件：

#### ✅ 必需文件
- `manifest.json` - 扩展配置文件
- `background.js` - 后台脚本
- `content.js` - 内容脚本
- `icons/` - 图标文件夹
  - `icon16.png`
  - `icon32.png` 
  - `icon48.png`
  - `icon128.png`
- `utils/` - 工具文件夹
  - `api.js`
- `styles/` - 样式文件夹
- `options/` - 设置页面文件夹
  - `options.html`
  - `options.css`
  - `options.js`
- `popup/` - 弹出页面文件夹
  - `popup.html`
  - `popup.css`
  - `popup.js`

#### ❌ 不需要打包的文件
- `.git/` - Git版本控制文件夹
- `.gitignore` - Git忽略文件
- `.cursorrules` - Cursor配置文件
- `README.md` - 项目说明文档
- `CHANGELOG.md` - 更新日志
- `LICENSE` - 许可证文件
- `配置修改指引.txt` - 配置说明文档
- `测试*.txt` - 测试相关文档
- `API测试说明.txt` - API测试文档
- `test-*.js` - 测试文件
- `test-*.html` - 测试页面
- `content-test.js` - 测试脚本
- `generate_icons.py` - 图标生成脚本
- `generate_icons.html` - 图标生成页面
- `create_icons.html` - 图标创建页面
- `test_api.py` - API测试脚本
- `re.md` - 其他文档

## 🚀 打包步骤

### 方法1: 手动打包（推荐）

1. **创建打包文件夹**
   ```
   mkdir gmail-ai-extension
   ```

2. **复制必需文件**
   ```
   # 复制主要文件
   copy manifest.json gmail-ai-extension/
   copy background.js gmail-ai-extension/
   copy content.js gmail-ai-extension/
   
   # 复制文件夹
   xcopy icons gmail-ai-extension\icons\ /E /I
   xcopy utils gmail-ai-extension\utils\ /E /I
   xcopy styles gmail-ai-extension\styles\ /E /I
   xcopy options gmail-ai-extension\options\ /E /I
   xcopy popup gmail-ai-extension\popup\ /E /I
   ```

3. **压缩为ZIP文件**
   - 选中 `gmail-ai-extension` 文件夹中的所有文件
   - 右键 → 发送到 → 压缩文件夹
   - 重命名为 `gmail-ai-v1.0.0.zip`

### 方法2: 使用PowerShell脚本

运行以下PowerShell命令：
```powershell
# 创建打包目录
New-Item -ItemType Directory -Force -Path "gmail-ai-extension"

# 复制必需文件
Copy-Item "manifest.json" "gmail-ai-extension/"
Copy-Item "background.js" "gmail-ai-extension/"
Copy-Item "content.js" "gmail-ai-extension/"

# 复制文件夹
Copy-Item "icons" "gmail-ai-extension/" -Recurse
Copy-Item "utils" "gmail-ai-extension/" -Recurse
Copy-Item "styles" "gmail-ai-extension/" -Recurse
Copy-Item "options" "gmail-ai-extension/" -Recurse
Copy-Item "popup" "gmail-ai-extension/" -Recurse

# 创建ZIP文件
Compress-Archive -Path "gmail-ai-extension\*" -DestinationPath "gmail-ai-v1.0.0.zip" -Force

Write-Host "✅ 打包完成: gmail-ai-v1.0.0.zip"
```

## 📋 上架前检查清单

### 1. 文件检查
- [ ] manifest.json 版本号正确
- [ ] 所有图标文件存在且尺寸正确
- [ ] 没有包含测试文件和文档
- [ ] 文件大小合理（建议小于10MB）

### 2. 功能测试
- [ ] 在Gmail中正常显示AI按钮
- [ ] AI回复优化功能正常
- [ ] 邮件总结功能正常
- [ ] 语言切换功能正常
- [ ] 语气风格选择正常

### 3. 隐私和安全
- [ ] 只请求必要的权限
- [ ] API密钥安全处理
- [ ] 用户数据本地存储
- [ ] 符合Chrome扩展政策

## 🏪 Chrome应用商店上架步骤

### 1. 开发者账户
- 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- 注册开发者账户（需要支付$5注册费）

### 2. 上传扩展
1. 点击"新增项目"
2. 上传 `gmail-ai-v1.0.0.zip` 文件
3. 填写扩展信息

### 3. 扩展信息填写

#### 基本信息
- **名称**: Gmail AI
- **简短描述**: AI-powered email assistant for Gmail with smart reply optimization
- **详细描述**: 
```
Gmail AI is an intelligent email assistant that helps you write better emails faster. 

Key Features:
🤖 Smart Email Summarization - Get instant AI-powered summaries of long emails
✨ Reply Optimization - Transform your draft replies into professional, polished responses
🎭 Multiple Tone Styles - Choose from 6 different tone styles (Natural, Professional, Friendly, Concise, Creative, Polite)
🌐 Bilingual Support - Full support for English and Chinese interfaces
⚡ Real-time Processing - Stream-based AI responses for faster results
🎨 Modern UI - Beautiful, Gmail-integrated interface with smooth animations

Perfect for:
- Business professionals who need to write polished emails
- Non-native speakers who want to improve their email writing
- Busy people who want to save time on email composition
- Anyone who wants to communicate more effectively via email

Privacy & Security:
- All processing happens securely through encrypted APIs
- No email content is stored or logged
- User data stays private and secure
- Minimal permissions required

Get started in seconds - no configuration needed!
```

#### 图标和截图
- **图标**: 使用 `icons/icon128.png`
- **截图**: 需要准备5张1280x800的截图展示功能
- **宣传图**: 可选，440x280尺寸

#### 分类和标签
- **类别**: 生产力工具 (Productivity)
- **标签**: email, ai, gmail, productivity, writing assistant

### 4. 隐私政策
需要提供隐私政策URL，说明数据收集和使用情况。

### 5. 审核提交
- 完成所有信息填写
- 提交审核（通常需要1-3个工作日）

## 🔧 版本更新

当需要更新扩展时：
1. 修改 `manifest.json` 中的版本号
2. 重新打包
3. 在开发者控制台上传新版本
4. 提交审核

## 📞 技术支持

如果在打包或上架过程中遇到问题：
1. 检查Chrome扩展开发文档
2. 查看开发者控制台的错误信息
3. 确保所有文件路径正确
4. 验证manifest.json格式正确

---

**注意**: 上架Chrome应用商店需要遵守Google的开发者政策，确保扩展功能合规且用户友好。 
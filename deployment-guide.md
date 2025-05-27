# 🌐 Gmail AI 网站部署指南

## 📋 文件说明

我为您创建了以下文件：

1. **`index.html`** - 主页面，展示Gmail AI的功能特性
2. **`privacy-policy.html`** - 隐私政策和服务条款页面（中英文）
3. **`deployment-guide.md`** - 本部署指南

## 🚀 部署方案

### 方案1: GitHub Pages（推荐 - 免费）

#### 步骤1: 创建GitHub仓库
```bash
# 1. 在GitHub上创建新仓库，命名为 gmail-ai-website
# 2. 克隆到本地
git clone https://github.com/yourusername/gmail-ai-website.git
cd gmail-ai-website

# 3. 复制网站文件
cp index.html ./
cp privacy-policy.html ./
```

#### 步骤2: 推送到GitHub
```bash
git add .
git commit -m "Add Gmail AI website and privacy policy"
git push origin main
```

#### 步骤3: 启用GitHub Pages
1. 进入仓库设置 (Settings)
2. 滚动到 "Pages" 部分
3. 选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 点击 "Save"

#### 步骤4: 获取网址
- 您的网站将在 `https://yourusername.github.io/gmail-ai-website/` 可用
- 隐私政策页面: `https://yourusername.github.io/gmail-ai-website/privacy-policy.html`

### 方案2: Netlify（免费 + 自定义域名）

#### 步骤1: 准备文件
1. 将 `index.html` 和 `privacy-policy.html` 放在同一文件夹
2. 压缩为 ZIP 文件

#### 步骤2: 部署到Netlify
1. 访问 [netlify.com](https://netlify.com)
2. 注册/登录账户
3. 拖拽ZIP文件到部署区域
4. 等待部署完成

#### 步骤3: 自定义域名（可选）
1. 在Netlify控制台点击 "Domain settings"
2. 添加自定义域名（如 gmail-ai.com）
3. 按照指示配置DNS

### 方案3: Vercel（免费）

#### 步骤1: 安装Vercel CLI
```bash
npm i -g vercel
```

#### 步骤2: 部署
```bash
# 在包含HTML文件的文件夹中运行
vercel

# 按照提示完成部署
```

## 📝 Chrome Web Store 填写

### 隐私政策网址字段
根据您选择的部署方案，填写相应的URL：

- **GitHub Pages**: `https://yourusername.github.io/gmail-ai-website/privacy-policy.html`
- **Netlify**: `https://your-site-name.netlify.app/privacy-policy.html`
- **Vercel**: `https://your-project.vercel.app/privacy-policy.html`
- **自定义域名**: `https://gmail-ai.com/privacy-policy.html`

### 主页网址字段（可选）
- **GitHub Pages**: `https://yourusername.github.io/gmail-ai-website/`
- **Netlify**: `https://your-site-name.netlify.app/`
- **Vercel**: `https://your-project.vercel.app/`
- **自定义域名**: `https://gmail-ai.com/`

## 🔧 自定义修改

### 修改联系信息
在 `privacy-policy.html` 中找到以下部分并修改：

```html
<p><strong>Email:</strong> support@gmail-ai.com</p>
<p><strong>Website:</strong> https://gmail-ai.com</p>
```

### 修改Chrome Web Store链接
在 `index.html` 中找到以下部分并修改：

```html
<a href="https://chrome.google.com/webstore/detail/your-extension-id" class="btn btn-primary">
    🚀 Install Extension
</a>
```

### 修改GitHub链接
在 `index.html` 中找到以下部分并修改：

```html
<a href="https://github.com/yourusername/gmail_ai">GitHub</a>
```

## ✅ 部署检查清单

- [ ] 网站可以正常访问
- [ ] 隐私政策页面显示正确
- [ ] 中英文切换功能正常
- [ ] 移动端显示正常
- [ ] 所有链接都能正常工作
- [ ] 联系信息已更新为真实信息
- [ ] Chrome Web Store链接已更新

## 🎯 推荐配置

### 最佳实践
1. **使用HTTPS**: 确保网站使用HTTPS协议
2. **响应式设计**: 页面已优化为响应式，支持各种设备
3. **SEO优化**: 已包含meta标签和描述
4. **加载速度**: 使用内联CSS确保快速加载

### 域名建议
- `gmail-ai.com`
- `gmailai.app`
- `email-ai-assistant.com`
- `smartgmail.ai`

## 📞 技术支持

如果在部署过程中遇到问题：

1. **GitHub Pages问题**: 检查仓库设置和文件路径
2. **域名配置问题**: 确认DNS设置正确
3. **页面显示问题**: 检查浏览器控制台错误信息
4. **移动端问题**: 使用浏览器开发者工具测试

## 🎉 完成后

部署完成后，您将拥有：
- ✅ 专业的隐私政策页面
- ✅ 符合Chrome Web Store要求的网址
- ✅ 中英文双语支持
- ✅ 现代化的响应式设计
- ✅ 完整的服务条款

现在您可以在Chrome Web Store的上架表单中填写隐私政策网址了！ 
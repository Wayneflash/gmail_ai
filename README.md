# Gmail AI回复助手 🤖

一个强大的Chrome扩展，为Gmail提供AI驱动的智能回复功能，集成DeepSeek AI模型，让邮件回复更高效、更专业。

## ✨ 主要功能

### 🧠 智能邮件分析
- **自动邮件总结**：AI自动分析邮件内容，提取关键信息
- **上下文理解**：深度理解邮件语境和发件人意图
- **多语言支持**：支持中英文邮件的智能处理

### 💬 智能回复生成
- **一键AI回复**：基于邮件内容生成专业回复
- **多种回复风格**：专业、友好、简洁、详细四种风格可选
- **内容优化**：用户输入简单想法，AI优化为专业回复
- **格式保持**：完美保持段落、换行等格式结构

### 🎨 现代化界面
- **Monica AI风格**：仿照Monica AI的优雅界面设计
- **居中面板**：美观的居中显示面板，支持流式输出
- **智能按钮**：自动检测Gmail输入框，添加AI回复按钮
- **响应式设计**：适配不同屏幕尺寸

## 🚀 快速开始

### 安装方法

1. **下载扩展文件**
   ```bash
   git clone https://github.com/Wayneflash/gmail_ai.git
   cd gmail_ai
   ```

2. **加载到Chrome**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

3. **🎉 自动配置完成！**
   - ✅ **无需手动配置**：扩展会自动配置默认API密钥和DeepSeek-V3模型
   - ✅ **即装即用**：安装完成后可直接在Gmail中使用
   - ✅ **智能提示**：扩展图标会显示"配置完成"状态
   - 🔧 **可选设置**：如需自定义，点击扩展图标 → "高级设置"

### 使用方法

1. **打开Gmail**并进入邮件回复页面
2. **自动显示AI按钮**（在输入框下方）
3. **点击AI回复按钮**打开智能面板
4. **查看邮件总结**（自动生成）
5. **输入回复想法**到文本框中
6. **点击"AI优化回复"**生成专业回复
7. **点击"使用此回复"**插入到Gmail编辑器

> 💡 **提示**：首次使用时，扩展已自动配置完成，无需任何设置即可开始使用！

## 🔧 技术特性

### AI集成
- **DeepSeek-V3模型**：使用最新的DeepSeek-V3大语言模型
- **流式输出**：支持实时流式响应，提升用户体验
- **多模型支持**：支持DeepSeek系列和Qwen系列模型
- **智能重试**：API调用失败时自动重试机制

### Gmail兼容性
- **Manifest V3**：使用最新的Chrome扩展标准
- **完美格式保持**：智能识别邮件结构，保持原始格式
- **事件触发**：完整的Gmail事件触发机制
- **多版本支持**：兼容新版和经典版Gmail界面

### 安全性
- **本地处理**：敏感数据在本地处理，保护隐私
- **HTTPS通信**：所有API调用使用HTTPS加密
- **最小权限**：仅请求必要的浏览器权限

## 📁 项目结构

```
mail_ai/
├── manifest.json          # 扩展配置文件
├── background.js          # 后台服务脚本
├── content.js            # 内容脚本（主要功能）
├── popup/               # 弹出窗口
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/             # 设置页面
│   ├── options.html
│   ├── options.js
│   └── options.css
├── icons/              # 扩展图标
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── styles/             # 样式文件
│   └── content.css
├── utils/              # 工具函数
│   └── api.js
└── README.md           # 项目说明
```

## ⚙️ 配置选项

### API配置
- **API地址**：`https://api.ap.siliconflow.com/v1/chat/completions`
- **支持模型**：
  - `deepseek-ai/DeepSeek-V3` (推荐)
  - `deepseek-ai/DeepSeek-Chat`
  - `Qwen/Qwen2.5-72B-Instruct`

### 回复风格
- **专业风格**：正式的商务邮件回复
- **友好风格**：亲切温和的日常交流
- **简洁风格**：简明扼要的快速回复
- **详细风格**：全面详细的正式回复

### 界面自定义
- **按钮位置**：可调整AI按钮的显示位置
- **面板大小**：可自定义AI面板的尺寸
- **颜色主题**：支持自定义按钮和面板颜色

## 🛠️ 开发指南

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/mail_ai.git
   cd mail_ai
   ```

2. **修改代码**
   - 主要功能在 `content.js` 中
   - API调用在 `background.js` 中
   - 界面样式在 `styles/` 目录中

3. **测试扩展**
   - 在Chrome中重新加载扩展
   - 刷新Gmail页面测试功能

### 自定义配置

详细的配置修改说明请参考 [`配置修改指引.txt`](./配置修改指引.txt)

### 常见问题

1. **AI按钮不显示**
   - 检查Gmail页面是否完全加载
   - 刷新页面重新初始化
   - 查看控制台错误信息

2. **API调用失败**
   - 验证API密钥是否正确
   - 检查网络连接
   - 尝试切换其他模型

3. **格式插入问题**
   - 使用最新版本的插入函数
   - 检查Gmail编辑器兼容性
   - 查看详细错误日志

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [DeepSeek AI](https://www.deepseek.com/) - 提供强大的AI模型
- [硅基流动](https://siliconflow.cn/) - 提供API服务
- [Monica AI](https://monica.im/) - 界面设计灵感

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [配置修改指引](./配置修改指引.txt)
2. 提交 [Issue](https://github.com/yourusername/mail_ai/issues)
3. 查看浏览器控制台的错误信息

---

**⭐ 如果这个项目对您有帮助，请给个Star支持一下！** 
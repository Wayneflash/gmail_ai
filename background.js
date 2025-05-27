/**
 * Gmail AI回复助手 - 后台脚本
 * 处理API调用和消息传递
 */

// 导入API工具
importScripts('utils/api.js');

/**
 * 扩展安装/更新事件监听
 * 首次安装时自动检测浏览器语言
 */
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('🚀 Gmail AI扩展已安装/更新:', details.reason);
    
    try {
        if (details.reason === 'install') {
            // 首次安装，检测浏览器语言
            const browserLang = detectBrowserLanguage();
            await chrome.storage.sync.set({ 
                language: browserLang,
                languageAutoDetected: true 
            });
            console.log('🎯 首次安装，自动设置语言为:', browserLang);
        }
    } catch (error) {
        console.error('❌ 安装时语言设置失败:', error);
    }
});

/**
 * 处理扩展图标点击事件
 * 在Gmail页面中显示AI面板，而不是popup
 */
chrome.action.onClicked.addListener(async (tab) => {
    console.log('扩展图标被点击，标签页:', tab.url);
    
    try {
        // 检查是否在Gmail页面
        if (tab.url && tab.url.includes('mail.google.com')) {
            // 在Gmail页面中显示AI面板
            await chrome.tabs.sendMessage(tab.id, {
                action: 'showAIPanel'
            });
            console.log('✅ 已发送显示AI面板消息到Gmail页面');
        } else {
            // 不在Gmail页面，打开Gmail
            await chrome.tabs.create({
                url: 'https://mail.google.com',
                active: true
            });
            console.log('✅ 已打开Gmail页面');
        }
    } catch (error) {
        console.error('❌ 处理扩展图标点击失败:', error);
        
        // 如果发送消息失败，可能是页面还没加载完成，尝试打开Gmail
        try {
            await chrome.tabs.create({
                url: 'https://mail.google.com',
                active: true
            });
        } catch (fallbackError) {
            console.error('❌ 备用方案也失败:', fallbackError);
        }
    }
});

// 多语言配置
const LANGUAGE_CONFIG = {
    en: {
        // AI提示词
        prompts: {
            summary: "Please analyze the following email content and provide a concise summary in English. Include: 1) Email subject/topic, 2) Sender's intent, 3) Key information, 4) Action items needed. Format as clear bullet points:",
            reply: "Based on the following email content, generate a professional reply in English. Style: {style}. Email content:",
            optimize: "You are helping me write a professional email reply. I received an email and need to respond to the sender. Please optimize my draft reply to make it more professional and appropriate. Keep the same meaning but improve the tone, grammar, and structure. Make sure the reply is addressed TO THE SENDER (not to me). Here is the context:"
        },
        // 界面文本
        ui: {
            aiAssistant: "Gmail AI",
            emailSummary: "📄 Email Summary",
            yourReply: "💬 Your Reply",
            optimizedReply: "🎯 Optimized Reply",
            useReply: "📝 Use This Reply",
            reOptimize: "🔄 Re-optimize",
            analyzing: "🤖 Analyzing email content...",
            optimizing: "🤖 Optimizing your reply...",
            inputHint: "💡 Tip: Press Enter to quickly optimize reply",
            optimizeButton: "✨ AI Optimize Reply",
            aiReplyButton: "Gmail AI",
            summaryButton: "AI Summary",
            languageSwitch: "🌐 中文",
            noEmailContent: "❌ No email content found, please use in email page",
            optimizeFailed: "❌ Optimization failed",
            summaryFailed: "❌ Summary failed",
            replyInserted: "Reply inserted into email",
            extensionUpdated: "🔄 Gmail AI updated",
            refreshPage: "Refresh Page",
            toneStyle: "🎭 Tone Style",
            toneDefault: "Natural",
            toneProfessional: "Professional",
            toneFriendly: "Friendly",
            toneConcise: "Concise",
            toneCreative: "Creative",
            tonePolite: "Polite",
            toneHintDefault: "Natural and appropriate tone",
            toneHintProfessional: "Formal business communication",
            toneHintFriendly: "Warm and approachable style",
            toneHintConcise: "Brief and direct response",
            toneHintCreative: "Engaging and thoughtful tone",
            toneHintPolite: "Extra courteous and respectful"
        },
        // 回复风格
        styles: {
            professional: "professional and formal business style",
            friendly: "friendly and warm style", 
            concise: "concise and direct style",
            detailed: "detailed and comprehensive style"
        },
        // 语气风格配置
        toneStyles: {
            default: {
                name: "Default",
                prompt: "Reply in a natural and appropriate tone"
            },
            professional: {
                name: "Professional",
                prompt: "Reply in a professional, formal business tone"
            },
            friendly: {
                name: "Friendly",
                prompt: "Reply in a warm, friendly, and approachable tone"
            },
            concise: {
                name: "Concise",
                prompt: "Reply in a brief, direct, and to-the-point tone"
            },
            creative: {
                name: "Creative",
                prompt: "Reply in a creative, engaging, and thoughtful tone"
            },
            polite: {
                name: "Polite",
                prompt: "Reply in an extra polite, courteous, and respectful tone"
            }
        }
    },
    zh: {
        // AI提示词
        prompts: {
            summary: "请分析以下邮件内容并用中文提供简洁的总结。包括：1) 邮件主题，2) 发件人意图，3) 关键信息，4) 需要回复的要点。请用清晰的要点格式：",
            reply: "根据以下邮件内容，用中文生成一个专业的回复。风格：{style}。邮件内容：",
            optimize: "你正在帮助我撰写专业的邮件回复。我收到了一封邮件，需要回复给发件人。请优化我的回复草稿，使其更加专业和得体。保持原意不变，但改进语气、语法和结构。确保回复是写给发件人的（不是写给我的）。以下是上下文："
        },
        // 界面文本
        ui: {
            aiAssistant: "Gmail AI",
            emailSummary: "📄 邮件总结",
            yourReply: "💬 您的回复",
            optimizedReply: "🎯 优化后的回复",
            useReply: "📝 使用此回复",
            reOptimize: "🔄 重新优化",
            analyzing: "🤖 正在分析邮件内容...",
            optimizing: "🤖 正在优化您的回复...",
            inputHint: "💡 提示：按 Enter 键快速优化回复",
            optimizeButton: "✨ AI优化回复",
            aiReplyButton: "Gmail AI",
            summaryButton: "AI总结",
            languageSwitch: "🌐 English",
            noEmailContent: "❌ 未找到邮件内容，请确保在邮件页面中使用",
            optimizeFailed: "❌ 优化失败",
            summaryFailed: "❌ 总结失败",
            replyInserted: "回复已插入到邮件中",
            extensionUpdated: "🔄 Gmail AI已更新",
            refreshPage: "刷新页面",
            toneStyle: "🎭 语气风格",
            toneDefault: "自然",
            toneProfessional: "专业",
            toneFriendly: "友好",
            toneConcise: "简洁",
            toneCreative: "创意",
            tonePolite: "礼貌",
            toneHintDefault: "自然和适当的语气",
            toneHintProfessional: "正式的商业沟通",
            toneHintFriendly: "温暖和可接近的风格",
            toneHintConcise: "简洁和直接的回应",
            toneHintCreative: "引人入胜和深思熟虑的语气",
            toneHintPolite: "额外礼貌和尊重"
        },
        // 回复风格
        styles: {
            professional: "专业、正式的商务风格",
            friendly: "友好、亲切的风格",
            concise: "简洁、直接的风格", 
            detailed: "详细、全面的风格"
        },
        // 语气风格配置
        toneStyles: {
            default: {
                name: "Default",
                prompt: "Reply in a natural and appropriate tone"
            },
            professional: {
                name: "Professional",
                prompt: "Reply in a professional, formal business tone"
            },
            friendly: {
                name: "Friendly",
                prompt: "Reply in a warm, friendly, and approachable tone"
            },
            concise: {
                name: "Concise",
                prompt: "Reply in a brief, direct, and to-the-point tone"
            },
            creative: {
                name: "Creative",
                prompt: "Reply in a creative, engaging, and thoughtful tone"
            },
            polite: {
                name: "Polite",
                prompt: "Reply in an extra polite, courteous, and respectful tone"
            }
        }
    }
};

// 默认配置 - 扩展安装时自动设置
const DEFAULT_CONFIG = {
    apiKey: 'sk-moyezvpaajlpslwhpieojhplhxafpyhgpoiueqlqcatjpbqt',
    model: 'deepseek-ai/DeepSeek-V3',
    maxTokens: 1000,
    temperature: 0.7,
    defaultStyle: 'friendly',
    autoGenerate: true,
    showNotifications: true,
    saveHistory: false,
    replyCount: 3,
    customPrompt: '',
    language: 'en', // 默认英文
    timeout: 30,
    retryCount: 2,
    isConfigured: true // 标记已配置，避免用户需要手动设置
};

/**
 * 扩展安装时的初始化
 * 自动配置默认设置，用户无需手动配置
 */
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('Gmail AI助手安装/更新:', details.reason);
    
    try {
        // 检查是否已有配置
        const existingConfig = await chrome.storage.sync.get(['isConfigured']);
        
        if (!existingConfig.isConfigured || details.reason === 'install') {
            // 首次安装或未配置时，自动设置默认配置
            await chrome.storage.sync.set(DEFAULT_CONFIG);
            console.log('✅ 自动配置完成，使用默认设置:');
            console.log('- API密钥: 已设置默认密钥');
            console.log('- AI模型: DeepSeek-V3');
            console.log('- 用户无需手动配置即可使用');
            
            // 显示欢迎通知
            if (chrome.notifications) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Gmail AI助手',
                    message: '安装成功！已自动配置完成，可直接在Gmail中使用AI回复功能。'
                });
            }
        } else {
            console.log('✅ 检测到已有配置，保持用户设置');
        }
    } catch (error) {
        console.error('❌ 自动配置失败:', error);
        // 即使配置失败，也设置基本配置确保功能可用
        await chrome.storage.sync.set({
            apiKey: DEFAULT_CONFIG.apiKey,
            model: DEFAULT_CONFIG.model,
            isConfigured: true
        });
    }
});

/**
 * 扩展启动时检查配置
 * 确保配置完整性
 */
chrome.runtime.onStartup.addListener(async () => {
    console.log('Gmail AI助手启动');
    
    try {
        const config = await chrome.storage.sync.get(DEFAULT_CONFIG);
        
        // 检查关键配置是否存在
        if (!config.apiKey || !config.model) {
            console.log('⚠️ 检测到配置不完整，自动补充默认配置');
            await chrome.storage.sync.set({
                ...DEFAULT_CONFIG,
                ...config // 保留用户已有的设置
            });
        }
        
        console.log('✅ 配置检查完成，扩展就绪');
    } catch (error) {
        console.error('❌ 启动配置检查失败:', error);
    }
});

/**
 * 检测浏览器默认语言
 */
function detectBrowserLanguage() {
    try {
        // 获取浏览器语言设置
        const browserLang = chrome.i18n.getUILanguage() || navigator.language || navigator.userLanguage || 'en';
        console.log('🌐 检测到浏览器语言:', browserLang);
        
        // 判断是否为中文环境
        if (browserLang.toLowerCase().includes('zh') || 
            browserLang.toLowerCase().includes('cn') ||
            browserLang.toLowerCase().includes('chinese')) {
            return 'zh';
        }
        
        // 默认返回英文
        return 'en';
    } catch (error) {
        console.error('❌ 检测浏览器语言失败:', error);
        return 'en'; // 默认英文
    }
}

/**
 * 获取当前语言配置
 */
async function getCurrentLanguageConfig() {
    try {
        const config = await chrome.storage.sync.get(['language', 'languageAutoDetected']);
        let currentLang = config.language;
        
        // 如果用户没有手动设置过语言，则自动检测浏览器语言
        if (!currentLang && !config.languageAutoDetected) {
            currentLang = detectBrowserLanguage();
            console.log('🎯 自动检测语言设置为:', currentLang);
            
            // 保存自动检测的语言设置
            await chrome.storage.sync.set({ 
                language: currentLang,
                languageAutoDetected: true 
            });
        } else if (!currentLang) {
            // 如果已经自动检测过但没有语言设置，使用默认英文
            currentLang = 'en';
        }
        
        console.log('📝 当前使用语言:', currentLang);
        
        return {
            lang: currentLang,
            config: LANGUAGE_CONFIG[currentLang]
        };
    } catch (error) {
        console.error('❌ 获取语言配置失败:', error);
        return {
            lang: 'en',
            config: LANGUAGE_CONFIG.en
        };
    }
}

/**
 * 切换语言
 */
async function switchLanguage() {
    try {
        const config = await chrome.storage.sync.get(['language']);
        const currentLang = config.language || 'en';
        const newLang = currentLang === 'en' ? 'zh' : 'en';
        
        // 保存新语言设置，并标记为手动设置（覆盖自动检测）
        await chrome.storage.sync.set({ 
            language: newLang,
            languageAutoDetected: false // 标记为手动设置
        });
        
        console.log(`🔄 语言已手动切换: ${currentLang} -> ${newLang}`);
        
        return {
            success: true,
            newLanguage: newLang,
            config: LANGUAGE_CONFIG[newLang]
        };
    } catch (error) {
        console.error('❌ 切换语言失败:', error);
        throw error;
    }
}

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到消息:', request);
    
    if (request.action === 'generateReply') {
        handleGenerateReply(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // 保持消息通道开放
    }
    
    if (request.action === 'generateSummary') {
        handleGenerateSummary(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'optimizeText') {
        handleOptimizeText(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'translateText') {
        handleTranslateText(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'optimizeReply') {
        handleOptimizeReply(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'generateSummaryStream') {
        handleGenerateSummaryStream(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'optimizeReplyStream') {
        handleOptimizeReplyStream(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    // 设置页面相关消息
    if (request.action === 'testAPI') {
        testAPIConnection()
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'getSettings') {
        getSettings()
            .then(settings => sendResponse({ success: true, data: settings }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'saveSettings') {
        saveSettings(request.data)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'getConfig') {
        handleGetConfig(sendResponse);
        return true;
    }
    
    if (request.action === 'saveConfig') {
        handleSaveConfig(request.data, sendResponse);
        return true;
    }
    
    if (request.action === 'testConnection') {
        handleTestConnection(request.data, sendResponse);
        return true;
    }
    
    if (request.action === 'testApiConnection') {
        handleTestApiConnection(request, sendResponse);
        return true;
    }
    
    if (request.action === 'settingsUpdated') {
        handleSettingsUpdated(request.settings, sendResponse);
        return true;
    }
    
    // 语言相关消息处理
    if (request.action === 'getLanguageConfig') {
        getCurrentLanguageConfig()
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    if (request.action === 'switchLanguage') {
        switchLanguage()
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
    
    sendResponse({ success: false, error: '未知操作' });
    return true; // 保持消息通道开放
});

/**
 * 处理生成回复请求
 */
async function handleGenerateReply(data) {
    try {
        const { emailContent, style = 'friendly' } = data;
        
        if (!emailContent) {
            throw new Error('邮件内容不能为空');
        }
        
        console.log('正在生成回复，风格:', style);
        
        // 调用API生成回复
        const replies = await EmailAI.generateEmailReply(emailContent, style);
        
        console.log('回复生成成功:', replies);
        
        return replies;
    } catch (error) {
        console.error('生成回复失败:', error);
        throw error;
    }
}

/**
 * 处理生成邮件总结请求
 */
async function handleGenerateSummary(data) {
    try {
        const { emailContent } = data;
        
        if (!emailContent) {
            throw new Error('邮件内容不能为空');
        }
        
        console.log('正在生成邮件总结');
        
        // 获取当前语言配置
        const { lang, config: langConfig } = await getCurrentLanguageConfig();
        
        // 构建多语言总结提示词
        const prompt = `${langConfig.prompts.summary}

${emailContent}`;

        // 调用API
        const summary = await callAIAPI(prompt);
        
        console.log('邮件总结生成成功');
        
        return summary;
    } catch (error) {
        console.error('生成邮件总结失败:', error);
        throw error;
    }
}

/**
 * 处理文本优化请求
 */
async function handleOptimizeText(data) {
    try {
        const { text } = data;
        
        if (!text) {
            throw new Error('文本内容不能为空');
        }
        
        console.log('正在优化文本');
        
        // 获取当前语言配置
        const { lang, config: langConfig } = await getCurrentLanguageConfig();
        
        // 构建多语言优化提示词
        const prompt = `${langConfig.prompts.optimize}

${text}`;

        // 调用API
        const optimizedText = await callAIAPI(prompt);
        
        console.log('文本优化成功');
        
        return optimizedText;
    } catch (error) {
        console.error('文本优化失败:', error);
        throw error;
    }
}

/**
 * 处理翻译请求
 */
async function handleTranslateText(data) {
    try {
        const { text } = data;
        
        if (!text || text.trim() === '') {
            throw new Error('没有提供要翻译的文本');
        }
        
        console.log('开始翻译文本...');
        
        const prompt = `请将以下文本翻译成中文，如果原文是中文则翻译成英文。保持原文的语气和格式：

${text}`;
        
        const translatedText = await callAIAPI(prompt);
        
        console.log('文本翻译成功');
        
        return translatedText;
    } catch (error) {
        console.error('文本翻译失败:', error);
        throw error;
    }
}

/**
 * 处理优化回复请求
 */
async function handleOptimizeReply(data) {
    try {
        const { userReply, emailContext, style = 'professional' } = data;
        
        if (!userReply || userReply.trim() === '') {
            throw new Error('没有提供要优化的回复内容');
        }
        
        console.log('开始优化用户回复...');
        console.log('用户回复:', userReply);
        console.log('邮件上下文长度:', emailContext ? emailContext.length : 0);
        
        // 获取当前语言配置
        const { lang, config: langConfig } = await getCurrentLanguageConfig();
        
        // 获取风格描述
        const styleDescription = langConfig.styles[style] || langConfig.styles.professional;
        
        // 构建多语言优化提示词
        let prompt = `${langConfig.prompts.optimize}

Style: ${styleDescription}`;

        // 如果有邮件上下文，加入上下文信息
        if (emailContext && emailContext.trim()) {
            prompt += `

Original email content:
${emailContext}

---`;
        }

        prompt += `

User's reply draft:
${userReply}`;
        
        const optimizedReply = await callAIAPI(prompt);
        
        console.log('回复优化成功');
        
        return optimizedReply;
    } catch (error) {
        console.error('回复优化失败:', error);
        throw error;
    }
}

/**
 * 调用AI API的通用方法 - 使用流式调用
 */
async function callAIAPI(prompt) {
    try {
        // 获取配置
        const config = await getStoredConfig();
        
        const requestBody = {
            model: config.model || 'deepseek-ai/DeepSeek-V3',
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的邮件助手，能够帮助用户处理各种邮件相关任务。请用简洁、专业的中文回复。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: config.maxTokens || 1000,
            temperature: config.temperature || 0.7,
            stream: true  // 改为流式调用
        };
        
        console.log('发送流式API请求:', requestBody);
        
        const response = await fetch(config.baseUrl + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorData.error?.message || '未知错误'}`);
        }
        
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        console.log('开始处理流式响应...');
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('流式响应完成，总内容长度:', fullContent.length);
                break;
            }
            
            // 解码数据块
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') {
                        continue;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        
                        if (content) {
                            fullContent += content;
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理下一行
                        console.log('解析数据块时出错:', e.message);
                    }
                }
            }
        }
        
        if (!fullContent.trim()) {
            throw new Error('API响应内容为空');
        }
        
        console.log('流式API调用成功，内容:', fullContent.substring(0, 100) + '...');
        return fullContent.trim();
        
    } catch (error) {
        console.error('流式API调用失败:', error);
        throw error;
    }
}

/**
 * 处理获取配置请求
 */
async function handleGetConfig(sendResponse) {
    try {
        const config = await getStoredConfig();
        sendResponse({
            success: true,
            data: config
        });
    } catch (error) {
        console.error('获取配置失败:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

/**
 * 处理保存配置请求
 */
async function handleSaveConfig(config, sendResponse) {
    try {
        await chrome.storage.sync.set({ config });
        sendResponse({
            success: true,
            data: config
        });
    } catch (error) {
        console.error('保存配置失败:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

/**
 * 处理测试连接请求
 */
async function handleTestConnection(data, sendResponse) {
    try {
        const { apiKey } = data;
        
        // 使用提供的API密钥测试连接
        const testConfig = {
            ...await getStoredConfig(),
            apiKey: apiKey
        };
        
        const response = await fetch(testConfig.baseUrl + '/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${testConfig.apiKey}`
            }
        });
        
        if (response.ok) {
            sendResponse({
                success: true,
                data: { connected: true }
            });
        } else {
            throw new Error(`连接测试失败: ${response.status}`);
        }
        
    } catch (error) {
        console.error('测试连接失败:', error);
        sendResponse({
            success: false,
            error: error.message,
            data: { connected: false }
        });
    }
}

/**
 * 获取存储的配置
 */
async function getStoredConfig() {
    try {
        const result = await chrome.storage.sync.get(['config']);
        const defaultConfig = {
            apiKey: 'sk-moyezvpaajlpslwhpieojhplhxafpyhgpoiueqlqcatjpbqt',
            baseUrl: 'https://api.ap.siliconflow.com/v1',
            model: 'deepseek-ai/DeepSeek-V3',
            maxTokens: 1000,
            temperature: 0.7,
            defaultStyle: 'friendly'
        };
        
        return { ...defaultConfig, ...result.config };
    } catch (error) {
        console.error('获取配置失败:', error);
        // 返回默认配置
        return {
            apiKey: 'sk-moyezvpaajlpslwhpieojhplhxafpyhgpoiueqlqcatjpbqt',
            baseUrl: 'https://api.ap.siliconflow.com/v1',
            model: 'deepseek-ai/DeepSeek-V3',
            maxTokens: 1000,
            temperature: 0.7,
            defaultStyle: 'friendly'
        };
    }
}

/**
 * 更新使用统计
 */
async function updateUsageStats() {
    try {
        const result = await chrome.storage.local.get(['usageStats']);
        const stats = result.usageStats || {
            totalReplies: 0,
            todayReplies: 0,
            lastResetDate: new Date().toDateString()
        };
        
        const today = new Date().toDateString();
        if (stats.lastResetDate !== today) {
            stats.todayReplies = 0;
            stats.lastResetDate = today;
        }
        
        stats.totalReplies++;
        stats.todayReplies++;
        
        await chrome.storage.local.set({ usageStats: stats });
        
    } catch (error) {
        console.error('更新使用统计失败:', error);
    }
}

console.log('Gmail AI回复助手后台脚本已加载');

/**
 * 处理API连接测试请求（来自设置页面）
 */
async function handleTestApiConnection(request, sendResponse) {
    try {
        const { apiKey, model } = request;
        
        console.log('测试API连接:', { apiKey: apiKey ? '***' : '无', model });
        
        // 构建测试请求
        const testPrompt = '你好，这是一个连接测试。请简单回复"连接成功"。';
        
        const response = await fetch('https://api.ap.siliconflow.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: testPrompt
                    }
                ],
                max_tokens: 50,
                temperature: 0.1,
                stream: true
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API请求失败: ${response.status} - ${errorText}`);
        }
        
        // 读取流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        
                        if (content) {
                            fullContent += content;
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }
        
        console.log('API测试成功，响应:', fullContent);
        
        sendResponse({
            success: true,
            data: { response: fullContent || '连接成功' }
        });
        
    } catch (error) {
        console.error('API连接测试失败:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

/**
 * 处理设置更新通知
 */
async function handleSettingsUpdated(settings, sendResponse) {
    try {
        console.log('设置已更新:', settings);
        
        // 这里可以添加设置更新后的处理逻辑
        // 比如清除缓存、重新初始化等
        
        sendResponse({
            success: true,
            message: '设置更新已处理'
        });
        
    } catch (error) {
        console.error('处理设置更新失败:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

/**
 * 处理流式邮件总结请求
 */
async function handleGenerateSummaryStream(data) {
    try {
        const { emailContent } = data;
        
        if (!emailContent) {
            throw new Error('邮件内容不能为空');
        }
        
        console.log('正在生成邮件总结（流式）');
        
        // 获取当前语言配置
        const { lang, config: langConfig } = await getCurrentLanguageConfig();
        
        // 构建多语言总结提示词
        const prompt = `${langConfig.prompts.summary}

${emailContent}`;

        // 调用API
        const summary = await callAIAPI(prompt);
        
        console.log('邮件总结生成成功（流式）');
        
        return summary;
    } catch (error) {
        console.error('生成邮件总结失败（流式）:', error);
        throw error;
    }
}

/**
 * 处理流式回复优化请求
 */
async function handleOptimizeReplyStream(data) {
    try {
        const { userReply, emailContext, style = 'professional', tone = 'default' } = data;
        
        if (!userReply || userReply.trim() === '') {
            throw new Error('没有提供要优化的回复内容');
        }
        
        console.log('开始优化用户回复（流式）...');
        console.log('用户回复:', userReply);
        console.log('邮件上下文长度:', emailContext ? emailContext.length : 0);
        console.log('选择的语气风格:', tone);
        
        // 获取当前语言配置
        const { lang, config: langConfig } = await getCurrentLanguageConfig();
        
        // 获取风格描述
        const styleDescription = langConfig.styles[style] || langConfig.styles.professional;
        
        // 获取语气风格描述
        const toneDescription = langConfig.toneStyles[tone] ? 
            langConfig.toneStyles[tone].prompt : 
            langConfig.toneStyles.default.prompt;
        
        // 构建多语言优化提示词
        let prompt = `${langConfig.prompts.optimize}

Style: ${styleDescription}
Tone: ${toneDescription}`;

        // 如果有邮件上下文，加入上下文信息
        if (emailContext && emailContext.trim()) {
            prompt += `

ORIGINAL EMAIL I RECEIVED:
${emailContext}

---

MY DRAFT REPLY (please optimize this):
${userReply}

Please optimize my draft reply above to respond professionally to the original email. Make sure the optimized reply is addressed to the sender of the original email.`;
        } else {
            prompt += `

MY DRAFT REPLY (please optimize this):
${userReply}

Please optimize this draft reply to make it more professional and appropriate.`;
        }
        
        const optimizedReply = await callAIAPI(prompt);
        
        console.log('回复优化成功（流式）');
        
        return optimizedReply;
    } catch (error) {
        console.error('回复优化失败（流式）:', error);
        throw error;
    }
} 
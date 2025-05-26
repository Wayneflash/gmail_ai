/**
 * Gmail AI回复助手 - 后台脚本
 * 处理API调用和消息传递
 */

// 导入API工具
importScripts('utils/api.js');

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
    language: 'auto',
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
        
        // 构建Monica风格的总结提示词（突出人物和事件）
        const prompt = `请以第三人称视角总结这封邮件，重点突出人物和具体事件：

格式要求：
1. 开头说明：[发件人姓名]向你发送了邮件
2. 核心事件：用1-2句话说明发生了什么事情，重要信息用**粗体**标记
3. 具体内容：如有重要细节、时间、地点、要求等，用要点列出
4. 语言自然流畅，就像朋友在向你转述邮件内容

邮件内容：
${emailContent}

请用简洁自然的中文表达：`;

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
        
        // 构建优化提示词
        const prompt = `请优化以下文本，使其更加专业、清晰、礼貌。保持原意不变，但改进语言表达：

原文本：
${text}

请提供优化后的版本：`;

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
 * 处理回复优化请求
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
        
        // 根据风格设置不同的优化提示
        const stylePrompts = {
            professional: '专业、正式的商务风格',
            friendly: '友好、亲切的风格',
            concise: '简洁、直接的风格',
            detailed: '详细、全面的风格'
        };
        
        const styleDescription = stylePrompts[style] || stylePrompts.professional;
        
        let prompt = `请帮我优化以下邮件回复，使其更加${styleDescription}。要求：

1. 保持原意不变
2. 改善语言表达和语法
3. 使语气更加得体和专业
4. 确保逻辑清晰、条理分明
5. 适当调整格式和结构`;

        // 如果有邮件上下文，加入上下文信息
        if (emailContext && emailContext.trim()) {
            prompt += `

原邮件内容：
${emailContext}

---`;
        }

        prompt += `

我的回复草稿：
${userReply}

请提供优化后的回复：`;
        
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
        
        // 构建Monica风格的总结提示词（突出人物和事件）
        const prompt = `请以第三人称视角总结这封邮件，重点突出人物和具体事件：

格式要求：
1. 开头说明：[发件人姓名]向你发送了邮件
2. 核心事件：用1-2句话说明发生了什么事情，重要信息用**粗体**标记
3. 具体内容：如有重要细节、时间、地点、要求等，用要点列出
4. 语言自然流畅，就像朋友在向你转述邮件内容

邮件内容：
${emailContent}

请用简洁自然的中文表达：`;

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
        const { userReply, emailContext, style = 'professional' } = data;
        
        if (!userReply || userReply.trim() === '') {
            throw new Error('没有提供要优化的回复内容');
        }
        
        console.log('开始优化用户回复（流式）...');
        console.log('用户回复:', userReply);
        console.log('邮件上下文长度:', emailContext ? emailContext.length : 0);
        
        // 根据风格设置不同的优化提示
        const stylePrompts = {
            professional: '专业、正式的商务风格',
            friendly: '友好、亲切的风格',
            concise: '简洁、直接的风格',
            detailed: '详细、全面的风格'
        };
        
        const styleDescription = stylePrompts[style] || stylePrompts.professional;
        
        let prompt = `请帮我优化以下邮件回复，使其更加${styleDescription}。要求：

1. 保持原意不变，但改善表达方式
2. 使用更专业和得体的语言
3. 确保语法正确，逻辑清晰
4. 适当调整语气和格式
5. 让回复更加有条理和易读`;

        // 如果有邮件上下文，加入上下文信息
        if (emailContext && emailContext.trim()) {
            prompt += `

原邮件内容：
${emailContext}

---`;
        }

        prompt += `

我的回复草稿：
${userReply}

请提供优化后的回复（直接输出优化后的内容，不需要额外说明）：`;
        
        const optimizedReply = await callAIAPI(prompt);
        
        console.log('回复优化成功（流式）');
        
        return optimizedReply;
    } catch (error) {
        console.error('回复优化失败（流式）:', error);
        throw error;
    }
} 
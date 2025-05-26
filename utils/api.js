/**
 * Gmail AI回复助手 - API工具类
 * 支持流式响应的DeepSeek-V3 API调用
 */

// API配置
const API_CONFIG = {
    baseURL: 'https://api.ap.siliconflow.com/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-V3',
    defaultApiKey: 'sk-moyezvpaajlpslwhpieojhplhxafpyhgpoiueqlqcatjpbqt'
};

/**
 * 流式调用AI API
 * @param {string} prompt - 提示词
 * @param {function} onChunk - 接收每个数据块的回调函数
 * @param {function} onComplete - 完成时的回调函数
 * @param {function} onError - 错误时的回调函数
 */
async function callAIStream(prompt, onChunk, onComplete, onError) {
    try {
        console.log('开始流式AI调用:', prompt.substring(0, 100) + '...');
        
        // 获取API Key
        const result = await chrome.storage.sync.get(['apiKey']);
        const apiKey = result.apiKey || API_CONFIG.defaultApiKey;
        
        // 构建请求
        const response = await fetch(API_CONFIG.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                stream: true, // 启用流式响应
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('流式响应完成');
                onComplete(fullContent);
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
                            // 实时回调每个内容块
                            onChunk(content, fullContent);
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理下一行
                        console.log('解析数据块时出错:', e.message);
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('流式AI调用失败:', error);
        onError(error);
    }
}

/**
 * 普通AI调用（非流式）- 保持兼容性
 */
async function callAI(prompt) {
    return new Promise((resolve, reject) => {
        let fullContent = '';
        
        callAIStream(
            prompt,
            (chunk, content) => {
                fullContent = content;
            },
            (finalContent) => {
                resolve(finalContent);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

/**
 * 生成邮件回复（流式）
 */
function generateReplyStream(emailContent, style, onChunk, onComplete, onError) {
    const stylePrompts = {
        formal: '请用正式、商务的语气回复',
        friendly: '请用友好、亲切的语气回复',
        concise: '请用简洁、直接的方式回复',
        detailed: '请用详细、全面的方式回复'
    };
    
    const prompt = `${stylePrompts[style] || stylePrompts.friendly}以下邮件：

邮件内容：
${emailContent}

请生成一个合适的回复，要求：
1. 语气符合${style}风格
2. 内容相关且有帮助
3. 格式规范
4. 直接给出回复内容，不要额外说明`;

    callAIStream(prompt, onChunk, onComplete, onError);
}

/**
 * 生成邮件总结（流式）
 */
function generateSummaryStream(emailContent, onChunk, onComplete, onError) {
    const prompt = `请总结以下邮件的主要内容：

邮件内容：
${emailContent}

请提供：
1. 主要议题
2. 关键信息
3. 需要回应的要点
4. 建议的行动项

请用简洁明了的方式总结：`;

    callAIStream(prompt, onChunk, onComplete, onError);
}

/**
 * 优化文本（流式）
 */
function optimizeTextStream(text, onChunk, onComplete, onError) {
    const prompt = `请优化以下文本，使其更加专业、清晰和有效：

原文本：
${text}

请提供优化后的版本，要求：
1. 保持原意不变
2. 提高表达的专业性
3. 增强可读性
4. 修正语法错误（如有）

优化后的文本：`;

    callAIStream(prompt, onChunk, onComplete, onError);
}

/**
 * 翻译文本（流式）
 */
function translateTextStream(text, targetLang, onChunk, onComplete, onError) {
    const langMap = {
        'en': '英语',
        'zh': '中文',
        'ja': '日语',
        'ko': '韩语',
        'fr': '法语',
        'de': '德语',
        'es': '西班牙语'
    };
    
    const targetLanguage = langMap[targetLang] || '英语';
    
    const prompt = `请将以下文本翻译成${targetLanguage}：

原文：
${text}

翻译要求：
1. 准确传达原意
2. 符合目标语言的表达习惯
3. 保持专业性和礼貌性

翻译结果：`;

    callAIStream(prompt, onChunk, onComplete, onError);
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        callAI,
        callAIStream,
        generateReplyStream,
        generateSummaryStream,
        optimizeTextStream,
        translateTextStream
    };
}
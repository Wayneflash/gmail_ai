/**
 * Gmail AI回复助手 - 测试版内容脚本
 * 简化版本用于调试
 */

console.log('Gmail AI回复助手测试版已加载');

// 等待页面完全加载
function waitForGmail() {
    console.log('等待Gmail加载...');
    
    // 检查是否在Gmail页面
    if (!window.location.href.includes('mail.google.com')) {
        console.log('不在Gmail页面');
        return;
    }
    
    console.log('在Gmail页面，开始初始化');
    
    // 延迟初始化，确保Gmail完全加载
    setTimeout(() => {
        initializeAI();
        startObserver();
    }, 3000);
}

/**
 * 初始化AI功能
 */
function initializeAI() {
    console.log('开始初始化AI功能');
    
    // 立即检查一次
    findAndEnhanceInputs();
    
    // 定期检查
    setInterval(findAndEnhanceInputs, 2000);
}

/**
 * 查找并增强输入框
 */
function findAndEnhanceInputs() {
    console.log('正在查找输入框...');
    
    // 更广泛的选择器
    const selectors = [
        '[contenteditable="true"]',
        '[role="textbox"]',
        '.Am.Al.editable',
        'div[contenteditable="true"]'
    ];
    
    let found = 0;
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`选择器 ${selector} 找到 ${elements.length} 个元素`);
        
        elements.forEach((element, index) => {
            if (isValidInput(element) && !element.hasAttribute('data-ai-test')) {
                console.log(`增强输入框 ${index + 1}:`, element);
                addTestButton(element);
                element.setAttribute('data-ai-test', 'true');
                found++;
            }
        });
    });
    
    console.log(`总共增强了 ${found} 个输入框`);
}

/**
 * 验证是否是有效的输入框
 */
function isValidInput(element) {
    // 检查是否可见
    const rect = element.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 20) {
        return false;
    }
    
    // 排除搜索框
    if (element.closest('.gb_g') || element.closest('#gs_lc0')) {
        return false;
    }
    
    // 检查是否在主要内容区域
    const isInMain = element.closest('[role="main"]') || 
                    element.closest('.nH') || 
                    element.closest('.aAy');
    
    return !!isInMain;
}

/**
 * 添加测试按钮
 */
function addTestButton(inputElement) {
    try {
        // 创建按钮容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            display: inline-block;
            margin: 5px 0;
        `;
        
        // 创建测试按钮
        const button = document.createElement('button');
        button.textContent = '🤖 AI测试';
        button.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            margin: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        `;
        
        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });
        
        // 点击事件
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('AI测试按钮被点击');
            showTestPanel(inputElement);
        });
        
        container.appendChild(button);
        
        // 插入按钮
        const parent = inputElement.parentElement;
        if (parent) {
            parent.insertBefore(container, inputElement.nextSibling);
            console.log('测试按钮已添加');
        }
        
    } catch (error) {
        console.error('添加测试按钮失败:', error);
    }
}

/**
 * 显示测试面板
 */
function showTestPanel(inputElement) {
    // 移除旧面板
    const oldPanel = document.getElementById('ai-test-panel');
    if (oldPanel) {
        oldPanel.remove();
    }
    
    // 创建测试面板
    const panel = document.createElement('div');
    panel.id = 'ai-test-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 300px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 10000;
        padding: 20px;
        font-family: Arial, sans-serif;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; color: #333;">AI测试面板</h3>
            <button id="close-panel" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <button id="test-api-direct" style="width: 100%; padding: 10px; margin: 5px 0; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">🔧 测试DeepSeek-V3</button>
            <button id="test-api-chat" style="width: 100%; padding: 10px; margin: 5px 0; background: #673AB7; color: white; border: none; border-radius: 4px; cursor: pointer;">💬 测试DeepSeek-Chat</button>
            <button id="test-api-qwen" style="width: 100%; padding: 10px; margin: 5px 0; background: #3F51B5; color: white; border: none; border-radius: 4px; cursor: pointer;">🤖 测试Qwen2.5</button>
            <button id="test-summary" style="width: 100%; padding: 10px; margin: 5px 0; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">📄 测试邮件总结</button>
            <button id="test-reply" style="width: 100%; padding: 10px; margin: 5px 0; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">💬 测试智能回复</button>
            <button id="test-optimize" style="width: 100%; padding: 10px; margin: 5px 0; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">✨ 测试文本优化</button>
        </div>
        
        <div id="test-result" style="background: #f5f5f5; padding: 10px; border-radius: 4px; min-height: 50px; font-size: 12px;">
            点击上方按钮测试AI功能
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 绑定事件
    document.getElementById('close-panel').addEventListener('click', () => {
        panel.remove();
    });
    
    document.getElementById('test-api-direct').addEventListener('click', () => {
        testDirectAPI();
    });
    
    document.getElementById('test-api-chat').addEventListener('click', () => {
        testAIFunction('chat', inputElement);
    });
    
    document.getElementById('test-api-qwen').addEventListener('click', () => {
        testAIFunction('qwen', inputElement);
    });
    
    document.getElementById('test-summary').addEventListener('click', () => {
        testAIFunction('summary', inputElement);
    });
    
    document.getElementById('test-reply').addEventListener('click', () => {
        testAIFunction('reply', inputElement);
    });
    
    document.getElementById('test-optimize').addEventListener('click', () => {
        testAIFunction('optimize', inputElement);
    });
    
    console.log('测试面板已显示');
}

/**
 * 直接测试API调用
 */
async function testDirectAPI() {
    const resultDiv = document.getElementById('test-result');
    resultDiv.innerHTML = '<div style="color: blue;">🔄 直接测试API调用...</div>';
    
    try {
        console.log('开始直接API测试');
        
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'testAPI' }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
        
        console.log('直接API测试响应:', response);
        
        if (response && response.success) {
            resultDiv.innerHTML = `
                <div style="color: green; font-weight: bold;">✅ 直接API测试成功!</div>
                <div style="margin-top: 10px; padding: 10px; background: #e8f5e8; border-radius: 4px; font-size: 11px;">
                    ${response.data.replace(/\n/g, '<br>')}
                </div>
            `;
        } else {
            const errorMsg = response ? response.error : '未知错误';
            resultDiv.innerHTML = `
                <div style="color: red; font-weight: bold;">❌ 直接API测试失败</div>
                <div style="margin-top: 10px; padding: 10px; background: #ffe8e8; border-radius: 4px; font-size: 11px;">
                    错误信息: ${errorMsg}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('直接API测试失败:', error);
        resultDiv.innerHTML = `
            <div style="color: red; font-weight: bold;">❌ 直接API测试错误</div>
            <div style="margin-top: 10px; padding: 10px; background: #ffe8e8; border-radius: 4px; font-size: 11px;">
                错误详情: ${error.message}
            </div>
        `;
    }
}

/**
 * 测试AI功能
 */
async function testAIFunction(type, inputElement) {
    const resultDiv = document.getElementById('test-result');
    resultDiv.innerHTML = '<div style="color: blue;">🔄 正在测试...</div>';
    
    try {
        let testData = {};
        
        switch (type) {
            case 'chat':
                testData = {
                    action: 'testModel',
                    data: { 
                        model: 'deepseek-ai/deepseek-chat',
                        prompt: '你好，请简单介绍一下你自己。'
                    }
                };
                break;
                
            case 'qwen':
                testData = {
                    action: 'testModel',
                    data: { 
                        model: 'Qwen/Qwen2.5-72B-Instruct',
                        prompt: '你好，请简单介绍一下你自己。'
                    }
                };
                break;
                
            case 'summary':
                testData = {
                    action: 'generateSummary',
                    data: { emailContent: '这是一封测试邮件，用于验证AI总结功能是否正常工作。邮件内容包含了一些重要信息，需要AI进行总结和分析。' }
                };
                break;
                
            case 'reply':
                testData = {
                    action: 'generateReply',
                    data: { 
                        emailContent: '您好，我想了解一下关于项目进展的情况，请问能否提供一些更新信息？谢谢！', 
                        style: 'friendly' 
                    }
                };
                break;
                
            case 'optimize':
                const textContent = inputElement.innerText || inputElement.textContent || '这是一段测试文本，用于验证AI优化功能是否能够正常工作。';
                testData = {
                    action: 'optimizeText',
                    data: { text: textContent }
                };
                break;
        }
        
        console.log('发送测试请求:', testData);
        resultDiv.innerHTML = '<div style="color: orange;">📡 正在发送请求到后台脚本...</div>';
        
        // 使用Promise包装sendMessage
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(testData, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
        
        console.log('收到测试响应:', response);
        
        if (response && response.success) {
            resultDiv.innerHTML = `
                <div style="color: green; font-weight: bold;">✅ 测试成功!</div>
                <div style="margin-top: 10px; padding: 10px; background: #e8f5e8; border-radius: 4px; font-size: 11px;">
                    ${response.data.replace(/\n/g, '<br>')}
                </div>
            `;
        } else {
            const errorMsg = response ? response.error : '未知错误';
            resultDiv.innerHTML = `
                <div style="color: red; font-weight: bold;">❌ 测试失败</div>
                <div style="margin-top: 10px; padding: 10px; background: #ffe8e8; border-radius: 4px; font-size: 11px;">
                    错误信息: ${errorMsg}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('测试失败:', error);
        resultDiv.innerHTML = `
            <div style="color: red; font-weight: bold;">❌ 测试错误</div>
            <div style="margin-top: 10px; padding: 10px; background: #ffe8e8; border-radius: 4px; font-size: 11px;">
                错误详情: ${error.message}<br>
                <small>请检查扩展是否正确加载，或查看控制台获取更多信息</small>
            </div>
        `;
    }
}

/**
 * 设置观察器
 */
function startObserver() {
    console.log('启动DOM观察器');
    
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector && (
                            node.querySelector('[contenteditable="true"]') ||
                            node.querySelector('[role="textbox"]')
                        )) {
                            shouldCheck = true;
                            break;
                        }
                    }
                }
            }
        });
        
        if (shouldCheck) {
            console.log('检测到新的输入框，重新扫描');
            setTimeout(findAndEnhanceInputs, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForGmail);
} else {
    waitForGmail();
}

// 监听URL变化（Gmail是SPA）
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log('URL变化，重新初始化:', url);
        setTimeout(waitForGmail, 1000);
    }
}).observe(document, { subtree: true, childList: true });

console.log('Gmail AI回复助手测试版脚本加载完成'); 
// Gmail AI回复助手 - 弹出窗口脚本
let elements = {};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('弹出窗口正在初始化...');
    
    initializeElements();
    bindEventListeners();
    await checkConfigurationStatus();
    await checkApiStatus();
    await checkPageStatus();
    await loadUsageStats();
    await loadUserSettings();
    
    console.log('弹出窗口初始化完成');
});

function initializeElements() {
    elements = {
        configStatus: document.getElementById('configStatus'),
        apiStatus: document.getElementById('apiStatus'),
        pageStatus: document.getElementById('pageStatus'),
        openGmail: document.getElementById('openGmail'),
        openSettings: document.getElementById('openSettings'),
        totalReplies: document.getElementById('totalReplies'),
        todayReplies: document.getElementById('todayReplies'),
        defaultStyle: document.getElementById('defaultStyle'),
        helpLink: document.getElementById('helpLink'),
        feedbackLink: document.getElementById('feedbackLink'),
        configMessage: document.getElementById('configMessage')
    };
}

function bindEventListeners() {
    elements.openGmail.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://mail.google.com' });
        window.close();
    });
    
    elements.openSettings.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
        window.close();
    });
    
    elements.defaultStyle.addEventListener('change', async (e) => {
        await saveDefaultStyle(e.target.value);
    });
}

/**
 * 检查配置状态 - 新增功能
 * 显示自动配置完成的友好信息
 */
async function checkConfigurationStatus() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
        
        if (response.success) {
            const config = response.data;
            
            if (config.isConfigured && config.apiKey) {
                // 已自动配置完成
                if (elements.configStatus) {
                    const indicator = elements.configStatus.querySelector('.status-indicator');
                    const text = elements.configStatus.querySelector('.status-text');
                    indicator.className = 'status-indicator';
                    text.textContent = '已自动配置';
                }
                
                if (elements.configMessage) {
                    elements.configMessage.innerHTML = `
                        <div class="config-success">
                            <span class="success-icon">✅</span>
                            <div class="success-text">
                                <strong>配置完成！</strong><br>
                                已自动配置DeepSeek-V3模型，可直接在Gmail中使用AI回复功能。
                            </div>
                        </div>
                    `;
                }
                
                // 修改设置按钮文字
                if (elements.openSettings) {
                    elements.openSettings.textContent = '高级设置';
                    elements.openSettings.title = '打开高级设置页面（可选）';
                }
                
            } else {
                // 未配置，显示需要设置的信息
                if (elements.configStatus) {
                    const indicator = elements.configStatus.querySelector('.status-indicator');
                    const text = elements.configStatus.querySelector('.status-text');
                    indicator.className = 'status-indicator error';
                    text.textContent = '需要配置';
                }
                
                if (elements.configMessage) {
                    elements.configMessage.innerHTML = `
                        <div class="config-needed">
                            <span class="warning-icon">⚠️</span>
                            <div class="warning-text">
                                <strong>需要配置</strong><br>
                                请点击下方"打开设置"按钮配置API密钥。
                            </div>
                        </div>
                    `;
                }
            }
        }
        
    } catch (error) {
        console.error('检查配置状态失败:', error);
        if (elements.configStatus) {
            const indicator = elements.configStatus.querySelector('.status-indicator');
            const text = elements.configStatus.querySelector('.status-text');
            indicator.className = 'status-indicator error';
            text.textContent = '检查失败';
        }
    }
}

async function checkApiStatus() {
    try {
        const indicator = elements.apiStatus.querySelector('.status-indicator');
        const text = elements.apiStatus.querySelector('.status-text');
        
        const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
        
        if (!response.success) {
            throw new Error(response.error);
        }
        
        const config = response.data;
        
        if (!config.apiKey) {
            indicator.className = 'status-indicator error';
            text.textContent = '未配置';
            return;
        }
        
        // 显示当前使用的模型
        text.textContent = `${config.model || 'DeepSeek-V3'} - 检测中...`;
        
        const testResponse = await chrome.runtime.sendMessage({
            action: 'testConnection',
            data: { apiKey: config.apiKey }
        });
        
        if (testResponse.success && testResponse.data.connected) {
            indicator.className = 'status-indicator';
            text.textContent = `${config.model || 'DeepSeek-V3'} - 正常`;
        } else {
            indicator.className = 'status-indicator error';
            text.textContent = `${config.model || 'DeepSeek-V3'} - 连接失败`;
        }
        
    } catch (error) {
        console.error('检查API状态失败:', error);
        const indicator = elements.apiStatus.querySelector('.status-indicator');
        const text = elements.apiStatus.querySelector('.status-text');
        indicator.className = 'status-indicator error';
        text.textContent = '检查失败';
    }
}

async function checkPageStatus() {
    try {
        const indicator = elements.pageStatus.querySelector('.status-indicator');
        const text = elements.pageStatus.querySelector('.status-text');
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.url && tab.url.includes('mail.google.com')) {
            indicator.className = 'status-indicator';
            text.textContent = 'Gmail页面';
        } else {
            indicator.className = 'status-indicator offline';
            text.textContent = '非Gmail页面';
        }
        
    } catch (error) {
        console.error('检查页面状态失败:', error);
        const indicator = elements.pageStatus.querySelector('.status-indicator');
        const text = elements.pageStatus.querySelector('.status-text');
        indicator.className = 'status-indicator error';
        text.textContent = '检查失败';
    }
}

async function loadUsageStats() {
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
            await chrome.storage.local.set({ usageStats: stats });
        }
        
        elements.totalReplies.textContent = stats.totalReplies.toLocaleString();
        elements.todayReplies.textContent = stats.todayReplies.toLocaleString();
        
    } catch (error) {
        console.error('加载使用统计失败:', error);
        elements.totalReplies.textContent = '0';
        elements.todayReplies.textContent = '0';
    }
}

async function loadUserSettings() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
        
        if (response.success) {
            const config = response.data;
            
            if (config.defaultStyle) {
                elements.defaultStyle.value = config.defaultStyle;
            }
        }
        
    } catch (error) {
        console.error('加载用户设置失败:', error);
    }
}

async function saveDefaultStyle(style) {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
        
        if (response.success) {
            const config = response.data;
            config.defaultStyle = style;
            
            const saveResponse = await chrome.runtime.sendMessage({
                action: 'saveConfig',
                data: config
            });
            
            if (saveResponse.success) {
                console.log('默认回复风格已保存');
            } else {
                throw new Error(saveResponse.error);
            }
        }
        
    } catch (error) {
        console.error('保存默认风格失败:', error);
    }
} 
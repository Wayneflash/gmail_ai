/**
 * Gmail AI回复助手 - 设置页面脚本
 * 处理用户设置的保存、加载和验证
 */

// 默认配置
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
    retryCount: 2
};

// 页面元素
let elements = {};

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('设置页面初始化开始');
    
    // 获取页面元素
    initializeElements();
    
    // 加载保存的设置
    loadSettings();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 加载统计数据
    loadStatistics();
    
    console.log('设置页面初始化完成');
});

/**
 * 初始化页面元素引用
 */
function initializeElements() {
    elements = {
        // API配置
        apiKey: document.getElementById('apiKey'),
        toggleApiKey: document.getElementById('toggleApiKey'),
        model: document.getElementById('model'),
        maxTokens: document.getElementById('maxTokens'),
        temperature: document.getElementById('temperature'),
        temperatureValue: document.getElementById('temperatureValue'),
        testConnectionBtn: document.getElementById('testConnectionBtn'),
        connectionStatus: document.getElementById('connectionStatus'),
        
        // 回复设置
        defaultStyle: document.getElementById('defaultStyle'),
        autoGenerate: document.getElementById('autoGenerate'),
        showNotifications: document.getElementById('showNotifications'),
        saveHistory: document.getElementById('saveHistory'),
        replyCount: document.getElementById('replyCount'),
        
        // 高级设置
        customPrompt: document.getElementById('customPrompt'),
        language: document.getElementById('language'),
        timeout: document.getElementById('timeout'),
        retryCount: document.getElementById('retryCount'),
        
        // 数据管理
        totalRepliesCount: document.getElementById('totalRepliesCount'),
        todayRepliesCount: document.getElementById('todayRepliesCount'),
        avgResponseTime: document.getElementById('avgResponseTime'),
        exportDataBtn: document.getElementById('exportDataBtn'),
        importDataBtn: document.getElementById('importDataBtn'),
        clearDataBtn: document.getElementById('clearDataBtn'),
        importFileInput: document.getElementById('importFileInput'),
        
        // 通用按钮
        saveAllBtn: document.getElementById('saveAllBtn'),
        
        // 关于链接
        helpLink: document.getElementById('helpLink'),
        feedbackLink: document.getElementById('feedbackLink'),
        updateLink: document.getElementById('updateLink'),
        
        // 通知容器
        notificationContainer: document.getElementById('notificationContainer')
    };
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // API密钥显示/隐藏切换
    if (elements.toggleApiKey) {
        elements.toggleApiKey.addEventListener('click', toggleApiKeyVisibility);
    }
    
    // 温度滑块值更新
    if (elements.temperature) {
        elements.temperature.addEventListener('input', updateTemperatureValue);
    }
    
    // 测试API连接
    if (elements.testConnectionBtn) {
        elements.testConnectionBtn.addEventListener('click', testApiConnection);
    }
    
    // 保存所有设置
    if (elements.saveAllBtn) {
        elements.saveAllBtn.addEventListener('click', saveAllSettings);
    }
    
    // 数据管理按钮
    if (elements.exportDataBtn) {
        elements.exportDataBtn.addEventListener('click', exportData);
    }
    if (elements.importDataBtn) {
        elements.importDataBtn.addEventListener('click', () => elements.importFileInput.click());
    }
    if (elements.importFileInput) {
        elements.importFileInput.addEventListener('change', importData);
    }
    if (elements.clearDataBtn) {
        elements.clearDataBtn.addEventListener('click', clearAllData);
    }
    
    // 关于链接
    if (elements.helpLink) {
        elements.helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('帮助文档功能即将推出', 'info');
        });
    }
    if (elements.feedbackLink) {
        elements.feedbackLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('意见反馈功能即将推出', 'info');
        });
    }
    if (elements.updateLink) {
        elements.updateLink.addEventListener('click', (e) => {
            e.preventDefault();
            checkForUpdates();
        });
    }
    
    // 自动保存设置（当用户修改时）
    bindAutoSaveListeners();
}

/**
 * 绑定自动保存监听器
 */
function bindAutoSaveListeners() {
    const autoSaveElements = [
        'apiKey', 'model', 'maxTokens', 'temperature', 'defaultStyle',
        'autoGenerate', 'showNotifications', 'saveHistory', 'replyCount',
        'customPrompt', 'language', 'timeout', 'retryCount'
    ];
    
    autoSaveElements.forEach(elementId => {
        const element = elements[elementId];
        if (element) {
            if (element.type === 'checkbox') {
                element.addEventListener('change', debounce(saveAllSettings, 1000));
            } else {
                element.addEventListener('input', debounce(saveAllSettings, 1000));
            }
        }
    });
}

/**
 * 加载保存的设置
 */
async function loadSettings() {
    try {
        const result = await chrome.storage.sync.get(DEFAULT_CONFIG);
        
        // 填充表单字段
        Object.keys(DEFAULT_CONFIG).forEach(key => {
            const element = elements[key];
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = result[key];
                } else {
                    element.value = result[key];
                }
            }
        });
        
        // 更新温度显示值
        updateTemperatureValue();
        
        console.log('设置加载完成:', result);
    } catch (error) {
        console.error('加载设置失败:', error);
        showNotification('加载设置失败', 'error');
    }
}

/**
 * 保存所有设置
 */
async function saveAllSettings() {
    try {
        const settings = {};
        
        // 收集所有设置值
        Object.keys(DEFAULT_CONFIG).forEach(key => {
            const element = elements[key];
            if (element) {
                if (element.type === 'checkbox') {
                    settings[key] = element.checked;
                } else if (element.type === 'number') {
                    settings[key] = parseInt(element.value) || DEFAULT_CONFIG[key];
                } else if (element.type === 'range') {
                    settings[key] = parseFloat(element.value) || DEFAULT_CONFIG[key];
                } else {
                    settings[key] = element.value || DEFAULT_CONFIG[key];
                }
            }
        });
        
        // 保存到Chrome存储
        await chrome.storage.sync.set(settings);
        
        console.log('设置保存成功:', settings);
        showNotification('设置保存成功', 'success');
        
        // 通知background script设置已更新
        chrome.runtime.sendMessage({
            action: 'settingsUpdated',
            settings: settings
        });
        
    } catch (error) {
        console.error('保存设置失败:', error);
        showNotification('保存设置失败', 'error');
    }
}

/**
 * 切换API密钥显示/隐藏
 */
function toggleApiKeyVisibility() {
    const apiKeyInput = elements.apiKey;
    const toggleBtn = elements.toggleApiKey;
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    } else {
        apiKeyInput.type = 'password';
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    }
}

/**
 * 更新温度滑块显示值
 */
function updateTemperatureValue() {
    if (elements.temperature && elements.temperatureValue) {
        elements.temperatureValue.textContent = elements.temperature.value;
    }
}

/**
 * 测试API连接
 */
async function testApiConnection() {
    const testBtn = elements.testConnectionBtn;
    const statusDiv = elements.connectionStatus;
    
    // 显示加载状态
    testBtn.disabled = true;
    testBtn.textContent = '测试中...';
    statusDiv.className = 'status-indicator loading';
    statusDiv.textContent = '正在测试API连接...';
    
    try {
        const apiKey = elements.apiKey.value || DEFAULT_CONFIG.apiKey;
        const model = elements.model.value || DEFAULT_CONFIG.model;
        
        // 发送测试请求到background script
        const response = await chrome.runtime.sendMessage({
            action: 'testApiConnection',
            apiKey: apiKey,
            model: model
        });
        
        if (response.success) {
            statusDiv.className = 'status-indicator success';
            statusDiv.textContent = '✓ API连接成功';
            showNotification('API连接测试成功', 'success');
        } else {
            statusDiv.className = 'status-indicator error';
            statusDiv.textContent = '✗ 连接失败: ' + (response.error || '未知错误');
            showNotification('API连接测试失败: ' + (response.error || '未知错误'), 'error');
        }
    } catch (error) {
        console.error('API测试失败:', error);
        statusDiv.className = 'status-indicator error';
        statusDiv.textContent = '✗ 测试失败: ' + error.message;
        showNotification('API连接测试失败', 'error');
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = '测试连接';
        
        // 5秒后隐藏状态
        setTimeout(() => {
            statusDiv.className = 'status-indicator';
            statusDiv.textContent = '';
        }, 5000);
    }
}

/**
 * 加载统计数据
 */
async function loadStatistics() {
    try {
        const stats = await chrome.storage.local.get(['totalReplies', 'todayReplies', 'responseTimeHistory']);
        
        // 更新总回复数
        if (elements.totalRepliesCount) {
            elements.totalRepliesCount.textContent = stats.totalReplies || 0;
        }
        
        // 更新今日回复数
        if (elements.todayRepliesCount) {
            const today = new Date().toDateString();
            const todayReplies = stats.todayReplies || {};
            elements.todayRepliesCount.textContent = todayReplies[today] || 0;
        }
        
        // 计算平均响应时间
        if (elements.avgResponseTime) {
            const responseTimeHistory = stats.responseTimeHistory || [];
            if (responseTimeHistory.length > 0) {
                const avgTime = responseTimeHistory.reduce((sum, time) => sum + time, 0) / responseTimeHistory.length;
                elements.avgResponseTime.textContent = Math.round(avgTime) + 'ms';
            } else {
                elements.avgResponseTime.textContent = '0ms';
            }
        }
        
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

/**
 * 导出数据
 */
async function exportData() {
    try {
        // 获取所有数据
        const syncData = await chrome.storage.sync.get();
        const localData = await chrome.storage.local.get();
        
        const exportData = {
            settings: syncData,
            statistics: localData,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        // 创建下载链接
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gmail-ai-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('数据导出成功', 'success');
    } catch (error) {
        console.error('导出数据失败:', error);
        showNotification('导出数据失败', 'error');
    }
}

/**
 * 导入数据
 */
async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const text = await file.text();
        const importData = JSON.parse(text);
        
        // 验证数据格式
        if (!importData.settings || !importData.statistics) {
            throw new Error('无效的备份文件格式');
        }
        
        // 确认导入
        if (!confirm('导入数据将覆盖当前设置，是否继续？')) {
            return;
        }
        
        // 导入设置
        await chrome.storage.sync.set(importData.settings);
        await chrome.storage.local.set(importData.statistics);
        
        // 重新加载页面数据
        await loadSettings();
        await loadStatistics();
        
        showNotification('数据导入成功', 'success');
    } catch (error) {
        console.error('导入数据失败:', error);
        showNotification('导入数据失败: ' + error.message, 'error');
    } finally {
        // 清空文件输入
        event.target.value = '';
    }
}

/**
 * 清除所有数据
 */
async function clearAllData() {
    if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        return;
    }
    
    if (!confirm('再次确认：这将删除所有设置和统计数据！')) {
        return;
    }
    
    try {
        await chrome.storage.sync.clear();
        await chrome.storage.local.clear();
        
        // 重新加载默认设置
        await chrome.storage.sync.set(DEFAULT_CONFIG);
        await loadSettings();
        await loadStatistics();
        
        showNotification('所有数据已清除', 'success');
    } catch (error) {
        console.error('清除数据失败:', error);
        showNotification('清除数据失败', 'error');
    }
}

/**
 * 检查更新
 */
function checkForUpdates() {
    showNotification('当前版本: v1.0.0 (最新版本)', 'info');
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notificationContainer.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 监听来自background script的消息
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'statisticsUpdated') {
        loadStatistics();
    }
});

// 导出函数供其他脚本使用
window.OptionsPage = {
    loadSettings,
    saveAllSettings,
    showNotification
}; 
/**
 * Gmail AI回复助手 - Popup脚本
 * 新版AI助手风格界面
 */

// 全局变量
let currentLanguage = 'en';
let currentConfig = null;

// 多语言配置
const POPUP_LANGUAGE_CONFIG = {
    en: {
        title: "AI Assistant",
        statusChecking: "Checking status...",
        statusReady: "Ready to use",
        statusError: "Configuration needed",
        openGmail: "Open Gmail",
        advancedSettings: "Advanced Settings",
        smartSummary: "Smart Email Summary",
        smartSummaryDesc: "Automatically analyze email content and extract key information",
        aiReplyOptimization: "AI Reply Optimization", 
        aiReplyOptimizationDesc: "Input your reply ideas, AI helps optimize expression",
        multiLanguageSupport: "Multi-language Support",
        multiLanguageSupportDesc: "Support Chinese-English switching, intelligent language recognition",
        usageGuide: "How to Use",
        step1: "Open Gmail email page",
        step2: "Click 'Gmail AI' button below reply box",
        step3: "View email summary, input reply ideas",
        step4: "AI optimizes and inserts into email with one click",
        totalReplies: "Total Replies",
        todayUsage: "Today's Usage",
        languageSwitch: "🌐 中文"
    },
    zh: {
        title: "AI回复助手",
        statusChecking: "检查状态中...",
        statusReady: "准备就绪",
        statusError: "需要配置",
        openGmail: "打开Gmail",
        advancedSettings: "高级设置",
        smartSummary: "智能邮件总结",
        smartSummaryDesc: "自动分析邮件内容，提取关键信息",
        aiReplyOptimization: "AI回复优化",
        aiReplyOptimizationDesc: "输入回复想法，AI帮您优化表达",
        multiLanguageSupport: "多语言支持",
        multiLanguageSupportDesc: "支持中英文切换，智能语言识别",
        usageGuide: "使用方法",
        step1: "打开Gmail邮件页面",
        step2: "点击回复框下方的'Gmail AI'按钮",
        step3: "查看邮件总结，输入回复想法",
        step4: "AI优化后一键插入到邮件中",
        totalReplies: "总回复数",
        todayUsage: "今日使用",
        languageSwitch: "🌐 English"
    }
};

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Popup页面初始化...');
    
    try {
        // 获取当前语言配置
        await getCurrentLanguageConfig();
        
        // 更新界面语言
        updateUILanguage();
        
        // 检查扩展状态
        await checkExtensionStatus();
        
        // 加载使用统计
        await loadUsageStats();
        
        // 绑定事件监听器
        bindEventListeners();
        
        console.log('Popup页面初始化完成');
        
    } catch (error) {
        console.error('Popup初始化失败:', error);
        showErrorStatus('初始化失败');
    }
});

/**
 * 获取当前语言配置
 */
async function getCurrentLanguageConfig() {
    try {
        const response = await chrome.runtime.sendMessage({
            action: 'getLanguageConfig'
        });
        
        if (response && response.success) {
            currentLanguage = response.data.lang;
            console.log('当前语言:', currentLanguage);
        } else {
            console.log('使用默认语言: en');
            currentLanguage = 'en';
        }
    } catch (error) {
        console.error('获取语言配置失败:', error);
        currentLanguage = 'en';
    }
}

/**
 * 更新界面语言
 */
function updateUILanguage() {
    const config = POPUP_LANGUAGE_CONFIG[currentLanguage];
    
    // 更新标题
    const title = document.querySelector('.popup-title');
    if (title) title.textContent = config.title;
    
    // 更新语言切换按钮
    const languageToggle = document.querySelector('.language-text');
    if (languageToggle) languageToggle.textContent = config.languageSwitch;
    
    // 更新按钮文本
    const openGmailBtn = document.querySelector('#openGmail span');
    if (openGmailBtn) openGmailBtn.textContent = config.openGmail;
    
    const settingsBtn = document.querySelector('#openSettings span');
    if (settingsBtn) settingsBtn.textContent = config.advancedSettings;
    
    // 更新功能介绍
    const introItems = document.querySelectorAll('.intro-content');
    if (introItems.length >= 3) {
        introItems[0].querySelector('h3').textContent = config.smartSummary;
        introItems[0].querySelector('p').textContent = config.smartSummaryDesc;
        
        introItems[1].querySelector('h3').textContent = config.aiReplyOptimization;
        introItems[1].querySelector('p').textContent = config.aiReplyOptimizationDesc;
        
        introItems[2].querySelector('h3').textContent = config.multiLanguageSupport;
        introItems[2].querySelector('p').textContent = config.multiLanguageSupportDesc;
    }
    
    // 更新使用指南
    const guideTitle = document.querySelector('.guide-title');
    if (guideTitle) guideTitle.textContent = config.usageGuide;
    
    const stepTexts = document.querySelectorAll('.step-text');
    if (stepTexts.length >= 4) {
        stepTexts[0].textContent = config.step1;
        stepTexts[1].textContent = config.step2;
        stepTexts[2].textContent = config.step3;
        stepTexts[3].textContent = config.step4;
    }
    
    // 更新统计标签
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 2) {
        statLabels[0].textContent = config.totalReplies;
        statLabels[1].textContent = config.todayUsage;
    }
}

/**
 * 检查扩展状态
 */
async function checkExtensionStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const config = POPUP_LANGUAGE_CONFIG[currentLanguage];
    
    try {
        // 设置检查状态
        statusDot.className = 'status-dot checking';
        statusText.textContent = config.statusChecking;
        
        // 检查配置状态
        const configResponse = await chrome.runtime.sendMessage({
            action: 'getLanguageConfig'
        });
        
        if (configResponse && configResponse.success) {
            // 配置正常
            statusDot.className = 'status-dot';
            statusText.textContent = config.statusReady;
            
            // 更新模型信息
            updateModelInfo();
            
        } else {
            throw new Error('配置检查失败');
        }
        
    } catch (error) {
        console.error('状态检查失败:', error);
        statusDot.className = 'status-dot error';
        statusText.textContent = config.statusError;
    }
}

/**
 * 更新模型信息
 */
async function updateModelInfo() {
    try {
        const response = await chrome.storage.sync.get(['config']);
        const config = response.config || {};
        const modelInfo = document.getElementById('modelInfo');
        
        if (modelInfo) {
            const modelName = config.model || 'DeepSeek-V3';
            // 简化模型名称显示
            const displayName = modelName.includes('DeepSeek-V3') ? 'DeepSeek-V3' : 
                               modelName.includes('DeepSeek') ? 'DeepSeek' :
                               modelName.split('/').pop() || 'AI Model';
            modelInfo.textContent = displayName;
        }
    } catch (error) {
        console.error('更新模型信息失败:', error);
    }
}

/**
 * 加载使用统计
 */
async function loadUsageStats() {
    try {
        const result = await chrome.storage.local.get(['usageStats']);
        const stats = result.usageStats || {
            totalReplies: 0,
            todayReplies: 0,
            lastResetDate: new Date().toDateString()
        };
        
        // 检查是否需要重置今日统计
        const today = new Date().toDateString();
        if (stats.lastResetDate !== today) {
            stats.todayReplies = 0;
            stats.lastResetDate = today;
            await chrome.storage.local.set({ usageStats: stats });
        }
        
        // 更新显示
        const totalRepliesElement = document.getElementById('totalReplies');
        const todayRepliesElement = document.getElementById('todayReplies');
        
        if (totalRepliesElement) {
            totalRepliesElement.textContent = stats.totalReplies.toString();
        }
        
        if (todayRepliesElement) {
            todayRepliesElement.textContent = stats.todayReplies.toString();
        }
        
    } catch (error) {
        console.error('加载使用统计失败:', error);
    }
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 语言切换按钮
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', handleLanguageSwitch);
    }
    
    // 打开Gmail按钮
    const openGmailBtn = document.getElementById('openGmail');
    if (openGmailBtn) {
        openGmailBtn.addEventListener('click', handleOpenGmail);
    }
    
    // 高级设置按钮
    const openSettingsBtn = document.getElementById('openSettings');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', handleOpenSettings);
    }
}

/**
 * 处理语言切换
 */
async function handleLanguageSwitch() {
    try {
        console.log('切换语言...');
        
        const response = await chrome.runtime.sendMessage({
            action: 'switchLanguage'
        });
        
        if (response && response.success) {
            currentLanguage = response.data.newLanguage;
            console.log('语言已切换到:', currentLanguage);
            
            // 更新界面
            updateUILanguage();
            
            // 显示切换成功提示
            showSuccessMessage(currentLanguage === 'zh' ? '语言已切换为中文' : 'Language switched to English');
            
        } else {
            throw new Error(response?.error || '语言切换失败');
        }
        
    } catch (error) {
        console.error('语言切换失败:', error);
        showErrorMessage('Language switch failed');
    }
}

/**
 * 处理打开Gmail
 */
async function handleOpenGmail() {
    try {
        await chrome.tabs.create({
            url: 'https://mail.google.com',
            active: true
        });
        
        // 关闭popup
        window.close();
        
    } catch (error) {
        console.error('打开Gmail失败:', error);
        showErrorMessage('Failed to open Gmail');
    }
}

/**
 * 处理打开设置
 */
async function handleOpenSettings() {
    try {
        await chrome.runtime.openOptionsPage();
        
        // 关闭popup
        window.close();
        
    } catch (error) {
        console.error('打开设置失败:', error);
        showErrorMessage('Failed to open settings');
    }
}

/**
 * 显示错误状态
 */
function showErrorStatus(message) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (statusDot) statusDot.className = 'status-dot error';
    if (statusText) statusText.textContent = message;
}

/**
 * 显示成功消息
 */
function showSuccessMessage(message) {
    // 创建临时提示
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #4caf50;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out;
    `;
    toast.textContent = message;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // 2秒后移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 2000);
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    // 创建临时提示
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 2秒后移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 2000);
}

console.log('Popup脚本已加载 - AI助手风格版本'); 
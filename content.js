/**
 * Gmail AI回复助手 - 内容脚本
 * 实现类似Monica AI的智能邮件助手功能
 */

// 全局变量
let isInitialized = false;
let currentEmailContent = '';
let aiFloatingButton = null;
let aiPanel = null;
let currentReplyBox = null;

/**
 * 显示扩展更新提示
 */
function showExtensionUpdateNotice() {
    // 检查是否已经显示过提示
    if (document.querySelector('.extension-update-notice')) return;
    
    const notice = document.createElement('div');
    notice.className = 'extension-update-notice';
    notice.innerHTML = `
        <div class="notice-content">
            <span>🔄 Gmail AI助手已更新</span>
            <button class="refresh-btn" onclick="location.reload()">刷新页面</button>
            <button class="close-btn">×</button>
        </div>
    `;
    
    notice.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        padding: 12px 16px !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
        z-index: 10000 !important;
        font-size: 14px !important;
        font-family: 'Google Sans', Roboto, sans-serif !important;
    `;
    
    // 添加按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .extension-update-notice .notice-content {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        .extension-update-notice .refresh-btn {
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            padding: 4px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
        }
        .extension-update-notice .refresh-btn:hover {
            background: rgba(255,255,255,0.3) !important;
        }
        .extension-update-notice .close-btn {
            background: none !important;
            color: white !important;
            border: none !important;
            font-size: 16px !important;
            cursor: pointer !important;
            padding: 0 4px !important;
        }
    `;
    document.head.appendChild(style);
    
    // 关闭按钮事件
    notice.querySelector('.close-btn').addEventListener('click', () => {
        notice.remove();
    });
    
    document.body.appendChild(notice);
    
    // 5秒后自动消失
    setTimeout(() => {
        if (notice.parentNode) {
            notice.remove();
        }
    }, 5000);
}

/**
 * 初始化扩展
 */
function initializeExtension() {
    if (isInitialized) return;
    
    console.log('Gmail AI回复助手正在初始化...');
    
    // 添加CSS样式
    addAIPanelStyles();
    
    // 立即开始检查
    setTimeout(() => {
        setupGlobalObserver();
        checkForEmailContent();
        checkForInputBoxes();
        isInitialized = true;
        console.log('Gmail AI回复助手初始化完成');
    }, 1000);
}

/**
 * 设置全局观察器
 */
function setupGlobalObserver() {
    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        let shouldCheckInputs = false;
        let shouldCheckEmails = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否有新的输入框
                        if (node.querySelector && (
                            node.querySelector('[contenteditable="true"]') ||
                            node.querySelector('[role="textbox"]') ||
                            node.classList.contains('Am')
                        )) {
                            shouldCheckInputs = true;
                        }
                        
                        // 检查是否有新的邮件内容
                        if (node.querySelector && (
                            node.querySelector('.ii.gt') ||
                            node.querySelector('.a3s') ||
                            node.classList.contains('nH')
                        )) {
                            shouldCheckEmails = true;
                        }
                    }
                }
            }
        });
        
        if (shouldCheckInputs) {
            setTimeout(checkForInputBoxes, 300);
        }
        if (shouldCheckEmails) {
            setTimeout(checkForEmailContent, 300);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 定期检查
    setInterval(() => {
        checkForInputBoxes();
        checkForEmailContent();
    }, 2000);
}

/**
 * 检查邮件内容并提供AI总结功能
 */
function checkForEmailContent() {
    // 查找邮件内容区域
    const emailContainers = document.querySelectorAll('.ii.gt, .nH.if');
    
    emailContainers.forEach(container => {
        if (!container.hasAttribute('data-ai-summary-added')) {
            addEmailSummaryButton(container);
            container.setAttribute('data-ai-summary-added', 'true');
        }
    });
}

/**
 * 添加邮件总结按钮
 */
function addEmailSummaryButton(emailContainer) {
    try {
        // 查找邮件头部区域
        const emailHeader = emailContainer.querySelector('.hP') || 
                           emailContainer.querySelector('.go') ||
                           emailContainer.querySelector('.gE.iv.gt');
        
        if (emailHeader && !emailHeader.querySelector('.ai-summary-button')) {
            const summaryButton = document.createElement('button');
            summaryButton.className = 'ai-summary-button';
            summaryButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                </svg>
                AI总结
            `;
            
            summaryButton.style.cssText = `
                display: inline-flex !important;
                align-items: center !important;
                gap: 4px !important;
                padding: 4px 8px !important;
                background: #f8f9fa !important;
                color: #5f6368 !important;
                border: 1px solid #dadce0 !important;
                border-radius: 4px !important;
                font-size: 11px !important;
                cursor: pointer !important;
                margin-left: 8px !important;
                transition: all 0.2s ease !important;
            `;
            
            summaryButton.addEventListener('click', () => {
                const emailContent = extractEmailContentFromContainer(emailContainer);
                showEmailSummary(emailContent, summaryButton);
            });
            
            emailHeader.appendChild(summaryButton);
        }
    } catch (error) {
        console.error('添加邮件总结按钮失败:', error);
    }
}

/**
 * 检查输入框并添加AI功能
 */
function checkForInputBoxes() {
    console.log('正在检查输入框...');
    
    // 查找所有可能的输入框 - 更精确的选择器
    const inputSelectors = [
        // Gmail回复框的主要选择器
        'div[contenteditable="true"][role="textbox"]',
        'div[contenteditable="true"][aria-label*="邮件正文"]',
        'div[contenteditable="true"][aria-label*="Message Body"]',
        'div[contenteditable="true"].Am.Al.editable',
        // 新版Gmail的选择器
        'div[contenteditable="true"][data-message-id]',
        'div[contenteditable="true"].editable',
        // 通用选择器
        'div[contenteditable="true"]'
    ];
    
    let foundBoxes = 0;
    
    inputSelectors.forEach(selector => {
        try {
            const inputBoxes = document.querySelectorAll(selector);
            console.log(`📝 选择器 "${selector}" 找到 ${inputBoxes.length} 个元素`);
            
            inputBoxes.forEach(inputBox => {
                if (isValidInputBox(inputBox) && !inputBox.hasAttribute('data-ai-enhanced')) {
                    console.log('✅ 找到有效输入框:', inputBox);
                    enhanceInputBox(inputBox);
                    inputBox.setAttribute('data-ai-enhanced', 'true');
                    foundBoxes++;
                }
            });
        } catch (error) {
            console.error('检查输入框失败:', selector, error);
        }
    });
    
    console.log(`📊 总共增强了 ${foundBoxes} 个输入框`);
}

/**
 * 验证是否是有效的输入框
 */
function isValidInputBox(element) {
    // 排除搜索框等
    const excludeSelectors = [
        '[aria-label*="搜索"]',
        '[aria-label*="Search"]',
        '[placeholder*="搜索"]',
        '[placeholder*="Search"]',
        '.gb_g',
        '#gs_lc0'
    ];
    
    for (let selector of excludeSelectors) {
        if (element.matches(selector) || element.closest(selector)) {
            return false;
        }
    }
    
    // 检查是否可见
    const rect = element.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 20) {
        return false;
    }
    
    // 检查是否在Gmail主要区域
    const mainContent = element.closest('[role="main"]') || 
                       element.closest('.nH') ||
                       element.closest('.aAy');
    
    return !!mainContent;
}

/**
 * 增强输入框
 */
function enhanceInputBox(inputBox) {
    try {
        console.log('正在增强输入框:', inputBox);
        
        // 添加浮动AI按钮
        addFloatingAIButton(inputBox);
        
        // 监听输入事件
        setupInputMonitoring(inputBox);
        
        console.log('输入框增强完成');
    } catch (error) {
        console.error('增强输入框失败:', error);
    }
}

/**
 * 添加浮动AI按钮（移到下方，类似其他AI工具）
 */
function addFloatingAIButton(inputBox) {
    // 移除旧的按钮
    const existingButton = inputBox.querySelector('.ai-floating-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    // 创建浮动按钮容器（放在输入框下方）
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'ai-button-container';
    buttonContainer.style.cssText = `
        position: relative !important;
        display: flex !important;
        justify-content: center !important;
        margin-top: 8px !important;
        z-index: 1000 !important;
    `;
    
    // 创建AI按钮
    const aiButton = document.createElement('button');
    aiButton.className = 'ai-floating-button';
    aiButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
        AI回复
    `;
    
    // 设置按钮样式（类似其他AI工具的风格）
    aiButton.style.cssText = `
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 8px 16px !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 20px !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
        transition: all 0.2s ease !important;
        opacity: 0.9 !important;
    `;
    
    // 悬停效果
    aiButton.addEventListener('mouseenter', () => {
        aiButton.style.opacity = '1';
        aiButton.style.transform = 'translateY(-1px)';
        aiButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });
    
    aiButton.addEventListener('mouseleave', () => {
        aiButton.style.opacity = '0.9';
        aiButton.style.transform = 'translateY(0)';
        aiButton.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
    });
    
    // 点击事件
    aiButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentReplyBox = inputBox;
        showAIPanel(inputBox);
    });
    
    // 添加按钮到容器
    buttonContainer.appendChild(aiButton);
    
    // 将容器添加到输入框的父容器中
    const inputParent = inputBox.parentElement;
    if (inputParent) {
        inputParent.appendChild(buttonContainer);
    }
    
    // 监听输入框焦点
    inputBox.addEventListener('focus', () => {
        buttonContainer.style.opacity = '1';
        currentReplyBox = inputBox;
    });
    
    console.log('✅ AI按钮已添加到输入框下方');
}

/**
 * 设置输入监听
 */
function setupInputMonitoring(inputBox) {
    // 监听输入变化
    inputBox.addEventListener('input', () => {
        // 可以在这里添加实时AI建议功能
        console.log('输入框内容变化');
    });
    
    // 监听焦点事件
    inputBox.addEventListener('focus', () => {
        currentReplyBox = inputBox;
        console.log('输入框获得焦点');
    });
    
    console.log('✅ 输入框监听已设置');
}

/**
 * 显示AI面板（居中显示，自动总结+回复优化）
 */
function showAIPanel(inputBox) {
    // 移除旧面板
    if (aiPanel) {
        aiPanel.remove();
    }
    
    // 创建AI面板
    aiPanel = document.createElement('div');
    aiPanel.className = 'ai-panel';
    aiPanel.innerHTML = `
        <div class="ai-panel-header">
            <div class="ai-panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" stroke-width="2"/>
                </svg>
                AI回复助手
            </div>
            <button class="ai-panel-close">×</button>
        </div>
        
        <div class="ai-panel-content">
            <!-- 邮件总结区域 -->
            <div class="email-summary-section">
                <h4>📄 邮件总结</h4>
                <div class="email-summary-content">正在分析邮件内容...</div>
            </div>
            
            <!-- 回复输入区域 -->
            <div class="reply-input-section">
                <h4>💬 您的回复</h4>
                <textarea class="reply-input" placeholder="请输入您想要回复的内容..."></textarea>
                <div class="input-hint">💡 提示：按 Enter 键快速优化回复</div>
                <button class="optimize-btn" disabled>✨ AI优化回复</button>
            </div>
            
            <!-- 优化结果区域 -->
            <div class="optimized-result-section" style="display: none;">
                <h4>🎯 优化后的回复</h4>
                <div class="optimized-content"></div>
                <div class="result-actions">
                    <button class="use-reply-btn">📝 使用此回复</button>
                    <button class="re-optimize-btn">🔄 重新优化</button>
                </div>
            </div>
        </div>
    `;
    
    // 设置面板样式（居中显示）
    aiPanel.style.cssText = `
        position: fixed !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 480px !important;
        max-width: 90vw !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        background: white !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 16px !important;
        box-shadow: 0 16px 48px rgba(0,0,0,0.15) !important;
        z-index: 10001 !important;
        font-family: 'Google Sans', Roboto, sans-serif !important;
        animation: slideInCenter 0.3s ease-out !important;
    `;
    
    // 添加到页面
    document.body.appendChild(aiPanel);
    
    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'ai-panel-overlay';
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.3) !important;
        z-index: 10000 !important;
        animation: fadeIn 0.3s ease-out !important;
    `;
    
    document.body.appendChild(overlay);
    
    // 绑定事件
    bindNewAIPanelEvents(aiPanel, inputBox, overlay);
    
    // 自动开始邮件总结
    autoSummarizeEmail();
    
    // 自动滚动到面板位置
    setTimeout(() => {
        aiPanel.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 300);
}

/**
 * 添加AI面板样式
 */
function addAIPanelStyles() {
    if (document.getElementById('ai-panel-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'ai-panel-styles';
    style.textContent = `
        @keyframes slideInCenter {
            from { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.9); 
            }
            to { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1); 
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .ai-panel-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 20px !important;
            border-bottom: 1px solid #e0e0e0 !important;
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%) !important;
            border-radius: 16px 16px 0 0 !important;
        }
        
        .ai-panel-title {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            font-weight: 600 !important;
            color: #202124 !important;
            font-size: 16px !important;
        }
        
        .ai-panel-close {
            background: none !important;
            border: none !important;
            font-size: 20px !important;
            cursor: pointer !important;
            color: #5f6368 !important;
            width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
        }
        
        .ai-panel-close:hover {
            background: rgba(95, 99, 104, 0.1) !important;
            color: #202124 !important;
        }
        
        .ai-panel-content {
            padding: 20px !important;
        }
        
        /* 邮件总结区域 - 改进排版 */
        .email-summary-section {
            margin-bottom: 24px !important;
        }
        
        .email-summary-section h4 {
            margin: 0 0 12px 0 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #1a73e8 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }
        
        /* 邮件总结内容 - Monica风格紧凑布局 */
        .email-summary-content {
            background: #f8f9fa !important;
            border: 1px solid #e8eaed !important;
            border-radius: 8px !important;
            padding: 12px 16px !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
            color: #202124 !important;
            min-height: 60px !important;
            white-space: normal !important;
        }
        
        /* 总结段落样式 */
        .summary-paragraph {
            margin-bottom: 8px !important;
            line-height: 1.5 !important;
            color: #202124 !important;
        }
        
        .summary-paragraph:last-child {
            margin-bottom: 0 !important;
        }
        
        /* 要点列表样式 */
        .summary-point {
            margin: 4px 0 !important;
            padding-left: 8px !important;
            color: #5f6368 !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
        }
        
        /* 粗体文本样式 */
        .email-summary-content strong {
            font-weight: 600 !important;
            color: #1a73e8 !important;
        }
        
        /* 移除旧的样式 */
        .summary-item,
        .summary-overview,
        .summary-title,
        .summary-content {
            /* display: none !important; 注释掉隐藏规则 */
        }
        
        /* 流式输出效果 */
        .streaming-text {
            border-right: 2px solid #1a73e8 !important;
            animation: blink 1s infinite !important;
        }
        
        @keyframes blink {
            0%, 50% { border-color: #1a73e8; }
            51%, 100% { border-color: transparent; }
        }
        
        /* 邮件总结内容结构化样式 - Monica风格 */
        .summary-item {
            margin-bottom: 12px !important;
            padding: 12px 16px !important;
            background: rgba(26, 115, 232, 0.03) !important;
            border-left: 3px solid #1a73e8 !important;
            border-radius: 0 8px 8px 0 !important;
            position: relative !important;
        }
        
        .summary-item:last-child {
            margin-bottom: 0 !important;
        }
        
        /* 摘要概述样式 */
        .summary-overview {
            background: linear-gradient(135deg, rgba(26, 115, 232, 0.08) 0%, rgba(26, 115, 232, 0.04) 100%) !important;
            border-left: 4px solid #1a73e8 !important;
            font-weight: 500 !important;
        }
        
        /* 要点列表样式 */
        .summary-point {
            background: rgba(26, 115, 232, 0.02) !important;
            border-left: 2px solid #4285f4 !important;
        }
        
        .summary-point .summary-content {
            font-size: 13px !important;
            line-height: 1.5 !important;
        }
        
        .summary-title {
            font-weight: 600 !important;
            color: #1a73e8 !important;
            margin-bottom: 6px !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
        }
        
        .summary-content {
            color: #202124 !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
            margin: 0 !important;
        }
        
        /* 回复输入区域 */
        .reply-input-section {
            margin-bottom: 24px !important;
        }
        
        .reply-input-section h4 {
            margin: 0 0 12px 0 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #1a73e8 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }
        
        .reply-input {
            width: 100% !important;
            min-height: 100px !important;
            padding: 16px !important;
            border: 2px solid #e8eaed !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            resize: vertical !important;
            font-family: inherit !important;
            margin-bottom: 16px !important;
            box-sizing: border-box !important;
            transition: all 0.2s ease !important;
        }
        
        .reply-input:focus {
            outline: none !important;
            border-color: #1a73e8 !important;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1) !important;
        }
        
        /* 快捷键提示样式 */
        .input-hint {
            font-size: 12px !important;
            color: #5f6368 !important;
            margin-bottom: 12px !important;
            text-align: center !important;
            font-style: italic !important;
        }
        
        .optimize-btn {
            width: 100% !important;
            padding: 12px 20px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 10px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }
        
        .optimize-btn:disabled {
            background: #f1f3f4 !important;
            color: #9aa0a6 !important;
            cursor: not-allowed !important;
        }
        
        .optimize-btn:not(:disabled):hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3) !important;
        }
        
        /* 优化结果区域 */
        .optimized-result-section {
            border-top: 1px solid #e8eaed !important;
            padding-top: 20px !important;
        }
        
        .optimized-result-section h4 {
            margin: 0 0 12px 0 !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #1a73e8 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }
        
        .optimized-content {
            background: linear-gradient(135deg, #e8f0fe 0%, #f0f7ff 100%) !important;
            border: 2px solid #1a73e8 !important;
            border-radius: 12px !important;
            padding: 16px !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            margin-bottom: 16px !important;
            white-space: normal !important;
            color: #202124 !important;
            max-height: 300px !important;
            overflow-y: auto !important;
        }
        
        /* 优化内容段落样式 */
        .optimized-content div {
            margin-bottom: 8px !important;
        }
        
        .optimized-content div:last-child {
            margin-bottom: 0 !important;
        }
        
        .result-actions {
            display: flex !important;
            gap: 12px !important;
        }
        
        .result-actions button {
            flex: 1 !important;
            padding: 10px 16px !important;
            border: 2px solid #e8eaed !important;
            border-radius: 8px !important;
            background: white !important;
            color: #5f6368 !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }
        
        .use-reply-btn {
            background: #1a73e8 !important;
            color: white !important;
            border-color: #1a73e8 !important;
        }
        
        .result-actions button:hover {
            background: #f8f9fa !important;
            border-color: #dadce0 !important;
            transform: translateY(-1px) !important;
        }
        
        .use-reply-btn:hover {
            background: #1557b0 !important;
            border-color: #1557b0 !important;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * 绑定新AI面板事件
 */
function bindNewAIPanelEvents(panel, inputBox, overlay) {
    // 关闭按钮
    panel.querySelector('.ai-panel-close').addEventListener('click', () => {
        panel.remove();
        aiPanel = null;
        overlay.remove();
    });
    
    // 回复输入框事件
    const replyInput = panel.querySelector('.reply-input');
    const optimizeBtn = panel.querySelector('.optimize-btn');
    
    // 监听输入变化，启用/禁用优化按钮
    replyInput.addEventListener('input', () => {
        const hasContent = replyInput.value.trim().length > 0;
        optimizeBtn.disabled = !hasContent;
    });
    
    // 添加回车键支持（Enter 直接优化）
    replyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            const userReply = replyInput.value.trim();
            if (userReply && !optimizeBtn.disabled) {
                console.log('🎯 Enter键触发优化:', userReply);
                optimizeUserReply(userReply, panel);
            }
        }
    });
    
    // 优化按钮点击事件
    optimizeBtn.addEventListener('click', async () => {
        const userReply = replyInput.value.trim();
        if (!userReply) return;
        
        await optimizeUserReply(userReply, panel);
    });
    
    // 结果操作按钮事件
    const useBtn = panel.querySelector('.use-reply-btn');
    const reOptimizeBtn = panel.querySelector('.re-optimize-btn');
    
    if (useBtn) {
        useBtn.addEventListener('click', () => {
            const optimizedContentElement = panel.querySelector('.optimized-content');
            
            // 获取HTML内容而不是纯文本
            let contentToInsert = '';
            
            if (optimizedContentElement) {
                // 尝试获取格式化的文本内容
                contentToInsert = extractFormattedTextFromElement(optimizedContentElement);
                
                console.log('📝 准备插入的内容:', contentToInsert);
                
                // 使用专门的Gmail插入函数
                insertFormattedTextToGmail(inputBox, contentToInsert);
            }
            
            panel.remove();
            aiPanel = null;
            overlay.remove();
            showNotification('回复已插入到邮件中', 'success');
        });
    }
    
    if (reOptimizeBtn) {
        reOptimizeBtn.addEventListener('click', async () => {
            const userReply = replyInput.value.trim();
            if (userReply) {
                await optimizeUserReply(userReply, panel);
            }
        });
    }
    
    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (panel && !panel.contains(e.target) && 
                !e.target.closest('.ai-floating-button')) {
                panel.remove();
                aiPanel = null;
                overlay.remove();
            }
        }, { once: true });
    }, 100);
}

/**
 * 自动总结邮件
 */
async function autoSummarizeEmail() {
    const summaryContent = document.querySelector('.email-summary-content');
    if (!summaryContent) return;
    
    try {
        console.log('🔍 开始自动总结邮件...');
        
        // 提取邮件内容
        const emailContent = extractEmailContent();
        
        if (!emailContent) {
            summaryContent.innerHTML = '❌ 未找到邮件内容，请确保在邮件页面中使用';
            return;
        }
        
        console.log('📧 找到邮件内容，长度:', emailContent.length);
        summaryContent.innerHTML = '🤖 正在分析邮件内容...';
        summaryContent.classList.add('streaming-text');
        
        // 调用AI总结 - 使用流式输出
        await generateEmailSummaryStream(emailContent, summaryContent);
        
        console.log('✅ 邮件总结完成');
        
    } catch (error) {
        console.error('❌ 邮件总结失败:', error);
        
        // 检查是否是扩展context失效错误
        if (error.message && error.message.includes('Extension context invalidated')) {
            summaryContent.innerHTML = '🔄 扩展已更新，请刷新页面后重试';
            showExtensionUpdateNotice();
        } else {
            summaryContent.innerHTML = `❌ 总结失败: ${error.message}`;
        }
        summaryContent.classList.remove('streaming-text');
    }
}

/**
 * 检查扩展context是否有效
 */
function isExtensionContextValid() {
    try {
        return chrome.runtime && chrome.runtime.id;
    } catch (error) {
        return false;
    }
}

/**
 * 安全的消息发送函数
 */
async function safeRuntimeMessage(message) {
    if (!isExtensionContextValid()) {
        throw new Error('Extension context invalidated');
    }
    
    try {
        return await chrome.runtime.sendMessage(message);
    } catch (error) {
        if (error.message.includes('Extension context invalidated')) {
            throw new Error('Extension context invalidated');
        }
        throw error;
    }
}

/**
 * 流式生成邮件总结
 */
async function generateEmailSummaryStream(emailContent, targetElement) {
    try {
        const response = await safeRuntimeMessage({
            action: 'generateSummaryStream',
            data: { emailContent }
        });
        
        if (response.success) {
            // 格式化总结内容
            const formattedSummary = formatEmailSummary(response.data);
            
            // 流式显示内容
            await typewriterEffect(targetElement, formattedSummary);
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('流式生成邮件总结失败:', error);
        throw error;
    }
}

/**
 * 格式化邮件总结内容（Monica风格 - 紧凑布局）
 */
function formatEmailSummary(summaryText) {
    // 清理文本
    const cleanText = summaryText.trim();
    
    // 处理Markdown粗体格式 **text** -> <strong>text</strong>
    let processedText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 按段落分割
    const paragraphs = processedText.split('\n\n').filter(p => p.trim());
    let formattedHtml = '';
    
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        
        if (!paragraph) continue;
        
        // 检查是否包含要点列表
        if (paragraph.includes('•') || paragraph.includes('-') || paragraph.includes('*')) {
            // 处理要点列表
            const lines = paragraph.split('\n').filter(line => line.trim());
            for (const line of lines) {
                const cleanLine = line.trim().replace(/^[•\-\*]\s*/, '');
                if (cleanLine) {
                    formattedHtml += `<div class="summary-point">• ${cleanLine}</div>`;
                }
            }
        } else {
            // 普通段落 - 紧凑显示
            formattedHtml += `<div class="summary-paragraph">${paragraph}</div>`;
        }
    }
    
    // 如果没有生成格式化内容，使用原始文本
    if (!formattedHtml) {
        formattedHtml = `<div class="summary-paragraph">${processedText}</div>`;
    }
    
    return formattedHtml;
}

/**
 * 文本流式显示效果 - 逐字显示
 */
async function typewriterEffectForText(element, text, speed = 30) {
    element.classList.add('streaming-text');
    element.innerHTML = '';
    
    // 处理文本格式，保持段落结构
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        
        if (paragraph) {
            // 创建段落容器
            const paragraphDiv = document.createElement('div');
            paragraphDiv.style.cssText = `
                margin-bottom: 12px !important;
                line-height: 1.6 !important;
            `;
            
            // 逐字显示段落内容
            for (let j = 0; j < paragraph.length; j++) {
                paragraphDiv.textContent += paragraph[j];
                await new Promise(resolve => setTimeout(resolve, speed));
            }
            
            element.appendChild(paragraphDiv);
            
            // 段落间稍长的停顿
            if (i < paragraphs.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }
    
    element.classList.remove('streaming-text');
}

/**
 * 打字机效果 - 流式显示文本
 */
async function typewriterEffect(element, content, speed = 30) {
    element.classList.add('streaming-text');
    element.innerHTML = '';
    
    // 如果是HTML内容，需要特殊处理
    if (content.includes('<div')) {
        // 创建临时元素来解析HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // 逐个显示每个元素（summary-paragraph 或 summary-point）
        const items = tempDiv.querySelectorAll('.summary-paragraph, .summary-point');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            element.appendChild(item.cloneNode(true));
            
            // 添加短暂延迟
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    } else {
        // 普通文本的打字机效果 - 直接设置HTML内容
        element.innerHTML = content;
    }
    
    element.classList.remove('streaming-text');
}

/**
 * 优化用户回复
 */
async function optimizeUserReply(userReply, panel) {
    const optimizedSection = panel.querySelector('.optimized-result-section');
    const optimizedContent = panel.querySelector('.optimized-content');
    const optimizeBtn = panel.querySelector('.optimize-btn');
    
    try {
        console.log('✨ 开始优化用户回复...');
        
        // 显示优化区域
        optimizedSection.style.display = 'block';
        optimizedContent.innerHTML = '🤖 正在优化您的回复...';
        optimizedContent.classList.add('streaming-text');
        
        // 自动滚动到优化结果区域
        setTimeout(() => {
            optimizedSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
        
        // 禁用优化按钮
        optimizeBtn.disabled = true;
        optimizeBtn.textContent = '⏳ 优化中...';
        
        // 获取邮件内容作为上下文
        const emailContent = extractEmailContent();
        
        // 调用AI优化 - 使用流式输出
        await optimizeReplyStream(userReply, emailContent, optimizedContent);
        
        // 优化完成后再次滚动确保可见
        setTimeout(() => {
            optimizedSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 500);
        
        console.log('✅ 回复优化完成');
        
    } catch (error) {
        console.error('❌ 回复优化失败:', error);
        
        // 检查是否是扩展context失效错误
        if (error.message && error.message.includes('Extension context invalidated')) {
            optimizedContent.innerHTML = '🔄 扩展已更新，请刷新页面后重试';
            showExtensionUpdateNotice();
        } else {
            optimizedContent.innerHTML = `❌ 优化失败: ${error.message}`;
        }
        optimizedContent.classList.remove('streaming-text');
    } finally {
        // 恢复优化按钮
        optimizeBtn.disabled = false;
        optimizeBtn.textContent = '✨ AI优化回复';
    }
}

/**
 * 流式优化回复
 */
async function optimizeReplyStream(userReply, emailContext, targetElement) {
    try {
        const response = await safeRuntimeMessage({
            action: 'optimizeReplyStream',
            data: { 
                userReply: userReply,
                emailContext: emailContext || '',
                style: 'professional'
            }
        });
        
        if (response.success) {
            // 实现真正的流式显示效果
            await typewriterEffectForText(targetElement, response.data, 30);
        } else {
            throw new Error(response.error || '优化失败');
        }
    } catch (error) {
        console.error('流式优化回复失败:', error);
        throw error;
    }
}

/**
 * 提取邮件内容
 */
function extractEmailContent() {
    try {
        let emailContent = '';
        
        console.log('🔍 开始提取邮件内容...');
        
        // 方法1: 查找当前打开的邮件内容（最常见的情况）
        const currentEmail = document.querySelector('.nH.if .gs .a3s.aiL') ||
                            document.querySelector('.nH.if .gs .ii.gt .a3s') ||
                            document.querySelector('.ii.gt .a3s.aiL');
        
        if (currentEmail) {
            emailContent = currentEmail.innerText.trim();
            console.log('✅ 方法1成功提取邮件内容:', emailContent.substring(0, 100) + '...');
        }
        
        // 方法2: 查找邮件对话中的最新邮件
        if (!emailContent) {
            const emailMessages = document.querySelectorAll('.nH.if .gs');
            if (emailMessages.length > 0) {
                // 获取最后一条邮件（最新的）
                const lastMessage = emailMessages[emailMessages.length - 1];
                const messageContent = lastMessage.querySelector('.a3s') ||
                                     lastMessage.querySelector('.ii.gt div[dir="ltr"]');
                
                if (messageContent) {
                    emailContent = messageContent.innerText.trim();
                    console.log('✅ 方法2成功提取邮件内容:', emailContent.substring(0, 100) + '...');
                }
            }
        }
        
        // 方法3: 查找邮件详情页面的内容
        if (!emailContent) {
            const emailDetail = document.querySelector('.ii.gt div[dir="ltr"]') ||
                               document.querySelector('.ii.gt .a3s') ||
                               document.querySelector('.adn.ads .ii.gt .a3s');
            
            if (emailDetail) {
                emailContent = emailDetail.innerText.trim();
                console.log('✅ 方法3成功提取邮件内容:', emailContent.substring(0, 100) + '...');
            }
        }
        
        // 方法4: 查找引用的邮件内容（回复时）
        if (!emailContent) {
            const quotedContent = document.querySelector('.gmail_quote') ||
                                 document.querySelector('.moz-cite-prefix') ||
                                 document.querySelector('[class*="quote"]') ||
                                 document.querySelector('.gmail_extra');
            
            if (quotedContent) {
                // 获取引用内容的前面部分（原始邮件）
                const parentElement = quotedContent.parentElement;
                if (parentElement) {
                    const allText = parentElement.innerText;
                    const quoteIndex = allText.indexOf(quotedContent.innerText);
                    if (quoteIndex > 0) {
                        emailContent = allText.substring(0, quoteIndex).trim();
                    } else {
                        emailContent = quotedContent.innerText.trim();
                    }
                    console.log('✅ 方法4成功提取邮件内容:', emailContent.substring(0, 100) + '...');
                }
            }
        }
        
        // 方法5: 通用选择器（最后的尝试）
        if (!emailContent) {
            const genericSelectors = [
                '.nH .if .gs .a3s',
                '.ii.gt .a3s',
                '[role="listitem"] .a3s',
                '.gs .ii.gt div[dir]',
                '.adn.ads .ii.gt .a3s'
            ];
            
            for (const selector of genericSelectors) {
                const element = document.querySelector(selector);
                if (element && element.innerText.trim()) {
                    emailContent = element.innerText.trim();
                    console.log(`✅ 方法5(${selector})成功提取邮件内容:`, emailContent.substring(0, 100) + '...');
                    break;
                }
            }
        }
        
        // 清理内容
        if (emailContent) {
            // 移除多余的换行符
            emailContent = emailContent.replace(/\n{3,}/g, '\n\n');
            // 移除邮件签名等无关内容
            emailContent = emailContent.replace(/--\s*\n[\s\S]*$/, '');
            // 移除常见的邮件尾部信息
            emailContent = emailContent.replace(/\n\s*发送自.*$/, '');
            emailContent = emailContent.replace(/\n\s*Sent from.*$/, '');
            
            console.log('📧 最终提取的邮件内容长度:', emailContent.length);
            return emailContent.trim();
        }
        
        console.log('❌ 未能提取到邮件内容');
        return '';
        
    } catch (error) {
        console.error('❌ 提取邮件内容失败:', error);
        return '';
    }
}

/**
 * 从容器提取邮件内容
 */
function extractEmailContentFromContainer(container) {
    try {
        const messageBody = container.querySelector('.a3s') || 
                           container.querySelector('.ii.gt div[dir="ltr"]');
        
        if (messageBody) {
            return messageBody.innerText.trim();
        }
        
        return '';
    } catch (error) {
        console.error('从容器提取邮件内容失败:', error);
        return '';
    }
}

/**
 * 生成邮件总结
 */
async function generateEmailSummary(emailContent) {
    if (!emailContent) {
        throw new Error('没有找到邮件内容');
    }
    
    try {
        const response = await safeRuntimeMessage({
            action: 'generateSummary',
            data: { emailContent }
        });
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('生成邮件总结失败:', error);
        throw error;
    }
}

/**
 * 生成邮件回复
 */
async function generateEmailReply(emailContent) {
    console.log('💬 开始生成邮件回复...');
    
    if (!emailContent) {
        console.log('❌ 没有邮件内容，尝试重新提取...');
        // 尝试重新提取邮件内容
        emailContent = extractEmailContent();
        
        if (!emailContent) {
            throw new Error('没有找到邮件内容，请确保在邮件页面中使用此功能');
        }
    }
    
    console.log('📧 邮件内容长度:', emailContent.length);
    console.log('📧 邮件内容预览:', emailContent.substring(0, 200) + '...');
    
    try {
        console.log('🚀 发送API请求...');
        
        const response = await safeRuntimeMessage({
            action: 'generateReply',
            data: { 
                emailContent: emailContent,
                style: 'friendly' 
            }
        });
        
        console.log('📨 收到API响应:', response);
        
        if (response.success) {
            const reply = response.data[0] || response.data || '无法生成回复';
            console.log('✅ 回复生成成功:', reply.substring(0, 100) + '...');
            return reply;
        } else {
            console.error('❌ API返回错误:', response.error);
            throw new Error(response.error || '生成回复失败');
        }
    } catch (error) {
        console.error('❌ 生成邮件回复失败:', error);
        
        // 提供更友好的错误信息
        if (error.message.includes('网络')) {
            throw new Error('网络连接失败，请检查网络后重试');
        } else if (error.message.includes('API')) {
            throw new Error('AI服务暂时不可用，请稍后重试');
        } else {
            throw new Error('生成回复失败：' + error.message);
        }
    }
}

/**
 * 优化文本
 */
async function optimizeText(text) {
    if (!text) {
        throw new Error('没有找到要优化的文本');
    }
    
    try {
        const response = await safeRuntimeMessage({
            action: 'optimizeText',
            data: { text }
        });
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('优化文本失败:', error);
        throw error;
    }
}

/**
 * 翻译文本
 */
async function translateText(text) {
    if (!text) {
        throw new Error('没有找到要翻译的文本');
    }
    
    try {
        const response = await safeRuntimeMessage({
            action: 'translateText',
            data: { text }
        });
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('翻译文本失败:', error);
        throw error;
    }
}

/**
 * 从HTML元素中提取格式化文本
 */
function extractFormattedTextFromElement(element) {
    try {
        let text = '';
        
        // 遍历所有子节点，保持格式
        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                // 文本节点直接添加
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                // 处理不同的HTML标签
                if (tagName === 'div') {
                    // div标签表示新行
                    if (text && !text.endsWith('\n')) {
                        text += '\n';
                    }
                    // 递归处理子节点
                    for (let child of node.childNodes) {
                        processNode(child);
                    }
                    // div结束后添加换行
                    if (!text.endsWith('\n')) {
                        text += '\n';
                    }
                } else if (tagName === 'br') {
                    // br标签表示换行
                    text += '\n';
                } else if (tagName === 'p') {
                    // p标签表示段落
                    if (text && !text.endsWith('\n\n')) {
                        text += '\n\n';
                    }
                    for (let child of node.childNodes) {
                        processNode(child);
                    }
                    text += '\n\n';
                } else {
                    // 其他标签递归处理
                    for (let child of node.childNodes) {
                        processNode(child);
                    }
                }
            }
        }
        
        processNode(element);
        
        // 清理多余的换行符
        text = text.replace(/\n{3,}/g, '\n\n').trim();
        
        console.log('📄 提取的格式化文本:', text);
        return text;
        
    } catch (error) {
        console.error('提取格式化文本失败:', error);
        // 备用方案：使用textContent
        return element.textContent || '';
    }
}

/**
 * 专门为Gmail优化的文本插入函数
 */
function insertFormattedTextToGmail(inputBox, text) {
    try {
        console.log('📝 开始插入格式化文本到Gmail...');
        console.log('📝 原始文本:', text);
        
        // 清空输入框
        inputBox.innerHTML = '';
        
        // 简化处理：按行分割并创建div
        const lines = text.split('\n');
        
        lines.forEach((line, index) => {
            const div = document.createElement('div');
            
            if (line.trim() === '') {
                // 空行使用br
                div.innerHTML = '<br>';
            } else {
                // 有内容的行直接设置文本
                div.textContent = line;
                
                // 应用Gmail标准样式
                div.style.fontFamily = 'Arial, sans-serif';
                div.style.fontSize = '13px';
                div.style.lineHeight = '1.4';
            }
            
            inputBox.appendChild(div);
        });
        
        // 确保最后有一个空div
        const lastDiv = document.createElement('div');
        lastDiv.innerHTML = '<br>';
        inputBox.appendChild(lastDiv);
        
        // 触发Gmail事件
        const events = ['input', 'change', 'keyup', 'focus'];
        events.forEach(eventType => {
            try {
                inputBox.dispatchEvent(new Event(eventType, { bubbles: true }));
            } catch (e) {
                console.log('事件触发失败:', eventType);
            }
        });
        
        // 设置焦点
        setTimeout(() => {
            try {
                inputBox.focus();
                
                // 将光标移到末尾
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(inputBox);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (error) {
                console.log('设置光标失败:', error);
            }
        }, 100);
        
        console.log('✅ Gmail格式化文本插入完成');
        
    } catch (error) {
        console.error('❌ Gmail格式化插入失败:', error);
        
        // 备用方案：使用原来的函数
        insertTextToInputBox(inputBox, text);
    }
}

/**
 * 将文本插入到输入框（Gmail专用格式优化 - 保持原始排版）
 */
function insertTextToInputBox(inputBox, text) {
    try {
        console.log('📝 开始插入文本到Gmail编辑器...');
        console.log('📝 原始文本:', text);
        
        // 清空现有内容
        inputBox.innerHTML = '';
        
        // 创建一个临时div来处理HTML格式
        const tempDiv = document.createElement('div');
        
        // 预处理文本，保持原始格式
        let processedText = text.trim();
        
        // 检测文本类型并相应处理
        if (isStructuredText(processedText)) {
            // 结构化文本（如邮件回复）
            processedText = formatStructuredText(processedText);
        } else {
            // 普通文本
            processedText = formatPlainText(processedText);
        }
        
        // 设置临时div的内容
        tempDiv.innerHTML = processedText;
        
        // 将处理后的内容移动到Gmail编辑器
        while (tempDiv.firstChild) {
            inputBox.appendChild(tempDiv.firstChild);
        }
        
        // 确保最后有一个空的div（Gmail编辑器需要）
        if (!inputBox.lastElementChild || inputBox.lastElementChild.tagName !== 'DIV') {
            const lastDiv = document.createElement('div');
            lastDiv.innerHTML = '<br>';
            inputBox.appendChild(lastDiv);
        }
        
        // 应用Gmail样式
        applyGmailStyles(inputBox);
        
        // 触发Gmail的各种事件
        triggerGmailEvents(inputBox, text);
        
        // 设置焦点和光标位置
        setTimeout(() => {
            setGmailCursor(inputBox);
        }, 100);
        
        console.log('✅ 文本插入完成，最终HTML:', inputBox.innerHTML);
        showNotification('回复已插入到邮件中', 'success');
        
    } catch (error) {
        console.error('❌ 插入文本失败:', error);
        showNotification('插入失败: ' + error.message, 'error');
        
        // 备用方案：使用简单的文本插入
        fallbackTextInsertion(inputBox, text);
    }
}

/**
 * 检测是否为结构化文本
 */
function isStructuredText(text) {
    // 检测常见的邮件回复结构
    const patterns = [
        /^(尊敬的|亲爱的|Dear|Hi|Hello)/i,  // 称呼开头
        /\n\n.*\n\n/,                        // 多段落结构
        /(谢谢|感谢|Thank you|Best regards|Sincerely)/i,  // 结尾敬语
        /^\d+\./m,                           // 编号列表
        /^[•\-\*]/m                          // 项目符号
    ];
    
    return patterns.some(pattern => pattern.test(text));
}

/**
 * 格式化结构化文本（邮件回复等）
 */
function formatStructuredText(text) {
    let html = '';
    
    // 按段落分割（双换行或单换行）
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    if (paragraphs.length <= 1) {
        // 如果没有明显段落，按单换行分割
        const lines = text.split('\n').filter(line => line.trim());
        paragraphs.length = 0;
        paragraphs.push(...lines);
    }
    
    paragraphs.forEach((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return;
        
        // 检测段落类型
        if (isListItem(trimmed)) {
            // 列表项
            html += formatListItem(trimmed);
        } else if (isGreeting(trimmed)) {
            // 问候语
            html += `<div style="margin-bottom: 12px;">${escapeHtml(trimmed)}</div>`;
        } else if (isClosing(trimmed)) {
            // 结尾敬语
            html += `<div style="margin-top: 12px;">${escapeHtml(trimmed)}</div>`;
        } else {
            // 普通段落
            const lines = trimmed.split('\n');
            if (lines.length === 1) {
                html += `<div style="margin-bottom: 8px;">${escapeHtml(trimmed)}</div>`;
            } else {
                // 多行段落
                lines.forEach(line => {
                    if (line.trim()) {
                        html += `<div>${escapeHtml(line.trim())}</div>`;
                    }
                });
                if (index < paragraphs.length - 1) {
                    html += '<div><br></div>';
                }
            }
        }
    });
    
    return html;
}

/**
 * 格式化普通文本
 */
function formatPlainText(text) {
    let html = '';
    
    // 按段落分割
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    if (paragraphs.length <= 1) {
        // 单段落或简单文本，按行处理
        const lines = text.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
                html += `<div>${escapeHtml(trimmed)}</div>`;
            } else {
                html += '<div><br></div>';
            }
        });
    } else {
        // 多段落文本
        paragraphs.forEach((paragraph, index) => {
            const lines = paragraph.trim().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    html += `<div>${escapeHtml(line.trim())}</div>`;
                }
            });
            
            // 段落间添加空行
            if (index < paragraphs.length - 1) {
                html += '<div><br></div>';
            }
        });
    }
    
    return html;
}

/**
 * 检测是否为列表项
 */
function isListItem(text) {
    return /^(\d+\.|[•\-\*]|\([a-zA-Z0-9]+\))/.test(text.trim());
}

/**
 * 检测是否为问候语
 */
function isGreeting(text) {
    return /^(尊敬的|亲爱的|Dear|Hi|Hello|您好)/i.test(text.trim());
}

/**
 * 检测是否为结尾敬语
 */
function isClosing(text) {
    return /(谢谢|感谢|Thank you|Best regards|Sincerely|此致|敬礼|祝好)$/i.test(text.trim());
}

/**
 * 格式化列表项
 */
function formatListItem(text) {
    return `<div style="margin-left: 16px; margin-bottom: 4px;">${escapeHtml(text)}</div>`;
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 应用Gmail样式
 */
function applyGmailStyles(inputBox) {
    // 确保所有div都有正确的Gmail样式
    const divs = inputBox.querySelectorAll('div');
    divs.forEach(div => {
        if (!div.style.fontFamily) {
            div.style.fontFamily = 'Arial, sans-serif';
        }
        if (!div.style.fontSize) {
            div.style.fontSize = '13px';
        }
        if (!div.style.lineHeight) {
            div.style.lineHeight = '1.4';
        }
    });
}

/**
 * 触发Gmail事件
 */
function triggerGmailEvents(inputBox, text) {
    const events = [
        'input',
        'change', 
        'keyup',
        'paste',
        'focus',
        'blur',
        'compositionend'
    ];
    
    events.forEach(eventType => {
        try {
            const event = new Event(eventType, { 
                bubbles: true, 
                cancelable: true 
            });
            inputBox.dispatchEvent(event);
        } catch (e) {
            console.log('事件触发失败:', eventType, e);
        }
    });
    
    // 特殊的Gmail输入事件
    try {
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text
        });
        inputBox.dispatchEvent(inputEvent);
    } catch (e) {
        console.log('InputEvent触发失败:', e);
    }
}

/**
 * 设置Gmail光标位置
 */
function setGmailCursor(inputBox) {
    try {
        inputBox.focus();
        
        // 将光标移到最后一个有内容的div的末尾
        const allDivs = inputBox.querySelectorAll('div');
        const lastContentDiv = Array.from(allDivs).reverse().find(div => 
            div.textContent.trim() !== '' && !div.innerHTML.includes('<br>')
        );
        
        if (lastContentDiv) {
            const range = document.createRange();
            const selection = window.getSelection();
            
            range.selectNodeContents(lastContentDiv);
            range.collapse(false); // 移到末尾
            
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // 如果没找到内容div，移到输入框末尾
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(inputBox);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        // 再次触发focus事件确保Gmail识别
        inputBox.dispatchEvent(new Event('focus', { bubbles: true }));
        
    } catch (error) {
        console.log('设置光标位置失败:', error);
    }
}

/**
 * 备用文本插入方案
 */
function fallbackTextInsertion(inputBox, text) {
    try {
        console.log('🔄 使用备用插入方案...');
        
        // 方案1: 直接设置innerHTML
        const lines = text.split('\n');
        let html = '';
        lines.forEach(line => {
            if (line.trim()) {
                html += `<div>${escapeHtml(line.trim())}</div>`;
            } else {
                html += '<div><br></div>';
            }
        });
        
        inputBox.innerHTML = html;
        inputBox.focus();
        
        showNotification('已使用备用方式插入文本', 'info');
        
    } catch (backupError) {
        console.error('备用插入方案也失败:', backupError);
        
        // 最后的备用方案：纯文本
        try {
            inputBox.textContent = text;
            inputBox.focus();
            showNotification('已使用纯文本方式插入', 'warning');
        } catch (finalError) {
            console.error('所有插入方案都失败:', finalError);
            showNotification('插入失败，请手动复制粘贴', 'error');
        }
    }
}

/**
 * 复制到剪贴板
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * 显示邮件总结
 */
function showEmailSummary(emailContent, button) {
    // 创建总结弹窗
    const summaryPopup = document.createElement('div');
    summaryPopup.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        width: 300px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        padding: 16px;
        z-index: 10000;
        font-size: 13px;
        line-height: 1.4;
    `;
    
    summaryPopup.innerHTML = '正在生成总结...';
    
    button.style.position = 'relative';
    button.appendChild(summaryPopup);
    
    // 生成总结
    generateEmailSummary(emailContent)
        .then(summary => {
            summaryPopup.innerHTML = summary;
        })
        .catch(error => {
            summaryPopup.innerHTML = '总结生成失败: ' + error.message;
        });
    
    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!summaryPopup.contains(e.target) && !button.contains(e.target)) {
                summaryPopup.remove();
            }
        }, { once: true });
    }, 100);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    initializeExtension();
}

// 监听页面变化（Gmail是单页应用）
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(initializeExtension, 1000);
    }
}).observe(document, { subtree: true, childList: true }); 
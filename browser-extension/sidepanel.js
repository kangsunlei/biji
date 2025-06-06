document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const goBtn = document.getElementById('goBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const newTabBtn = document.getElementById('newTabBtn');
    const historyBtn = document.getElementById('historyBtn');
    const webFrame = document.getElementById('webFrame');
    const loading = document.getElementById('loading');
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');

    let urlHistory = [];
    let historyVisible = false;

    // 加载保存的设置和历史记录
    chrome.storage.sync.get(['lastUrl', 'urlHistory'], (result) => {
        if (result.lastUrl) {
            urlInput.value = result.lastUrl;
            loadUrl(result.lastUrl);
        }
        if (result.urlHistory) {
            urlHistory = result.urlHistory;
        }
    });

    // 加载网页
    function loadUrl(url) {
        if (!url) return;

        // 自动添加协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
            urlInput.value = url;
        }

        // 显示加载状态
        loading.textContent = '正在加载...';
        loading.style.display = 'block';
        webFrame.style.display = 'none';

        // 设置iframe源
        webFrame.src = url;

        // 添加到历史记录
        addToHistory(url);

        // 保存设置
        chrome.storage.sync.set({
            lastUrl: url,
            urlHistory: urlHistory
        });

        // iframe加载完成后隐藏loading
        webFrame.onload = () => {
            loading.style.display = 'none';
            webFrame.style.display = 'block';
        };

        // 处理加载错误
        webFrame.onerror = () => {
            loading.textContent = '加载失败，请检查网址是否正确';
        };
    }

    // 访问按钮点击
    goBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            loadUrl(url);
        }
    });

    // Enter键访问
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const url = urlInput.value.trim();
            if (url) {
                loadUrl(url);
            }
        }
    });

    // 刷新按钮
    refreshBtn.addEventListener('click', () => {
        if (webFrame.src) {
            webFrame.src = webFrame.src;
            loading.textContent = '正在刷新...';
            loading.style.display = 'block';
            webFrame.style.display = 'none';
        }
    });

    // 新标签页打开
    newTabBtn.addEventListener('click', () => {
        const url = urlInput.value.trim() || webFrame.src;
        if (url) {
            window.open(url, '_blank');
        }
    });

    // 历史记录按钮
    historyBtn.addEventListener('click', () => {
        historyVisible = !historyVisible;
        if (historyVisible) {
            renderHistory();
            historySection.style.display = 'block';
            historyBtn.textContent = '📋 隐藏历史';
        } else {
            historySection.style.display = 'none';
            historyBtn.textContent = '📋 历史记录';
        }
    });

    // 添加到历史记录
    function addToHistory(url) {
        // 移除重复的 URL
        urlHistory = urlHistory.filter(item => item.url !== url);

        // 添加到开头
        urlHistory.unshift({
            url: url,
            timestamp: Date.now(),
            title: url // 可以后续优化获取页面标题
        });

        // 限制历史记录数量
        if (urlHistory.length > 20) {
            urlHistory = urlHistory.slice(0, 20);
        }
    }

    // 渲染历史记录
    function renderHistory() {
        if (urlHistory.length === 0) {
            historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">暂无历史记录</div>';
            return;
        }

        historyList.innerHTML = urlHistory.map((item, index) => `
            <div class="history-item" data-url="${item.url}">
                <div class="history-url" title="${item.url}">
                    ${item.url}
                </div>
                <button class="delete-btn" data-index="${index}" title="删除">×</button>
            </div>
        `).join('');

        // 绑定历史记录点击事件
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // 如果点击的是删除按钮，不触发选择
                if (e.target.classList.contains('delete-btn')) {
                    return;
                }
                const url = item.dataset.url;
                urlInput.value = url;
                loadUrl(url);
                // 隐藏历史记录
                historyVisible = false;
                historySection.style.display = 'none';
                historyBtn.textContent = '📋 历史记录';
            });
        });

        // 绑定删除按钮事件
        historyList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                deleteHistoryItem(index);
            });
        });
    }

    // 删除历史记录项
    function deleteHistoryItem(index) {
        urlHistory.splice(index, 1);
        chrome.storage.sync.set({ urlHistory: urlHistory });
        renderHistory();
    }
}); 
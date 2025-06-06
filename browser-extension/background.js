// 后台脚本
chrome.runtime.onInstalled.addListener(() => {
    console.log('侧边栏网页浏览插件已安装');
});

// 设置侧边栏行为：点击插件图标时打开侧边栏
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// 处理插件图标点击
chrome.action.onClicked.addListener((tab) => {
    // 这里可以添加额外的逻辑，比如检查权限等
    console.log('插件图标被点击');
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openInNewTab') {
        chrome.tabs.create({ url: request.url });
        sendResponse({ success: true });
    }
}); 
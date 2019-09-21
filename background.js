chrome.tabs.onUpdated.addListener((id) => {
    chrome.tabs.sendMessage(id, {});
});

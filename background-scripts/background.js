// when extension is installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {

    // only work on specific page
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: WEB_PAGE, pathContains: WEB_PAGE_PATH },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);

  });
});

// listen for messages from other parts of extension
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

  // download video
  if (msg.text === Message_DownloadVideo) {

    // download video when URL exists
    const videoData = msg.videoData;
    if (videoData.url && videoData.title) {
      chrome.downloads.download({
        url: videoData.url,
        filename: videoData.title.replace(/[^a-zA-Z ]+/g, '') + '.mp4'
      });
    }
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // when status is complete then add download action
  if (changeInfo.status && changeInfo.status == TabUpdated_Status) {
    chrome.tabs.sendMessage(tabId, {
      text: Message_AddDownloadAction
    })
  }  
});
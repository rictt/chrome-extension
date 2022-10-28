chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("configList", (data) => {
    if (!data.configList) {
      chrome.storage.sync.set({
        configList: [
          {
            id: Date.now(),
            host: "zhihu.com",
            style: ".AppHeader {display: none;}",
            status: true,
          },
          {
            id: Date.now() + Math.floor(Math.random() * 10000),
            host: "bilibili.com",
            style: ".short-margin {display: none;}",
            status: true,
          },
        ],
      });
    }
  });
  console.log("Custom page plugin load successful!");
});

const injectScript = ({ tabId, files, callback }) => {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: files,
    },
    callback
      ? callback
      : () => {
          console.log("inject default callback");
        }
  );
};

// onUpdate会调用多次
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  // 避免多次注入
  if (changeInfo && changeInfo.status === "complete") {
    injectScript({
      tabId,
      files: ["inject.js"],
    });
  }
});

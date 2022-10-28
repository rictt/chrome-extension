
const STATE = {
  ON: "ON",
  OFF: "OFF"
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: STATE.OFF,
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.indexOf('zhihu') > -1) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === STATE.ON ? STATE.OFF : STATE.ON

    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === STATE.ON) {
      await chrome.scripting.insertCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === STATE.OFF) {
      await chrome.scripting.removeCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
    }
  }
});
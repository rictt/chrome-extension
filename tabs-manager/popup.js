const zhihuTabs = await chrome.tabs.query({
  url: [
    "https://zhihu.com/*",
    "https://www.zhihu.com/*"
  ]
})

const baiduTabs = await chrome.tabs.query({
  url: [
    "https://baidu.com/*",
    "https://www.baidu.com/*"
  ]
})

const template = document.getElementById("li_template");
const elements = new Set();

for (const tab of zhihuTabs.concat(baiduTabs)) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title
  const pathname = tab.url

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector("a").addEventListener("click", async () => {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}

document.querySelector("ul").append(...elements);

let collapsed = false

const button = document.querySelector("button");
const toGroup = async (tabIds, title) => {
  if (tabIds && tabIds.length) {
    const group = await chrome.tabs.group({ tabIds })
    await await chrome.tabGroups.update(group, { title: title || "Groups", collapsed });
  }
}
button.addEventListener("click", async () => {
  const zhihuTabIds = zhihuTabs.map(({ id }) => id);
  await toGroup(zhihuTabIds, "Zhihu")

  const baiduTabIds = baiduTabs.map(({ id }) => id);
  await toGroup(baiduTabIds, "Baidu")

  collapsed = !collapsed
});
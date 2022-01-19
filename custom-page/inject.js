
function injectMain() {
  console.log('【 Custom Page Style Plugin 】')
  const styleId = 'custom-page-style__id'
  if (document.getElementById(styleId)) {
    return
  }

  chrome.storage.sync.get('configList', (data) => {
    const configList = data.configList
    function injectCustomCss(styleCode) {
      const style = document.createElement('style')
      style.setAttribute('id', styleId)
      style.appendChild(document.createTextNode(styleCode));
      const head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }
    for (const item of configList) {
      const { host, style, status } = item
      if (status && window.location.href.indexOf(host) !== -1) {
        injectCustomCss(style)
      }
    }
  })
}

injectMain()




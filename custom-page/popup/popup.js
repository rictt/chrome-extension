const goSettingsBtn = document.querySelector('#goSettings')
const settingsWrapper = document.querySelector('#settings')
const goBackBtn = document.querySelector('#goBack')
const configListWrapper = document.querySelector('#config-list')
const saveBtn = document.querySelector('#save')
const cancelBtn = document.querySelector('#cancel')
const addBtn = document.querySelector('#add')
const hostInput = document.querySelector('#hostInput')
const styleInput = document.querySelector('#styleInput')

let _currentConfigList = []
let _currentEditConfig = null

const getConfigList = async () => {
  let data = await chrome.storage.sync.get('configList')
  const configList = data.configList
  _currentConfigList = configList
  return configList
}

getConfigList()
  .then(res => {
    generateConfigList(res)
  })

goBack.addEventListener('click', gotoIndex)

goSettingsBtn.addEventListener('click', gotoSettings)

saveBtn.addEventListener('click', () => {
  const host = hostInput.value
  const style = styleInput.value
  const config = {
    host,
    style
  }
  if (!_currentEditConfig) {
    config.id = Date.now()
    _currentConfigList.push(config)
  } else {
    const currentId = _currentEditConfig.id
    const index = _currentConfigList.findIndex(e => e.id === currentId)
    if (index !== -1) {
      _currentConfigList.splice(index, 1, { ...config, id: currentId })
    }
  }
  updateStorage('configList', _currentConfigList)
  generateConfigList(_currentConfigList)
  gotoIndex()
  setForm({ host: null, style: null })
})

cancelBtn.addEventListener('click', () => {
  setForm({ host: null, style: null })
  gotoIndex()
})

addBtn.addEventListener('click', () => {
  setForm({ host: null, style: null })
  gotoSettings()
})

// 设置表单
function setForm({ host, style }) {
  hostInput.value = host
  styleInput.value = style
}
// 前往设置页面
function gotoSettings() {
  settingsWrapper.style.left = 0
}
// 前往首页
function gotoIndex() {
  settingsWrapper.style.left = '-100%'
}
// 生成配置列表
function generateConfigList(list) {
  const tpl = generateConfigListTpl(list)
  configListWrapper.innerHTML = tpl

  registerConfigListEvent()
}
// 更新数据库
function updateStorage(key, data) {
  chrome.storage.sync.set({
    [key]: data
  })
}
// 配置点击事件处理
function handleCodeEditClick(e) {
  const target = e.target
  const dataset = target.dataset
  const id = Number(dataset.id)

  let config = _currentConfigList.find(e => e.id === id)
  if (config) {
    _currentEditConfig = config
    const { style, host } = config
    settingsWrapper.style.left = 0
    setForm({ host, style })
  }
  console.log('current config')
  console.log(_currentEditConfig)
}
// 配置开关事件处理
async function handleInputSwitchChange(e) {
  const target = e.target
  const dataset = target.dataset
  const id = Number(dataset.id)
  const configList = await getConfigList()
  const itemIndex = configList.findIndex(e => e.id === id)
  if (itemIndex !== -1) {
    const item = configList[itemIndex]
    item.status = target.checked
    updateStorage('configList', configList)
  }
}

// 注册配置点击事件
function registerConfigListEvent() {
  const children = document.querySelectorAll('.config-item-code') || []

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    child.addEventListener('click', handleCodeEditClick)
  }

  const switchChildren = document.querySelectorAll('.switch-input') || []
  
  for (let i = 0; i < switchChildren.length; i++) {
    const child = switchChildren[i]
    child.addEventListener('change', handleInputSwitchChange)
  }
}


// 生成配置模板
function generateConfigListTpl(list) {
  const getItemTpl = ({ host, style, id, status }) => {
    return `
      <div class="config-item">
        <h3 class="config-item-host">
          <span>${host}</span>
          <label class="switch-wrapper">
            ${ 
              status ? 
              `<input class="switch-input" data-id=${id} type="checkbox" checked>` :
              `<input class="switch-input" data-id=${id} type="checkbox">`
            }
            <div class="switch-slider round"></div>
          </label>
        </h3>
        <div class="config-item-code" data-id=${id}>${style}</div>
      </div>
    `
  }

  let html = ''

  for (let item of list) {
    html += getItemTpl(item)
  }

  return html
}

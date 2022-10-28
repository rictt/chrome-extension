const goSettingsBtn = document.querySelector("#goSettings");
const settingsWrapper = document.querySelector("#settings");
const goBackBtn = document.querySelector("#goBack");
const configListWrapper = document.querySelector("#config-list");
const saveBtn = document.querySelector("#save");
const cancelBtn = document.querySelector("#cancel");
const addBtn = document.querySelector("#add");
const hostInput = document.querySelector("#hostInput");
const styleInput = document.querySelector("#styleInput");
const exportBtn = document.querySelector("#export");
const importBtn = document.querySelector("#import");

let _currentConfigList = [];
let _currentEditConfig = null;

const getConfigList = async () => {
  let data = await chrome.storage.sync.get("configList");
  const configList = data.configList;
  _currentConfigList = configList;
  return configList;
};

getConfigList().then((res) => {
  generateConfigList(res);
});

goBack.addEventListener("click", gotoIndex);

const funDownload = (content, fileName) => {
  const a = document.createElement("a");
  a.download = fileName;
  a.style.display = "none";
  const blob = new Blob([content]);
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

exportBtn.addEventListener("click", (e) => {
  getConfigList().then((res) => {
    const content = JSON.stringify(res, null, 4);
    funDownload(content, "CustomExport.json");
  });
});

importBtn.addEventListener("click", (e) => {
  const input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";
  document.body.appendChild(input);
  input.addEventListener("change", (ev) => {
    const target = ev.target;
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const content = JSON.parse(this.result);
      if (Array.isArray(content) === false) {
        console.error("Import error!");
      } else {
        console.log("Import success!");
        updateStorage("configList", content);
        generateConfigList(content);
      }
    };
    reader.readAsText(file);
  });
  input.click();
});

goSettingsBtn.addEventListener("click", gotoSettings);

styleInput.addEventListener("keydown", function (e) {
  if (e.keyCode === 9 || e.key === "Tab") {
    // solution 1
    const value = "  ";
    document.execCommand("insertText", false, value);

    // solution 2
    // have some problem, like after set value, undo is not work
    // https://stackoverflow.com/questions/44471699/how-to-make-undo-work-in-an-html-textarea-after-setting-the-value
    // explain
    // const start = this.selectionStart
    // const end = this.selectionEnd
    // this.value = this.value.substring(0, start) + value + this.value.substring(end)

    e.preventDefault();
  }
});

saveBtn.addEventListener("click", () => {
  const host = hostInput.value;
  const style = styleInput.value;
  const config = {
    host,
    style,
  };
  if (!_currentEditConfig) {
    config.id = Date.now();
    _currentConfigList.push(config);
  } else {
    const currentId = _currentEditConfig.id;
    const index = _currentConfigList.findIndex((e) => e.id === currentId);
    if (index !== -1) {
      _currentConfigList.splice(index, 1, { ...config, id: currentId });
    }
  }
  updateStorage("configList", _currentConfigList);
  generateConfigList(_currentConfigList);
  gotoIndex();
  setForm({ host: null, style: null });
});

cancelBtn.addEventListener("click", () => {
  setForm({ host: null, style: null });
  gotoIndex();
});

addBtn.addEventListener("click", () => {
  setForm({ host: null, style: null });
  gotoSettings();
});

// 设置表单
function setForm({ host, style }) {
  hostInput.value = host;
  styleInput.value = style;
}
// 前往设置页面
function gotoSettings() {
  settingsWrapper.style.left = 0;
}
// 前往首页
function gotoIndex() {
  settingsWrapper.style.left = "-100%";
}
// 生成配置列表
function generateConfigList(list) {
  const tpl = generateConfigListTpl(list);
  configListWrapper.innerHTML = tpl;

  registerConfigListEvent();
}
// 更新数据库
function updateStorage(key, data) {
  chrome.storage.sync.set({
    [key]: data,
  });
}
// 配置点击事件处理
function handleCodeEditClick(e) {
  const target = e.target;
  const dataset = target.dataset;
  const id = Number(dataset.id);

  let config = _currentConfigList.find((e) => e.id === id);
  if (config) {
    _currentEditConfig = config;
    const { style, host } = config;
    settingsWrapper.style.left = 0;
    setForm({ host, style });
  }
  console.log("current config");
  console.log(_currentEditConfig);
}
// 配置开关事件处理
async function handleInputSwitchChange(e) {
  const target = e.target;
  const dataset = target.dataset;
  const id = Number(dataset.id);
  const configList = await getConfigList();
  const itemIndex = configList.findIndex((e) => e.id === id);
  if (itemIndex !== -1) {
    const item = configList[itemIndex];
    item.status = target.checked;
    updateStorage("configList", configList);
  }
}

async function handleCloseClick(e) {
  const target = e.target;
  const dataset = target.dataset;
  const id = Number(dataset.id);
  const configList = await getConfigList();
  const itemIndex = configList.findIndex((e) => e.id === id);
  if (itemIndex !== -1) {
    configList.splice(itemIndex, 1);
    _currentConfigList = configList;
    updateStorage("configList", configList);
    generateConfigList(configList);
  }
}

// 注册配置点击事件
function registerConfigListEvent() {
  const children = document.querySelectorAll(".config-item-code") || [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    child.addEventListener("click", handleCodeEditClick);
  }

  const switchChildren = document.querySelectorAll(".switch-input") || [];

  for (let i = 0; i < switchChildren.length; i++) {
    const child = switchChildren[i];
    child.addEventListener("change", handleInputSwitchChange);
  }

  const removeChildren = document.querySelectorAll(".config-item-close") || [];
  for (let i = 0; i < removeChildren.length; i++) {
    const child = removeChildren[i];
    child.addEventListener("click", handleCloseClick);
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
              status
                ? `<input class="switch-input" data-id=${id} type="checkbox" checked>`
                : `<input class="switch-input" data-id=${id} type="checkbox">`
            }
            <div class="switch-slider round"></div>
          </label>
        </h3>
        <div class="config-item-code" data-id=${id}>${style}</div>
        <div class="config-item-close" data-id=${id}>删除</div>
      </div>
    `;
  };

  let html = "";

  for (let item of list) {
    html += getItemTpl(item);
  }

  return html;
}

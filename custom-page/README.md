# 开始准备

  - 1、搭建基本目录，`manifest, images, popup, options等`
  - 2、配置manifset，`permissions, icons`
  - 3、写代码...

# 需求整理

  写这个插件的原因：浏览一些阅读类网站的时候，总会有那么一块区域悬浮着，影响阅读体验，手动打开控制台去掉元素可以解决，但是每次刷新或者请求新的页面又会重新遮挡住。鉴于以上，想做一款插件，功能如下


  ### `功能如下`

  - 用户可以针对某个网站（域名）进行样式自定义，通过code的形式
  - 保存用户配置，本地化保存
  - 自动生效，提供开关控制

  ### `插件目标用户`

  - 会写一点代码的人，能够打开控制台找元素的
  - 对阅读体验有追求的人

# manifest清单文件

  管理整个插件的配置，如插件名称，插件所需要的api权限，插件的icon等

  ```js
  {
    "name": "Custom Page Plugin",
    "description": "Build an Extension!",
    "version": "1.0",
    "manifest_version": 3,
    "background": {
      "service_worker": "background.js"
    },
    "options_page": "options.html",
    "permissions": ["storage", "activeTab", "scripting"],
    "action": {
      "default_popup": "popup.html",
      "default_icon": {
        "16": "/images/get_started16.png",
        "32": "/images/get_started32.png",
        "48": "/images/get_started48.png",
        "128": "/images/get_started128.png"
      }
    },
    "icons": {
      "16": "/images/get_started16.png",
      "32": "/images/get_started32.png",
      "48": "/images/get_started48.png",
      "128": "/images/get_started128.png"
    }
  }
  ```

# popup页面

# options页面

# debug调试
  
  - 当每次切换的时候，都会注入一份script，造成性能，资源等问题？（用const定义一个变量可以得到报错）
  - 

# 参考文档

 - [quick start写一个chrome插件](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
 - [api reference](https://developer.chrome.com/docs/extensions/reference/)
 - [学会chrome插件调试](https://blog.spoock.com/2016/04/03/chrome-extension-debugging/)
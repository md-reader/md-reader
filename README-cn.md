# Markdown Reader

<img alt="Markdown Reader Logo" src="https://raw.githubusercontent.com/md-reader/md-reader/main/src//images/logo-stroke.svg" align="right" width="120">

[English](./README.md) | 中文 | [한국어](./README-ko.md)

https://md-reader.github.io

[![](https://badgen.net/chrome-web-store/v/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/stars/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/users/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg)

Markdown Reader 是一款强大的浏览器扩展程序，能让你在浏览器中快捷的预览 Markdown 文档。

- **文档格式**: 支持预览 `file://`、`http://`、`https://` 协议以及 `.md`、`.mkd`、`.mdx`、`.markdown` 等扩展名的文件:
  - `https://example.com/example.md`（在线 Markdown 链接）
  - `file:///Users/my-project/readme.markdown`（本地 Markdown 文件，[\*需要开启特定权限](#允许本地文件访问权限)）
- **语法插件**: 支持表情符号、上标/下标、复选框、数学公式、流程图、甘特图、目录、插入内容、缩写、注释、提醒等。
- **主题**: 提供高质量的明暗主题和代码高亮功能。
- **实时刷新**: 支持实时文档变更和居中显示，提升阅读体验。
- **文档组织**: 包含侧边栏目录、原始内容预览和图像媒体预览。
- **快捷键**: 支持通过浏览器扩展快捷键快速调用功能。

![banner](./example/example-1.png)

## 安装

### A. 在浏览器应用商店安装（需要机智上网）

| <a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Chrome.png" alt="Chrome Web Store" style="width:50px"/></a> | <a href="https://microsoftedge.microsoft.com/addons/detail/markdown-reader/djnplooklihmkcioemdjfcednfkpiodc" target="_blank"><img src="./src/images/Edge.png" alt="Edge Add-ons" style="width:50px"/></a> | <a href="https://addons.mozilla.org/firefox/addon/markdown-reader-ext/" target="_blank"><img src="./src/images/Firefox.png" alt="Firefox Add-ons" style="width:50px"/></a> |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                            **Chrome**                                                                                            |                                                                                                 **Edge**                                                                                                  |                                                                                **Firefox**                                                                                 |

### B. 本地构建

以 Chrome 为例：

1. 克隆 `md-reader` 仓库到本地并编译:

   ```bash
   # 克隆本仓库
   git clone https://github.com/md-reader/md-reader.git && cd md-reader

   # 安装依赖
   pnpm install

   # 构建扩展程序
   pnpm build
   ```

2. 构建成功后，`md-reader/dist` 文件夹会生成 `md-reader-xxx.zip` 扩展程序包。

3. 进入 Chrome 的扩展管理页，将扩展程序拖拽进浏览器即可安装。

## 使用

以 Chrome 为例：

安装完成后，此时 Chrome 已经可以预览在线的 markdown 文档了，但是还不可以预览本地的 markdown 文档，需要开启 Chrome 扩展的文件访问权限。

### 允许本地文件访问权限

> 由于 Chrome 出于安全考虑，默认关闭了扩展程序对本地文件的访问权限，所以在安装完插件后需要手动开启权限，这样就可以正常预览本地 markdown 文件了。

在 Chrome 扩展程序管理页中，找到刚刚安装的 `Markdown Reader`，点击 `详细信息`，在详情页找到 `允许访问文件网址` 选项，然后切换为开启状态即可（请放心：`Markdown Reader` 只对 markdown 文件进行读取和展示的操作，不会修改和上传用户文件数据）。

<br/>

现在所有工作都完成啦~！ヾ(◍°∇°◍)ﾉ

打开这个在线文档试一下效果吧：[示例文档](https://raw.githubusercontent.com/md-reader/md-reader/main/example/example.md)；你还可以试试直接将 Markdown 文档 **拖进浏览器**！

欢迎提出你的使用问题和建议。

点一颗星星（star）支持一下也是对我的鼓励哦~！

## Markdown Reader 官方微信公众号

扫码关注获取最新动态与技术支持：

<img src="./src/images/mp-qrcode.jpg" alt="" style="width:220px"/>

## 协议

License [MIT](https://github.com/md-reader/md-reader/blob/main/LICENSE)

© 2018-present, [Bener](https://github.com/Heroor)

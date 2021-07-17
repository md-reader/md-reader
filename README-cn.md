# md-reader

<img src="./src/images/icon.png" align="right" width="120">

[English](./README.md) | 中文

一个可以使 Chrome 预览 MarkDown 文件的浏览器扩展。

> 支持浏览 `file://`，`http://`，`https://` 协议的链接以及 `*.md`，`*.mkd`，`*.markdown` 扩展名的文件。

就像下面的样子:

- `https://example.com/example.md`
- `file://my-project/readme.markdown`

![banner1](./example/example-1.png)

![banner2](./example/example-2.png)

## 安装 & 使用

### 在线安装（需要机智上网）

可以在 [Chrome 扩展商店](https://chrome.google.com/webstore/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) 直接安装。

### 本地安装

1. 克隆这个项目到本地并编译:

    ```bash
    git clone https://github.com/Heroor/md-reader.git
    cd md-reader
    npm install
    npm run build
    ```

2. 进入 Chrome 的扩展管理页，打开 `菜单` -> `更多工具` -> `扩展程序`；

3. 开启右上角 `开发者模式`，然后点击左上角 `加载已解压的扩展程序` 按钮，然后选择刚刚编译好的文件夹： `md-reader/extension`；

### 使用

安装完成后，此时我们的 Chrome 已经可以预览在线的 markdown 文件了，但是预览本地文件还不可以，开启本地文件的访问权限后即可预览本地文件：

> 由于 Chrome 出于安全考虑，默认关闭了插件对本地文件的访问权限，所以我们需要在安装插件后手动开启权限，这样就可以正常预览本地 markdown 文件了。

**开启权限**：在插件管理界面中，找到我们刚刚安装的 `md-reader` 扩展，点击 `详细信息` 按钮，在详情页下边找到 `允许访问文件网址` 选项，然后切换为开启状态即可（请放心：本扩展程序只对 markdown 文件进行读取和展示的操作，不会修改和上传用户文件信息）。

<br/>

这样就大功告成啦~！ヾ(◍°∇°◍)ﾉ

打开这个在线文件试一下效果吧：[https://raw.githubusercontent.com/Heroor/md-reader/main/example/example.md](https://raw.githubusercontent.com/Heroor/md-reader/main/example/example.md)

或者直接将 `*.md` 文件 **拖进浏览器** 试试！

如有使用问题请提出，欢迎 Star~

## 协议

License [MIT](https://github.com/Heroor/md-reader/blob/master/LICENSE)

© 2018-present [Bener](https://github.com/Heroor)

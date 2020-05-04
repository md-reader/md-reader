# md-reader

一个使 chrome 可以预览 markdown 文件的浏览器扩展。

[English](https://github.com/Heroor/md-reader) | 中文

> 支持 `file`，`http`，`https` 三种协议与以 `.md`，`.mkd`，`.markdown` 结尾的访问地址。

![banner](./src/images/banner1-crx.jpg)

下面是预览 markdown 文件的地址的例子:

- `https://***.md`
- `file://***.markdown`

## 安装

### 在线安装（需要机智上网）

点击 [这里](https://chrome.google.com/webstore/detail/medapdbncneneejhbgcjceippjlfkmkg/publish-accepted) 可以在 chrome 扩展商店直接安装。

### 本地安装

1. 首先克隆这个项目到本地:

    ```bash
    git clone https://github.com/Heroor/md-reader.git
    ```

2. 进入Chrome的扩展管理页：打开 `菜单` / `更多工具` / `扩展程序`；

3. 开启右上角 `开发者模式`；

4. 然后点击左上角 `加载已解压的扩展程序` 按钮，然后选择刚刚下载的项目文件夹；

5. 最后一步，此时我们的chrome已经可以预览在线的 markdown 文件了，但是预览本地文件还不行，我们需要开启让扩展程序访问本地文件的权限：

    > 由于 chrome 出于安全考虑，默认限制了插件对本地文件的访问，所以我们需要手动开启，这样就可以正常预览本地的 markdown 文件了。

    开启权限：还是在插件管理界面，找到我们刚刚安装的 `md-reader` 扩展，点击 `详细信息` 按钮，在下边找到 `允许访问文件网址` 选项，然后切换为开启状态即可（请放心：本扩展程序只对 markdown 文件进行读取和展示的操作，不会修改和上传用户信息）。

这样就大功告成啦~！ヾ(◍°∇°◍)ﾉﾞ

打开这个链接试一下效果吧：[https://raw.githubusercontent.com/Heroor/md-reader/master/example.md](https://raw.githubusercontent.com/Heroor/md-reader/master/example.md)

或者直接将 markdown 文件 **拖进浏览器** 试试吧！~(￣▽￣)~

## LICENSE

The MIT License (MIT)

Copyright (c) 2018-present Bener

## 结尾

如有问题请随时提问~ 喜欢记得点star哦~

Bener 献上(◕ˇ∀ˇ◕)

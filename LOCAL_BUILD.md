# Markdown Reader Local

这是基于 `md-reader/md-reader` MIT 开源项目构建的本地版本，增加了本地文件夹目录浏览能力。

## 安装

1. 打开 `chrome://extensions/`。
2. 开启“开发者模式”。
3. 如果商店版 Markdown Reader 仍在运行，先将它停用，避免两个内容脚本同时处理 Markdown 页面。
4. 点击“加载已解压的扩展程序”。
5. 选择 `/Users/bytedance/mxg/work/md-reader/extension`。
6. 打开 `Markdown Reader Local` 的“详情”，开启“允许访问文件网址”。

## 使用

- 直接在 Chrome 打开任意 `.md`、`.mdx`、`.mdc`、`.mkd`、`.markdown` 或 `.txt` 文件，会自动渲染。
- 左侧顶部显示当前文件夹中的 Markdown 文件和子文件夹，当前文件会高亮。
- 子文件夹优先显示；同类条目按最后修改时间倒排，最近新建或修改的文件在最上面。
- 文件夹与正文目录之间的分隔线可上下拖动；比例会自动保存，双击分隔线恢复默认。
- 在地址栏打开 `file:///某个文件夹路径/`，会进入文件夹目录页。
- 点击文件夹后的“上级”，可以向上切换目录。

源码仓库：https://github.com/md-reader/md-reader

# Markdown Reader

<img alt="Markdown Reader Logo" src="https://raw.githubusercontent.com/md-reader/md-reader/main/src//images/logo-stroke.svg" align="right" width="120">

English | [中文](./README-cn.md) | [한국어](./README-ko.md)

https://md-reader.github.io

[![](https://badgen.net/chrome-web-store/v/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/stars/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg) [![](https://badgen.net/chrome-web-store/users/medapdbncneneejhbgcjceippjlfkmkg?icon=chrome&color=607cd2)](https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg)

Markdown Reader is a powerful browser extension that enables you to conveniently preview Markdown documents in your browser.

- **Document Formats**: Preview links in `file://`, `http://`, `https://` and files with `.md`, `.mkd`, `.mdx`, `.markdown` extensions:
  - `https://example.com/example.md` (online Markdown URL)
  - `file:///Users/my-project/readme.markdown` (local Markdown file, \*[requires specific permissions](#allowing-file-access-permission))
- **Syntax Plugins**: Emoji, superscripts/subscripts, checkboxes, math, flowcharts, Gantt charts, TOC, insertions, abbreviations, annotations, alerts.
- **Themes**: High quality light/dark themes and code highlighting.
- **Hot Reloading**: Real-time document changes and centered display for better reading.
- **Document Organization**: Sidebar directory, original content preview, and image media support.
- **Shortcuts**: Quick function invocation with web extension shortcuts.

![banner](./example/example-1.png)

## Installation

### A. Install from web extension Store

<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Chrome.png" style="width:50px"/></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/markdown-reader/djnplooklihmkcioemdjfcednfkpiodc" target="_blank"><img src="./src/images/Edge.png" style="width:50px"/></a>
<a href="https://addons.mozilla.org/firefox/addon/markdown-reader-ext/" target="_blank"><img src="./src/images/Firefox.png" style="width:50px"/></a>
<a href="https://chromewebstore.google.com/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg" target="_blank"><img src="./src/images/Arc.png" style="width:50px"/></a>

### B. Building installation

Example of Chrome:

1. Clone the `md-reader` repository and build it:

   ```bash
   # Clone this repository
   git clone https://github.com/md-reader/md-reader.git && cd md-reader

   # Install dependencies
   pnpm install

   # Build the extension
   pnpm build
   ```

2. After a successful build, the `md-reader/dist` folder will contain the `md-reader-xxx.zip` extension package.

3. Go to the Extensions management page in Chrome and drag the extension into the browser to install it.

## Usage

Example of Chrome:

After installation, Chrome is now able to preview online markdown documents. However, it is not able to preview local markdown documents by default and requires enabling file access permission for the Chrome extension.

### Allowing File Access Permission

> Due to security reasons, Chrome by default disables extension access to local files. Therefore, after installing the plugin, you need to manually enable the permission in order to preview local markdown files.

In the Chrome Extensions management page, locate the installed "Markdown Reader" extension, click on "Details", and find the option "Allow access to file URLs" in the details page. Switch it to the enabled state (Please rest assured that "Markdown Reader" only performs read and display operations on markdown files and will not modify or upload user file data).

<br/>

Now all the work is done~!ヾ(◍°∇°◍)ﾉ

Try the effect by opening this online document: [Example Document](https://raw.githubusercontent.com/md-reader/md-reader/main/example/example.md); You can also try dragging a Markdown document directly into the browser!

Feel free to ask any questions or provide suggestions.

Giving a star to show your support is also an encouragement for me~!

## Join the WeChat Community

Scan the code to get the latest news and technical support:

<img src="./src/images/mp-qrcode.jpg" alt="" style="width:220px"/>

## License

License [MIT](https://github.com/md-reader/md-reader/blob/main/LICENSE)

© 2018-present, [Bener](https://github.com/Heroor)

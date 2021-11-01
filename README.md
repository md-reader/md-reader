# md-reader

<img src="./src/images/icon.png" align="right" width="120">

English | [中文](./README-cn.md) | [한국어](./README-ko.md)

A markdown reader extension for Chrome.

> Support view `file://`, `http://`, `https://` URL and `*.md`, `*.mkd`, `*.markdown` extension files.

Example:

- `https://example.com/example.md`
- `file://my-project/readme.markdown`

![banner1](./example/example-1.png)

![banner2](./example/example-2.png)

## Install & Usage

### Online

Install in the [chrome extension store](https://chrome.google.com/webstore/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg).

### Local

1. Clone this repo and build:

    ```bash
    git clone https://github.com/Heroor/md-reader.git
    cd md-reader
    npm install
    npm run build
    ```

2. Open `Chrome` -> `Menu` -> `More Tools` -> `Extensions`;

3. Open `Developer mode`, click `Load unpacked` button, select folder `md-reader/extension`;

### Usage

After installation, we must set local file access permissions before we can preview local files:

Open `details` page of `md-reader` extension, enabled `Allow access to file URLs`.

<br/>

All right!

Visit this [example.md](https://raw.githubusercontent.com/Heroor/md-reader/main/example/example.md) to test if it works.

Or try dragging and dropping `*.md` file to the Chrome window!

## License

License [MIT](https://github.com/Heroor/md-reader/blob/master/LICENSE)

© 2018-present [Bener](https://github.com/Heroor)

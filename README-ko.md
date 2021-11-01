# md-reader

<img src="./src/images/icon.png" align="right" width="120">

[English](./README.md) | [中文](./README-cn.md) | 한국어

크롬을 위한 마크다운 리더 확장 프로그램.

> `file://`, `http://`, `https://` URL 및 `*.md`, `*.mkd`, `*.markdown` 확장 파일을 지원합니다.

예시:

- `https://example.com/example.md`
- `file://my-project/readme.markdown`

![배너1](./example/example-1.png)

![배너2](./example/example-2.png)

## 설치 및 사용법

### 온라인

[chrome 웹 스토어](https://chrome.google.com/webstore/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg)에서 설치하세요.

### 로컬

1. 이 저장소를 Clone한 후 빌드하세요:

    ```bash
    git clone https://github.com/Heroor/md-reader.git
    cd md-reader
    npm install
    npm run build
    ```

2. 오른쪽 상단의 메뉴에서 `도구 더보기`를 눌러 `확장 프로그램`을 선택하세요.

3. `개발자 모드`를 활성화 하고 `압축해제된 확장프로그램을 로드합니다.` 버튼을 클릭한 다음 `md-reader/extension` 폴더를 선택합니다.

### 사용법

설치 후 로컬 파일을 미리 보려면 먼저 로컬 파일 액세스 권한을 설정해야 합니다.

`세부정보`를 클릭한 후, `md-reader` 확장 프로그램 페이지에서 enabled `파일 URL에 대한 액세스 허용`을 활성화 합니다.

<br/>

다 되었습니다!

[example.md](https://raw.githubusercontent.com/Heroor/md-reader/main/example/example.md) 페이지에서 잘 실행되는지 테스트 해보세요.

아니면 직접 `*.md` 파일을 Chrome창에 드래그 앤 드롭 해보세요!

## 라이선스

License [MIT](https://github.com/Heroor/md-reader/blob/master/LICENSE)

© 2018-present [Bener](https://github.com/Heroor)

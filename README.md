# CoreUI PRO React Admin Template v4

CoreUI is meant to be the UX game changer. Pure & transparent code is devoid of redundant components, so the app is light enough to offer ultimate user experience. This means mobile devices also, where the navigation is just as easy and intuitive as on a desktop or laptop. The CoreUI Layout API lets you customize your project for almost any device – be it Mobile, Web or WebApp – CoreUI covers them all!

## Table of Contents

- [Versions](#versions)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [What's included](#whats-included)
- [Documentation](#documentation)
- [Versioning](#versioning)
- [Creators](#creators)
- [Community](#community)
- [Copyright and License](#copyright-and-license)

## Versions

- [CoreUI Pro Bootstrap Admin Template](https://coreui.io/pro/)
- [CoreUI Pro Angular Admin Template](https://coreui.io/pro/angular)
- [CoreUI Pro React Admin Template](https://coreui.io/pro/react)
- [CoreUI Pro Vue Admin Template](https://coreui.io/pro/vue)

## Quick Start

- [Download the latest release](https://github.com/coreui/coreui-pro-react-admin-template/archive/refs/heads/main.zip)
- Clone the repo: `git clone https://github.com/coreui/coreui-pro-react-admin-template.git`

### Instalation

```bash
$ npm install
```

or

```bash
$ yarn install
```

### Basic usage

```bash
# dev server with hot reload at http://localhost:3000
$ npm start

# if you use Node 17+ use this command instead of `npm start`
$ npm run start:n17
```

or

```bash
# dev server with hot reload at http://localhost:3000
$ yarn start

# if you use Node 17+ use this command instead of `yarn start`
$ yarn start:n17
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build

# if you use Node 17+ use this command instead of `build run build`
$ npm run build:n17
```

or

```bash
# build for production with minification
$ yarn build

# if you use Node 17+ use this command instead of `yarn build`
$ yarn build:n17
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
coreui-pro-react-admin-template
├── public/          # static files
│   └── index.html   # html template
│
├── src/             # project root
│   ├── assets/      # images, icons, etc.
│   ├── components/  # common components - header, footer, sidebar, etc.
│   ├── layouts/     # layout containers
│   ├── scss/        # scss styles
│   ├── views/       # application views
│   ├── _nav.js      # sidebar navigation config
│   ├── App.js
│   ├── ...
│   ├── index.js
│   ├── routes.js    # routes config
│   └── store.js     # template state example
│
└── package.json
```

## Documentation

The documentation for the CoreUI Admin Template is hosted at our website [CoreUI for React](https://coreui.io/react/)

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, CoreUI Free Admin Template is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-pro-react-admin-template/releases) for changelogs for each release version.

## Creators

**Łukasz Holeczek**

- <https://twitter.com/lukaszholeczek>
- <https://github.com/mrholek>
- <https://github.com/coreui>

**CoreUI team**

- https://github.com/orgs/coreui/people

## Community

Get updates on CoreUI's development and chat with the project maintainers and community members.

- Follow [@core_ui on Twitter](https://twitter.com/core_ui).
- Read and subscribe to [CoreUI Blog](https://blog.coreui.ui/).

## Copyright and License

copyright 2023 creativeLabs Łukasz Holeczek.

You must have a valid license purchased to legally use this product for
your projects.

You can buy a license on our website https://coreui.io

# MZD AI-Lab Project Document

Versioning

24/6/19 초안 작성- 손용균

## 코드 스타일 가이드

### **컴포넌트 공통 구조**

0. 컴포넌트 외부

- 정적 요소들 정의
  - ex) Form Field 정의


1. React States
2. React Hooks
3. Custom Hooks
4. Common const / let variables
5. Functions

6. Component Property Objects

   : CoreUI Component 에 필요한 prop 들을 정의

   ex) CSmartTable - columnConfig / css styles property

7. Partitioned Internal Components
   : Return 문 안의 복잡한 컴포넌트 구조를 작은 크기로 분리한 컴포넌트

8. Return

### 컴포넌트 별 구조

JSX
-------

### Page

### DetailForm

- Function 순서 : 기능 중심 정렬

1. **onSubmit**
2. **get api** (include all actions related to fetch data)
3. **post api** (include all actions related to post new data)
4. **put api** (include all actions related to modify data)
5. **delete / restore api** (include all actions related to delete/restore data)
6. **Other Event Handlers** ( ex. open/close modal, inputChanged, etc. )

Service
------

CustomHook
------

PDF
------

Chart
------

Utils
------


# antd-bin

[![NPM version](https://img.shields.io/npm/v/antd-bin.svg?style=flat)](https://npmjs.org/package/antd-bin)

Development tool for ant.design .

----

## 使用说明

### 安装

```bash
$ npm i antd-bin -g
```

### 脚手架

```bash
$ antd init
```

这会创建一个 package.json，此外你还需要在 package.json 中配置 entry 来声明哪些是入口文件，格式详见：http://webpack.github.io/docs/configuration.html#entry

### 本地调试

```bash
$ antd server
```

然后访问 http://127.0.0.1:8000 。

### 构建

```bash
$ antd build
```

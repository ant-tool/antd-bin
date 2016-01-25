# antd-bin

[![NPM version](https://img.shields.io/npm/v/antd-bin.svg?style=flat)](https://npmjs.org/package/antd-bin)

**本项目已废弃，请使用 https://ant-tool.github.io/**

Development tool for [Ant Design](https://github.com/ant-design/ant-design).

----

## 特性

- 基于 webpack 实现
- 支持 ES6 和 less
- 支持通过代理服务器进行调试 (antd-server)
- 支持单元测试 (antd-test)
- 支持自定义配置 webpack.config，[例子](./examples/customize-with-reactcss)

## 使用说明

### 安装

```bash
$ npm i antd-init -g
```

### 脚手架

```bash
$ antd-init
```

这会创建一个 package.json，此外你还需要在 package.json 中配置 entry 来声明哪些是入口文件，格式详见：http://webpack.github.io/docs/configuration.html#entry

### 本地调试

```bash
$ npm run dev
```

然后访问 http://127.0.0.1:8000 。

### 构建

```bash
$ npm run build
```

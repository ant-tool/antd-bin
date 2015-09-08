# History

---

## 0.6.0

- build 支持 `--debug`，不开启压缩
- build 支持 `--watch`，监听文件修改并重新 build
- build 支持 `--output-path`，定制输出路径
- 默认设置 `babel?stage=0`，支持 es7，详见：https://babeljs.io/docs/usage/experimental/
- externals 配置中映射 `react/addon` 到 `window.React`

## 0.5.0

- 默认不开启热替换
- 支持 eslint

## 0.4.0

- 修复热替换的潜在问题
- 自定义配置支持函数的方式，详见 [examples](./examples/customize-with-reactcss)

## 0.3.0

支持热替换（HOT MODULE REPLACEMENT）。

## 0.2.0

支持 webpack 自定义配置的合并，详见 [examples](./examples/customize-with-reactcss)

## 0.1.0

初始版本


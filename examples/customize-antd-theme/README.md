# 修改 Ant Design 的主色系

----

## 使用方法

### 安装依赖

```bash
$ npm install
```

### 本地调试

```bash
$ npm start
```

然后访问 http://127.0.0.1:8000/a.html 。

### 构建

```bash
$ npm build
```

## 颜色配置方式

注意一定要引入 `antd/style/index.less` 文件，而不是默认的 `antd/lib/index.css` 文件。

- 配置在 `package.json` 下的 `theme` 字段。
- 或者建立自定义的 webpack.config.js 文件，将 lessloader 配置如下：

```js
{
  test: /\.less$/,
  loader: ExtractTextPlugin.extract(
    'css?sourceMap!' +
    'autoprefixer-loader!' +
    `less?{"sourceMap":true,"modifyVars":{"primary-color":"#1DA57A"}`
  ),
},
```

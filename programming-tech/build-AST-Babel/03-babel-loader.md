---
title: babel-loader
sidebar_position: 3
---

## 使用webpack babel-loader来进行转换
npm install webpack-cli --save-dev
创建webpack.config.js，编写如下配置
// usage
cd webpack
npm run webpack
可以对比查看babel-cli的转换之后的代码是一致的。
```js
// webpack/webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ["@babel/plugin-transform-arrow-functions", "@babel/plugin-transform-parameters"]
          }
        }
      }
    ]
  }
};
```

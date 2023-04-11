---
title: babel-standalone使用
sidebar_position: 6
---

```
babel-standalone.js是为非NodeJS环境而生的babel库，可以直接在html中，通过<script src='...'></script>方式被引入，它包含了所有babel标准的plugins和presets
```

通常，我们使用官方或是第三方脚手架or打包工具（Webpack、Browserify、Gulp），通过配置化引入babel-loader，在编译阶段就完成了直接翻译，所以，这个js是否多余？

其实不然，这个工具还是有其使用场景的

1. 调试React源码；
2. 在线实时javascript编辑器网站（如 JSFiddle, JS Bin, REPL on the Babel ）；
3. 直接嵌入到应用中，例如：V8 javascript 引擎；
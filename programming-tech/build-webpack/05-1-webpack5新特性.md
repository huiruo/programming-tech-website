---
title: webpack5新特性
sidebar_position: 1
---

为什么在开启增量构建后，有时候 rebuild 还是会很慢呢？原因:

* Webpack 4 中的增量构建只运用到了新增模块与生成 Chunk 产物阶段
* 其他处理过程（如代码压缩）仍需要通过其他方式进行优化，例如分包和压缩插件的缓存。
* 过程中的一些处理会额外增加构建时间，例如生成 Source Map 等。

## 文档
https://webpack.docschina.org/configuration/

Webpack 5 中的变化有很多，完整的功能变更清单参见官方文档，这里我们介绍其中与构建效率相关的几个主要功能点：
* Persistent Caching
* Tree Shaking
* Logs


Webpack 5 中引入的持久化缓存的特性。
## CommonJS Tree Shaking
Webpack 5 中对于 Tree Shaking 的优化也能帮助我们更好地优化项目依赖，减小构建产物的体积。
Webpack 5 中增加了对一些 CommonJS 风格模块代码的静态分析功功能：
* 支持 exports.xxx、this.exports.xxx、module.exports.xxx 语法的导出分析。
* 支持 object.defineProperty(exports, "xxxx", ...) 语法的导出分析。
* 支持 require('xxxx').xxx 语法的导入分析。
```js
//./src/commonjs-module.js

exports.a = 11

this.exports.b = 22

module.exports.c = 33

console.log('module')

//./src/example-tree-commonjs.js

const a = require('./commonjs-module').a

console.log(a)

//./dist/tree-commonjs.js

()=>{var o={263:function(o,r){r.a=11,console.log("module")}}...
```

## Logs
第三个要提到的 Webpack 5 的效率优化点是，它增加了许多内部处理过程的日志，可以通过 stats.logging 来访问。

Webpack 5 构建输出的日志要丰富完整得多。通过这些日志能够很好地反映构建各阶段的处理过程、耗费时间，以及缓存使用的情况。在大多数情况下，它已经能够代替之前人工编写的统计插件功能了。

下面两张图是使用相同配置*stats: {logging: "verbose"}*的情况下，Webpack 4 和 Webpack 5 构建输出的日志：
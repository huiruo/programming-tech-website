---
title: webpack5-Persistent-Caching
sidebar_position: 1
---

为什么在开启增量构建后，有时候 rebuild 还是会很慢呢？原因:

* Webpack 4 中的增量构建只运用到了新增模块与生成 Chunk 产物阶段
* 其他处理过程（如代码压缩）仍需要通过其他方式进行优化，例如分包和压缩插件的缓存。
* 过程中的一些处理会额外增加构建时间，例如生成 Source Map 等。

## Webpack 5特性
[升级文档](https://webpack.docschina.org/migrate/5/)
1. 升级 webpack-cli 到最新的可用版本
2. 升级所有使用到的 plugin 和 loader 为最新的可用版本。
3. 升级废弃的配置项

4. 开始：
```
yarn add webpack@latest
```

Webpack 5(2020 年10 月10 日)，它引入了许多重要的新特性和改进,新特性和改进：
1. **Tree Shaking 改进**：
   Webpack 5 对 Tree Shaking 进行了改进，使其更加有效，可以更好地消除未使用的代码，从而减小最终生成的 bundle 大小。

2. **持久性缓存（Persistent Caching）**：
   Webpack 5 引入了持久性缓存，可以更好地利用缓存来提高构建性能，同时确保构建结果的一致性。

3. **代码分割改进**：
   Webpack 5 改进了代码分割，允许更精细的控制，以及更容易地设置共享模块。

4. **缓存组和 splitChunks 配置**：
   新的 splitChunks 配置和缓存组（cache groups）使得更容易配置代码分割和代码分块的优化。

5. **多个环境配置文件**：
   Webpack 5 允许您使用多个配置文件来处理不同的环境（例如开发环境和生产环境），而不必使用复杂的条件语句。

6. **模块联邦（Module Federation）**：
   模块联邦是 Webpack 5 中的一个重大改进，它允许多个独立的应用程序共享代码，以减小 bundle 大小，提高性能。模块联邦使得在不同应用之间动态加载和共享模块变得更容易。

7. **Top Level Await（顶层 await）**：
   Webpack 5 支持 ES Modules 中的顶层 await，这使得在模块的顶层直接使用 `await` 关键字成为可能，而不需要将其包装在异步函数中。

8. **WebAssembly 支持**：
   Webpack 5 添加了对 WebAssembly 模块的原生支持，可以轻松地将 WebAssembly 模块打包到您的应用程序中，并通过 JavaScript 代码调用它们。

## Webpack 5 中引入的持久化缓存的特性
https://webpack.docschina.org/configuration/

Webpack 5 中的变化有很多，这里介绍其中与构建效率相关的几个主要功能点：
* Persistent Caching: 首次构建耗时增加20%，是二次构建耗时减少90%
```js
cache: {
   type: 'filesystem'
}
```
* Tree Shaking
* Logs


### CommonJS Tree Shaking
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

### Logs
第三个要提到的 Webpack 5 的效率优化点是，它增加了许多内部处理过程的日志，可以通过 stats.logging 来访问。

Webpack 5 构建输出的日志要丰富完整得多。通过这些日志能够很好地反映构建各阶段的处理过程、耗费时间，以及缓存使用的情况。在大多数情况下，它已经能够代替之前人工编写的统计插件功能了。

下面两张图是使用相同配置*stats: {logging: "verbose"}*的情况下，Webpack 4 和 Webpack 5 构建输出的日志：


## 持久化缓存的示例
https://webpack.docschina.org/configuration/cache/

```js
// ./webpack.cache.config.js
...
module.exports = {
  ...
  cache: {

    type: 'filesystem', // 使用文件缓存

    cacheLocation: path.resolve(__dirname, '.appcache'),

    buildDependencies: {

      config: [__filename], // 是将哪些文件 or 目录作为 buildDependencies 如果文件发生改变，则缓存失效

    },

  },
  ...
}
```

可以看到，初次构建完整花费了 3282ms，而在不修改代码进行再次构建的情况下，只花费了不到原先时间的 1/10。在修改代码文件的新情况下也只花费了 628ms，多花费的时间体现在构建被修改的文件的编译上，这就实现了上一课时所寻求的生产环境下的增量构建。


### Cache 基本配置
在 Webpack 4 中，cache 只是单个属性的配置，所对应的赋值为 true 或 false，用来代表是否启用缓存，或者赋值为对象来表示在构建中使用的缓存对象。而在 Webpack 5 中，cache 配置除了原本的 true 和 false 外，还增加了许多子配置项，例如：
* cache.type：缓存类型。值为 'memory'或‘filesystem’，分别代表基于内存的临时缓存，以及基于文件系统的持久化缓存。在选择 filesystem 的情况下，下面介绍的其他属性生效。
* cache.cacheDirectory：缓存目录。默认目录为 node_modules/.cache/webpack。
* cache.name：缓存名称。同时也是 cacheDirectory 中的子目录命名，默认值为 Webpack 的 ${config.name}-${config.mode}。
* cache.cacheLocation：缓存真正的存放地址。默认使用的是上述两个属性的组合：path.resolve(cache.cacheDirectory, cache.name)。该属性在赋值情况下将忽略上面的 cacheDirectory 和 name 属性。

### 单个模块的缓存失效
Webpack 5 会跟踪每个模块的依赖项：fileDependencies、contextDependencies、missingDependencies。当模块本身或其依赖项发生变更时，Webpack 能找到所有受影响的模块，并重新进行构建处理。

这里需要注意的是，对于 node_modules 中的第三方依赖包中的模块，出于性能考虑，Webpack 不会跟踪具体模块文件的内容和修改时间，而是依据依赖包里package.json 的 name 和 version 字段来判断模块是否发生变更。因此，单纯修改 node_modules 中的模块内容，在构建时不会触发缓存的失效。

### 全局的缓存失效
当模块代码没有发生变化，但是构建处理过程本身发生变化时（例如升级了 Webpack 版本、修改了配置文件、改变了环境变量等），也可能对构建后的产物代码产生影响。因此在这种情况下不能复用之前缓存的数据，而需要让全局缓存失效，重新构建并生成新的缓存。在 Webpack 5 中共提供了 3 种不同维度的全局缓存失效配置。

* buildDependencies
第一种配置是cache.buildDependencies，用于指定可能对构建过程产生影响的依赖项。
```
它的默认选项是{defaultWebpack: ["webpack/lib"]}。这一选项的含义是，当 node_modules 中的 Webpack 或 Webpack 的依赖项（例如 watchpack 等）发生变化时，当前的构建缓存即失效。

配置文件中的 buildDependencies 还支持增加另一种选项 {config: [__filename]}，它的作用是当配置文件内容或配置文件依赖的模块文件发生变化时，当前的构建缓存即失效。
```
* version
第二种配置是 cache.version。当配置文件和代码都没有发生变化，但是构建的外部依赖（如环境变量）发生变化时，预期的构建产物代码也可能不同。这时就可以使用 version 配置来防止在外部依赖不同的情况下混用了相同的缓存。例如，可以传入 cache: {version: process.env.NODE_ENV}，达到当不同环境切换时彼此不共用缓存的效果。

* name
缓存的名称除了作为默认的缓存目录下的子目录名称外，也起到区分缓存数据的作用。例如，可以传入 cache: {name: process.env.NODE_ENV}。这里有两点需要补充说明：
```
name 的特殊性：与 version 或 buildDependencies 等配置不同，name 在默认情况下是作为缓存的子目录名称存在的，因此可以利用 name保留多套缓存。在 name 切换时，若已存在同名称的缓存，则可以复用之前的缓存。与之相比，当其他全局配置发生变化时，会直接将之前的缓存失效，即使切换回之前已缓存过的设置，也会当作无缓存处理。

当 cacheLocation 配置存在时，将忽略 name 的缓存目录功能，上述多套缓存复用的功能也将失效。
```

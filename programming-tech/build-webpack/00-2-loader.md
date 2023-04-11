---
title: loader
sidebar_position: 1
---

# Loader 配置处理模块的规则
webpack本身只能理解JavaScript语法，因此只能对js文件进行直接的文件合并、压缩处理。然而实际开发中会用到各种其他类型的文件，如 css、less、jpg、jsx、vue 等等类型的文件，webpack本身是无法处理这些类型文件的，此时就需要借助各种文件的loader（加载器）。loader 的作用就是将各种类型的文件转换成 webpack 能够处理的模块

需要注意的是由于 loader 是从右往左执行的，一个 loader 处理完的结果会交给下一个 loader 继续处理，就像一条工厂流水线一样，所以加载器数组存在一定的次序，配置的时候就需要注意书写的loader次序。 此外有一个在实际中接触得非常多且非常重要的 loader，那就是 babel-loader，其可以将es6语法转换成能普遍被浏览器所执行的es5，几乎用到es6语法的项目都会有所接触。

一个实际开发中经常接触到的例子：项目中使用了 less 语法，就需要使用 less-loader 去将其转译为 css，然后通过 css-loader 去加载 css 文件，处理后交给 style-loader，最后把资源路径写入到 html 中的 style 标签内生效。
```js
module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'less-loader']
    }]
},
```



loader 是转译模块源代码的转换规则。 loader 被编写为，接受源代码作为参数的函数， 并返回这些转换过的新版本代码。

loader 用于对模块的源代码进行转换。loader 可以使你在 import 或 "load(加载)" 模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的得力方式。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件！
```
https://webpack.docschina.org/loaders/
https://webpack.docschina.org/concepts/loaders
```

Webpack 支持使用 loader 对文件进行预处理。你可以构建包括 JavaScript 在内的任何静态资源。并且可以使用 Node.js 轻松编写自己的 loader。

```
https://webpack.docschina.org/loaders/
```

module:配置处理模块的规则,配置文件时使用哪些Loader去加载和转换

1. 三种方式：
条件匹配:通过test,include,exclude,来选中loader要应用规则的文件
2. 应用规则：对选中的文件通过use 配置项来应用 Loader,
use: use是每一个rule的属性，指定要用什么loader
test:该属性标识应该转换哪个或哪些文件。
include: 包含某文件
exclude: 排除某文件

noParse:忽略对部分没采用模块化的文件的递归解析和处理。提高构建性能。
一些库如lodash,chartJS大而没采用模块化标准让webpack 解析耗时又没意义,使用该属性让 Webpack不扫描该文件，以提高整体的构建速度。
```js
module.exports = {
    module: {
      noParse: /jquery|lodash/, // 正则
      noParse: function(content) {
        return /jquery|lodash/.test(content)
      }
    }
}
```


parser:细粒度地配置哪些模块被哪些模块解析

### 常用loader
1.样式相关，如下所示：
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS；
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性；
- postcss-loader：CSS 后处理器 postcss 的 loader；
- less-loader：把 less 代码转换成 CSS 代码；
- sass-loader：把 SCSS/SASS 代码转换成 CSS 代码；

2.JavaScript 相关，如下所示：
- babel-loader：把 ES6 转换成 ES5；
- script-loader：可以将指定的模块 JavaScript 文件转成纯字符串通过 eval 方式执行；
- exports-loader：可以导出指定的对象，例如 window.Zepto；
- ts-loader：把 TypeScript 转换成 JavaScript；
- imports-loader：将任意三方的对象添加到 window 对象中。


3.静态资源相关，如下所示：
raw-loader：把文本文件的内容加载到代码中去；
file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件；
url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64的方式把文件内容注入到代码中去；
html-loader：HTML 语法的 loader，可以处理 HTML 中的图片、CSS等；
svg-url-loader：把压缩后的 SVG 内容注入到代码中；
markdown-loader：把 Markdown 文件转换成 HTML；
ejs-loader：把 EJS 模版编译成函数返回；
pug-loader：把 Pug 模版转换成 JavaScript 函数返回；
image-webpack-loader：加载并且压缩图片文件；
csv-loader：加载 csv 文件内容；
xml-loader：加载 xml 文件内容。


工程相关，如下所示：
eslint-loader：通过 ESLint 检查 JavaScript 代码；
tslint-loader：通过 TSLint 检查 TypeScript 代码；
mocha-loader：加载 Mocha 测试用例代码。

### css-loader 和 style-loader 的区别和使用
```
webpack是用JS写的，运行在node环境，所以默认webpack打包的时候只会处理JS之间的依赖关系
因为像 .css 这样的文件不是一个 JavaScript 模块，你需要配置 webpack 使用 css-loader 或者 style-loader 去合理地处理它们;

css-loader: 加载.css文件

style-loader:使用<style>将css-loader内部样式注入到我们的HTML页面

style-loader 是通过一个JS脚本创建一个style标签，里面包含一些样式。style-loader是不能单独使用的，应为它并不负责解析 css 之前的依赖关系，每个loader的功能都是单一的，各自拆分独立。
```

```js
const path = require('path');

module.exports = {
  // JS 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    strictExportPresence: true,
    rules: [
        {
          // 用正则去匹配要用该 loader 转换的 css 文件
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
            ),
            presets: [
              [
                require.resolve('babel-preset-react-app'),
                {
                  runtime: hasJsxRuntime ? 'automatic' : 'classic',
                },
              ],
            ],

            plugins: [
              isEnvDevelopment &&
              shouldUseReactRefresh &&
              require.resolve('react-refresh/babel'),
            ].filter(Boolean),
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
            compact: isEnvProduction,
          },
        },
    ]
  }
};
```

# 常见优化构建
## 优化loader配置
通过减少loader作用范围，大大缩短构建时间。例如Babel，由于Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率就越低。因此我们直接指定哪些文件不通过loader处理,或者指定哪些文件通过loader处理：
```js
const path = require('path')
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        use: ['babel-loader'],
        // 只处理src文件夹下面的文件
        include: path.resolve('src'),
        // 不处理node_modules下面的文件，node_modules 中使用的代码都是编译过的，所以我们也完全没有必要再去处理一遍。
        exclude: /node_modules/
      }
    ]
  }
}
```

另外，对于babel-loader，我们还可以将 Babel 编译过的文件缓存起来，下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间。
```js
module.exports = {
  loader: 'babel-loader?cacheDirectory=true'
}
```
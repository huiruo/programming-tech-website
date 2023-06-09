---
title: loader
sidebar_position: 1
---

## Loader 配置处理模块的规则
webpack只能对js文件进行直接的文件合并、压缩处理。然而实际开发中会用到各种其他类型的文件，如 css、less、jpg、jsx、vue 等等类型的文件，webpack本身是无法处理这些类型文件的，此时就需要借助各种文件的loader（加载器）。

loader 的作用就是将各种类型的文件转换成 webpack 能够处理的模块

需要注意的是由于 loader 是从右往左执行的，一个 loader 处理完的结果会交给下一个 loader 继续处理，就像一条工厂流水线一样，所以加载器数组存在一定的次序，配置的时候就需要注意书写的loader次序。 

接受源代码作为参数的函数，并返回这些转换过的新版本代码。

loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件！babel-loader将es6语法转换成能普遍被浏览器所执行的es5。

一个实际开发中经常接触到的例子：项目中使用了 less 语法，就需要使用 less-loader 去将其转译为 css，然后通过 css-loader 去加载 css 文件，处理后交给 style-loader，最后把资源路径写入到 html 中的 style 标签内生效。
```js
module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'less-loader']
    }]
},
```


可以使用 Node.js 编写自己的 loader

https://webpack.docschina.org/loaders/

https://webpack.docschina.org/concepts/loaders

## loader参数

module:配置处理模块的规则,配置文件时使用哪些Loader去加载和转换

1. 三种方式：条件匹配:通过test,include,exclude,来选中loader要应用规则的文件
2. 应用规则：对选中的文件通过use 配置项来应用 Loader,
```
use: use是每一个rule的属性，指定要用什么loader
test:该属性标识应该转换哪个或哪些文件。
include: 包含某文件
exclude: 排除某文件
noParse:忽略对部分没采用模块化的文件的递归解析和处理。提高构建性能。
parser:细粒度地配置哪些模块被哪些模块解析
```

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

### css-loader和style-loader区别和使用
默认webpack打包的时候只会处理JS之间的依赖关系,`.css`文件不是一个 JavaScript 模块，你需要配置 webpack 使用 css-loader 或者 style-loader 去合理地处理它们
```
css-loader: 加载.css文件,并输出数组
style-loader: style-loader的作用是把 CSS 插入到 DOM 中，就是处理css-loader导出的模块数组
```
```js
const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
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
            cacheDirectory: true,
            cacheCompression: false,
            compact: isEnvProduction,
          },
        },
    ]
  }
};
```

## 优化loader配置
通过减少loader作用范围，大大缩短构建时间。

例如Babel，由于Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率就越低。<br/>
因此我们直接指定哪些文件不通过loader处理,或者指定哪些文件通过loader处理：
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

## Loader负责文件转换，Plugin负责功能扩展
webpack基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务，从而实现自己想要的功能。

compiler和compilation是Webpack两个非常核心的对象，其中compiler暴露了和 Webpack整个生命周期相关的钩子（compiler-hooks），而compilation则暴露了与模块和依赖有关的粒度更小的事件钩子（Compilation Hooks）。

* webpack-merge
```
随着我们业务逻辑的增多，图片、字体、css、ES6以及CSS预处理器和后处理器逐渐的加入到我们的项目中来，进而导致配置文件的增多，使得配置文件书写起来比较繁琐，更严重者（书写特定文件的位置会出现错误）。更由于项目中不同的生产环境和开发环境的配置，使得配置文件变得更加糟糕。
分离配置文件
我们在根目录下创建config文件夹，并创建四个配置文件：

webpack.comm.js 公共环境的配置文件
webpack.development.js 开发环境下的配置文件
webpack.production.js 生产环境下的配置文件
webpack.parts.js 各个配置零件的配置文件
```

```js
const merge = require("webpack-merge");
const parts = require("./webpack.parts")    //引入配置零件文件
const config = {
    //书写公共配置
}
module.exports = merge([
    config,
    parts......
])
```

* webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件，在此之前是使用 uglifyjs-webpack-plugin

* optimize-css-assets-webpack-plugin 插件来压缩 css，其默认使用的压缩引擎是 cssnano。

* webpack默认会将css当做一个模块打包到一个chunk中，extract-text-webpack-plugin的作用就是将css提取成独立的css文件
```js
// 首先安装和引入：
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 注册：
new ExtractTextPlugin({
    filename: 'css/[name].css',
})

// 注册之后，还要在css的loader中使用：
{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        use: ['css-loader','postcss-loader','less-loader'],
        // 使用vue时要用这个配置
        fallback: 'vue-style-loader',  
    })
},
```


* 借助 image-webpack-loader 帮助我们来实现。它是基于 imagemin 这个 Node 库来实现图片压缩的。只要在 file-loader 之后加入 image-webpack-loader 即可

* webpack.optimize.UglifyJsPlugin

* html-webpack-plugin:webpack 打包后自动生成 html 页面
```js
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        // 用正则去匹配要用该 loader 转换的 css 文件
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          // 转换 .css 文件需要使用的 Loader
          use: ['css-loader'],
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: `[name]_[contenthash:8].css`,
    }),
  ]
};
```

Webpack 内置的插件，如下所示：
```
webpack.DefinePlugin：定义全局常量插件；
webpack.EnvironmentPlugin：定义环境变量插件；
webpack.BannerPlugin：在代码中添加版权注释等；
webpack.DllPlugin：使用 DLL 思想来加快编译速度的插件；
webpack.HashedModuleIdsPlugin：可以修改文件 Hash 算法的插件；
webpack.optimize.SplitChunksPlugin：代码拆分优化插件；
webpack.HotModuleReplacementPlugin：开启模块热替换功能，通过监听文件变化并自动加载被修改的文件来减少烦人的浏览器手动重新加载；
webpack.ProgressPlugin：构建进度插件；
webpack.ProvidePlugin：自动加载模块，例如出现 $ 则加载 jQuery 等常用库；
webpack.IgnorePlugin：用于忽略部分文件

非内置的插件，如下所示：
mini-css-extract-plugin：CSS 文件提取，并且在生产环境构建是可以用于优化 CSS 文件大小；
optimize-css-assets-webpack-plugin：压缩 CSS 文件；
clean-webpack-plugin：在编译之前清理指定目录指定内容；
html-webpack-plugin：html 插件，可以根据 JavaScript模板文件生成 HTML；
preload-webpack-plugin：html-webpack-plugin 的插件，给页面添加 <link rel="preload"> 资源；
i18n-webpack-plugin：帮助网页做国际化的插件；
webpack-manifest-plugin：生成 Webpack 打包文件清单的插件；
html-webpack-inline-source-plugin：在 HTML 中内联打包出来的资源；
webpack-bundle-analyzer：webpack bundle 分析插件；
copy-webpack-plugin：文件拷贝插件，可以指定文件夹的文件复制到 output文件夹，方便打包上线；
terser-webpack-plugin：JavaScript代码压缩插件，这个插件兼容 ES6 语法，推荐使用这个插件，而不是用 uglifyjs；
serviceworker-webpack-plugin：生成 PWA service worker 插件；
hard-source-webpack-plugin：通过缓存提升非首次编译速度；
friendly-errors-webpack-plugin：减少 Webpack 无用的构建 log；
stylelint-webpack-plugin：StyleLint 的插件。
```
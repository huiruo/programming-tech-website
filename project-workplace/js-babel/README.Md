## babel 原理
Babel 是一款 JavaScript 编译器，它可以把 ECMAScript 2015+ 的代码转译成低版本兼容的代码。
任何一个编译器工作流程大致都可以分为如下三步：

- Parser 解析源文件

- Transfrom 转换

- Generator 生成新文件

code ---->Parser (通过@babel/parser)  ===== AST --------->Transfrom (通过@babel/traverse) =========AST ---------> Generator (通过@babel/generator)  =====得到最后的code

因为 Babel 使用是acorn:https://github.com/acornjs/acorn
这个引擎来做解析，这个库会先将源码转化为抽象语法树 (AST)，再对 AST 作转换，最后将转化后的 AST 输出，便得到了被 Babel 编译后的文件。
那 Babel 是如何知道该怎么转化的呢？答案是通过插件，Babel 为每一个新的语法提供了一个插件，在 Babel 的配置中配置了哪些插件，就会把插件对应的语法给转化掉。插件被命名为 @babel/plugin-xxx 的格式。

## 补充
Babel 编译的代码使用的 CommonJS 模块标准和es5写法，所以在浏览器会报错。
es6 模块化：import,export
CommonJS: require,module.exports

为了将babel生成的 CommonJS模块规范的es5能在浏览器运行，在webpack打包会有一套loader专门来处理，转换成浏览器可运行的代码；

Babel 是一个编译器，并不是一个构建器，如果想要构建代码，应该使用 webpack、rollup.js 或 Brunch 等构建工具

## 创建项目
```text
添加package.json文件： 
npm init -y

官方安装
npm install --save-dev @babel/core @babel/cli @babel/preset-env

Babel 原生的 @babel/cli 来编译文件，实际使用中，更多的是
结合 webpack、rollup 这样第三方的工具来使用的。

可能需要这个依赖：
npm install --save core-js
```

babel.config.json
```js
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
/*
@babel/env 是 Babel 的环境配置；

1.targets 是目标浏览器的兼容版本号，可以看到配置了 edge、firefox、chrome 和 safari 浏览器的版本号；

2.useBuiltIns 配置了是否构建缺失的功能，构建时会把必须的 Polyfill 插入到文件中；

3.corejs 标记了使用的是那个版本的 corejs 来获取 Polyfill。
*/
```

## 转换
npm install --save @babel/traverse

## 增加 babel 命令来编译 src 目录下的文件到 dist 目录：
```json
  "scripts": {
    "babel": "babel src --out-dir dist",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

## 增加 Babel 配置文件
在工程的根目录添加 babel.config.js 文件，增加 Babel 编译的配置，没有配置是不进行编译的

例中 debug 配置是为了打印出 Babel 工作时的日志，可以方便的看来，Babel 转化了哪些语法。

presets 主要是配置用来编译的预置，plugins 主要是配置完成编译的插件

## babel 组成
没有plugins，babel将啥事也做不了。

babel提供了丰富的插件来对不同时期的代码进行转换。例如我们在es6最常使用的箭头函数，当需要转化为es5版本时，就用到了arrow-functions这个插件。

具体的插件列表，可以查看plugins。

presets的中文翻译为预设，即为一组插件列表的集合，我们可以不必再当独地一个一个地去添加我们需要的插件。比如我们希望使用es6的所有特性，我们可以使用babel提供的ES2015这个预设。
## （1）@babel/preset-env


## 2.@babel/polyfill
## （3）@babel/plugin-transform-runtime
在编译的过程中，对于 built-in 类型的语法通过 require("core-js/modules/xxxx") polyfill 的方式来兼容，对于 syntax 类型的语法在转译的过程会在当前模块中注入类似 _classCallCheck 和 _defineProperty 的 helper 函数来实现兼容。对于一个模块而言，可能还好，但对于项目中肯定是很多模块，每个模块模块都注入这些 helper 函数，势必会造成代码量变得很大。

而 @babel/plugin-transform-runtime 就是为了复用这些 helper 函数，缩小代码体积而生的。当然除此之外，它还能为编译后的代码提供一个沙箱环境，避免全局污染。
```
①安装
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime

其中 @babel/plugin-transform-runtime 是编译时使用的，安装为开发依赖，而 @babel/runtime 其实就是 helper 函数的集合，需要被引入到编译后代码中，所以安装为生产依赖

②修改 Babel plugins 配置，增加@babel/plugin-transform-runtime
```

```js
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true,
      useBuiltIns: 'usage',
      corejs: 3,
      targets: {}
    }
  ]
]
const plugins = [
  '@babel/plugin-proposal-class-properties',
  [
    '@babel/plugin-transform-runtime'
  ]
]
 
module.exports = { presets, plugins }
```
---
title: resolve-devServer-等参数
sidebar_position: 1
---

## resolve 配置 Webpack 解析模块时应该去哪些目录中查找模块
https://webpack.docschina.org/configuration/resolve/

https://webpack.docschina.org/concepts/module-resolution

默认情况下，Webpack 会从当前文件所在的目录开始，逐级向上查找 node_modules 文件夹，直到找到模块或达到文件系统的根目录。但有时候，你可能希望将一些额外的目录添加到模块解析的搜索路径中，以便轻松引用模块。

resolve.modules 配置选项允许你指定一个包含目录路径的数组，Webpack 会按照数组中的顺序依次查找模块。例如，你可以这样配置：
```js
module.exports = {
  // ...
  resolve: {
    modules: ['src', 'node_modules'],
  },
};
```

### 属性汇总
* extensions：extensions 选项允许你指定在导入模块时可以省略的文件扩展名。这有助于简化导入语句，例如，如果你设置了 .js，.jsx，和 .json，你可以在导入模块时省略这些扩展名。示例：

* alias：允许你创建模块的别名，以便更容易地引用模块。这在处理深层次的文件结构时特别有用。

* modules：用于指定解析模块时要搜索的目录。默认情况下，Webpack 会从当前文件所在的目录开始向上递归查找 node_modules 文件夹。通过这个选项，你可以添加额外的目录路径，以便更轻松地引用模块。

* mainFields：指定导入模块时 Webpack 应该使用的字段。例如，当你导入一个包时，Webpack 会根据这个配置来决定使用包的哪个入口文件。

```js
module.exports = {
  // ...其他配置
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    modules: ['node_modules', 'src'],
    mainFields: ['browser', 'module', 'main'],
    symlinks: false,
  },
};
```

### mainFields配置
mainFields 的作用是告诉 Webpack 在多个字段中选择哪一个字段来作为模块的入口点。这在处理不同模块类型或环境时非常有用，因为不同的字段可能指向不同的入口文件。
* main：通常用于 CommonJS 环境，指定模块的主要入口文件。这是默认的字段。
* module：用于 ES6 模块环境，指定模块的入口文件。
* browser：用于浏览器环境，指定模块的浏览器版本入口文件。
```js
/*
Webpack 将首先查找 browser 字段，然后是 module 字段，最后是 main 字段。如果找到了一个字段对应的入口文件，Webpack 将使用该字段的入口文件来解析模块。

这使你能够更好地支持不同环境下的模块导入，而不需要手动处理不同的入口文件。
*/
module.exports = {
  // ...其他配置
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  },
};
```

### 在resolve.modules指定的所有目录中检索模块
* alias:通过别名来将导入路径映射成一个新的导入路径
* extensions:当没有文件后缀，webpack配置在尝试过程中用到地后缀列表

```js
resolve: {
  extensions: ['.js', '.jsx'],
  mainFiles: ['index', 'list'],
  alias: {
    'com': resolve('src/components'),
    'mod': resolve('src/modules'),
    'util': resolve('src/util'),
    '@': resolve('src')
  },
  modules: [
    path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
    'node_modules', // 将默认写法放在后面
  ]
},
```

### resolve.extensions 配置
在导入没带文件后缀的路径时，webpack 会自动带上后缀去尝试询问文件是否存在，而 resolve.extensions 用于配置尝试后缀列表；
默认为 extensions:['js','json'];

当遇到 require('./data')时 webpack 会先尝试寻找 data.js，没有再去找 data.json；如果列表越长，或者正确的后缀越往后，尝试的次数就会越多；

所以在配置时为提升构建优化需遵守：

- 频率出现高的文件后缀优先放在前面；
- 列表尽可能的小；
- 书写导入语句时，尽量写上后缀名

因为项目中用的 jsx 较多，所以配置 extensions: [".jsx",".js"],

### webpack 能解析三种文件路径：
* 绝对路径,由于已经获得文件的绝对路径，因此不需要再做进一步解析。
```js
import '/home/me/file';

import 'C:\\Users\\me\\file';
```

* 相对路径,使用 import 或 require 的资源文件所处的目录，被认为是上下文目录。在 import/require 中给定的相对路径，会拼接此上下文路径，来生成模块的绝对路径。
```js
import '../src/file1';
import './file2';
```

* 模块路径,在 resolve.modules 中指定的所有目录中检索模块。 你可以通过配置别名的方式来替换初始模块路径，具体请参照 resolve.alias 配置选项。
```js
import 'module';
import 'module/lib/file';
```

## DevServer
只有通过 DevServer 启动webpack时，配置文件里面的DevServer才会生效

hot:模块热替换，将在不刷新整个页面通过做到实时预览

port:服务监听接口，默认8080

inline

historyApiFallback:

compress:是否使用Gzip压缩

open:自动打开浏览器访问

```js
devServer:{
	https:true
}
```

## devtool：如何生成 Source Map

## 其他-Entry-Output
* Entry 配置模块的入口
```js
entry: {
    app: ["babel-polyfill", "./src/index.js"]
},
```

* Output 配置如何输出:
1.output.filename.配置输出文件的名称，string 类型

2.path

3.publicPath 配置发布到线上资源 url 前缀，（在复杂的项目可能会有一些构建出的资源需要异步加载）
```js
output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
    publicPath: process.env.BUILD_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath
},
```
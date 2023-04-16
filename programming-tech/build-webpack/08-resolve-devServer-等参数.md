---
title: resolve-devServer-等参数
sidebar_position: 1
---

## resolve 配置模块如何解析
https://webpack.docschina.org/configuration/resolve/

https://webpack.docschina.org/concepts/module-resolution

在 resolve.modules 中指定的所有目录中检索模块。 

可以通过配置别名的方式来替换初始模块路径，具体请参照 resolve.alias 配置选项。

* 如果 package 中包含 package.json 文件，那么在 resolve.exportsFields 配置选项中指定的字段会被依次查找，package.json 中的第一个字段会根据 package 导出指南确定 package 中可用的 export。

一旦根据上述规则解析路径后，resolver 将会检查路径是指向文件还是文件夹。如果路径指向文件：
* 如果文件具有扩展名，则直接将文件打包。
* 否则，将使用 resolve.extensions 选项作为文件扩展名来解析，此选项会告诉解析器在解析中能够接受那些扩展名（例如 .js，.jsx）。

如果路径指向一个文件夹，则进行如下步骤寻找具有正确扩展名的文件：
* 如果文件夹中包含 package.json 文件，则会根据 resolve.mainFields 配置中的字段顺序查找，并根据 package.json 中的符合配置要求的第一个字段来确定文件路径。
* 如果不存在 package.json 文件或 resolve.mainFields 没有返回有效路径，则会根据 resolve.mainFiles 配置选项中指定的文件名顺序查找，看是否能在`import/require`的目录下匹配到一个存在的文件名。
* 然后使用 resolve.extensions 选项，以类似的方式解析文件扩展名。

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

## 在resolve.modules指定的所有目录中检索模块
```
alias:通过别名来将导入路径映射成一个新的导入路径
extensions:当没有文件后缀，webpack配置在尝试过程中用到地后缀列表
```

```js
extensions:['.js','.json']
```

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
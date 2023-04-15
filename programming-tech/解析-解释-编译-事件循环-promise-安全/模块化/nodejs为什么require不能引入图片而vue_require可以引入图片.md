---
title: 前端 require
sidebar_position: 9
---

## nodejs为什么require不能引入图片而vue_require可以引入图片
```
Vue/React 项目能 require 图片是因为用了 webpack 的 image loader

首先require是commonjs模块的概念，require能加载.js,.json,.node的扩展名，具体你可以了解下node的模块机制。然后vue为什么能引入图片，是因为vue使用了webpack，webpack会将识别require或者import将其转换成自己的webpack模块，比如require转换成__webpack_require__。

但是webpack只能识别JS，所以webpack有个重要的概念Loader，通过file-loader或者url-loader就能识别非js的图片文件。其实打包的时候都使用到Nodejs的功能，webpack的loader内部原理也是。我不知道你图片用来干嘛，但是Nodejs中图片应该用fs文件模块去处理
```

为什么node 不require图片？
```
vue 里面 require 图片返回的是图片最后打包发布的 url，那你在 node require 图片是想拿到什么? 图片的路径? 那为毛不直接写路径?

你可以打印一下 require.extensions 查看 node 支持的模块后缀名。任何语法的存在必须有其存在的意义，那你说 node require 图片有什么意义? 返回图片二进制 buffer? 那为啥不用 fs 模块读取?
```

## vue项目，本质上其实是webpack项目
利用webpack的各类加载器(loader)，可以把任意资源作为模块引入

两个require不是一个意思，一个被webpack处理成图片引入了。

另一个node里，你是要处理图片的数据呢？直接用读取文件就行。

处理图片文件？直接用path引用就行。

后端用图片又不用拿来显示的。

vue.js开发依赖的环境需要node.js，比如需要依赖webpack+babel构建依赖打包（本身webpack就是在node.js环境下运行的），webpack也会在开发环境中生成webpack-dev-server给开发用。vue也依赖需要依赖npm生态的各种包。

---
title: babel插件-transform-runtime
sidebar_position: 4
---

## 总结
- 推荐使用babel.config.js来作为整个项目的babel配置，.babelrc更加适用于monorepo项目
- babel的编译基本都是依赖于plugin，preset是一组plugin的集合
- polyfill为一些较老的浏览器提供一些新特性的支持
- transform-runtime可以提取一些帮助函数来减小打包的体积，在开发自己的类库建议开启corejs选项

## `@babel/plugin-transform-runtime`的主要有三个用处
> 帮助减小输出文件大小，并解决一些运行时问题，例如生成器函数和异步函数的支持。

@babel/plugin-transform-runtime 是 Babel 插件之一，用于改善 JavaScript 代码的转译过程，并减小转译后的代码大小。它的主要作用是解决一些与 JavaScript 运行时相关的问题，特别是在使用新特性和内置函数时引入的一些辅助函数，以及多次在代码中重复引入这些辅助函数的问题。

1. 自动引入@babel/runtime/regenerator，当你使用了generator/async
函数(通过regenerator选项打开，默认为true)

2. 提取一些babel中的工具函数来达到减小打包体积的作用

3. 如果开启了corejs选项(默认为false)，会自动建立一个沙箱环境，避免和全局引入的polyfill产生冲突。

这里说一下第三点，当开发自己的类库时，建议开启corejs选项，因为你使用的polyfill可能会和用户期待的产生冲突。一个简单的比喻，你开发的类库是希望兼容ie11的，但是用户的系统是主要基于chrome的，根本就不要去兼容ie11的一些功能，如果交给用户去polyfill，那就的要求用户也必须要兼容ie11，这样就会引入额外的代码来支持程序的运行，这往往是用户不想看到的。


dev dependence
```
npm install --save-dev @babel/plugin-transform-runtime
```
 
production dependence
因为我们需要在生产环境中使用一些runtime的helpers
```
npm install --save @babel/runtime
```

.babelrc
```js
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```

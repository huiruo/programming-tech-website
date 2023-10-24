---
title: babel-编译构建之preset属性值modules
sidebar_position: 7
---

## `@babel/preset-env`作用

@babel/preset-env 是 Babel 中的一个预设（preset），它的作用是根据目标环境（通常是目标浏览器或 Node.js 版本）来自动转译（transpile）你的 JavaScript 代码，以确保你的代码在目标环境中能够运行。

具体来说，@babel/preset-env 可以根据你配置的目标环境自动选择合适的 Babel 插件和转译规则，以处理现代 JavaScript 语法、新特性和 API，使它们在旧版浏览器或 Node.js 中也能正常运行。这有助于确保你的代码在各种浏览器和 Node.js 版本中具有跨浏览器和跨平台的兼容性。

你可以在项目的 Babel 配置文件中设置 @babel/preset-env 的目标环境，例如：
```js
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead"
    }]
  ]
}
```

## 一次升级中的`preset-env`造成的报错

在升级@babel/preset-env 之前，项目中的配置是这样的：

```js
{
  test: /\.(ts|js)x?$/,
  include: [
    path.resolve(__dirname, '../src'),
    /node_modules[\\/]antd/,
  ],
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        cacheCompression: false,
      },
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    }
  ],
}
```

## 问题:exports is undefined

升级@babel/preset-env 之后，babel-loader 的配置保持不变。

babel.config.js 中@babel/preset-env 的配置 modules 变为 auto。

这时就出现了文章开头提到的异常：exports is undefined。

当这个异常出现后，把 modules 的值改回去变为 commonjs，异常又消失了。

推论：
问题出在模块包装上，具体就是 webpack 打包的时候注入的形参变量中没有 exports。而引起 webpack 未在包装时注入形参的原因很可能是@babel/preset-env 的配置 modules 导致的

babel.config.js

```js
const plugins = [
  [
    "@babel/plugin-transform-runtime",
    {
      corejs: 3,
    },
  ],
  [
    "import",
    {
      libraryName: "antd",
      libraryDirectory: "lib",
      style: true,
    },
    "ant",
  ],
];

module.exports = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    [
      "@babel/preset-env",
      {
        modules: "commonjs", // 升级之后这里变为'auto'
        useBuiltIns: "usage",
        corejs: "3.9",
      },
    ],
  ],
  plugins,
};
```

## 解决方案:模块转换:@babel/preset-env 的配置项 modules

```text
modules:

"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto".
```

- modules 值为 umd:
  其含义为将 es module 的模块语法、模块特性转换成 umd 的模块语法、模块特性;
  如果是非 es module 的模块语法、模块特性，则不会转换其模块语法和模块特性，只是做一层 umd 的模块包装。

- modules 值为 systemjs:
  其含义为将 es module 的模块语法、模块特性转换成 systemjs 的模块语法、模块特性;
  如果是非 es module 的模块语法、模块特性，则不会转换其模块语法和模块特性，只是做一层 systemjs 的模块包装。

- modules 值为 commonjs 或者 cjs（二者等价）:
  其含义为将 es module 的模块语法、模块特性转换成 commonjs 的模块语法、模块特性。
  如果是非 es module 的模块语法、模块特性，则原样输出

- modules 值为 false:
  其含义为：不转换 es module;如果是非 es module 的模块语法、模块特性，则原样输出。

- modules 值为 auto:
  其含义为：根据 caller 参数 supportsStaticESM 来决定要不要转换 es module，为 true 则不转换，为 false 则转换成 commonjs。caller 可以手动传入，也可以是 loader 或者 plugin 传入的（如 babel-loader）。非必要不要手动传入，因为会影响 loader 或者 plugin 的行为，导致产物和预期有差别。

将 babel-loader 中处理 node_modules 下的模块的配置单独拎出去，覆盖公共的 babel.config.js 配置

用 babel-loader 去处理 node_modules 的原因是做语法兼容。

```js
[
  {
    test: /\.(ts|js)x?$/,
    include: [
      path.resolve(__dirname, "../src"),
      // /node_modules[\\/]antd/, // 从这里去掉
    ],
    use: [
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  {
    test: /\.(ts|js)x?$/,
    include: [/node_modules[\\/]antd/],
    use: [
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          presets: [
            [
              "@babel/preset-env",
              {
                modules: "cjs",
                useBuiltIns: "usage",
                corejs: "3.9",
              },
            ],
          ],
        },
      },
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
];
```

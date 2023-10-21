---
title: babel-编译构建之modules
sidebar_position: 7
---

在升级@babel/preset-env之前，项目中的配置是这样的：
```
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
升级@babel/preset-env之后，babel-loader的配置保持不变。

babel.config.js中@babel/preset-env的配置modules变为auto。

这时就出现了文章开头提到的异常：exports is undefined。

当这个异常出现后，把modules的值改回去变为commonjs，异常又消失了。

推论：
问题出在模块包装上，具体就是webpack打包的时候注入的形参变量中没有exports。而引起webpack未在包装时注入形参的原因很可能是@babel/preset-env的配置modules导致的

babel.config.js
```
const plugins = [
  ['@babel/plugin-transform-runtime', {
    corejs: 3,
  }],
  [
    'import',
    {
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: true,
    },
    'ant',
  ],
];

module.exports = {
  presets: [
    [
      '@babel/preset-react', 
      {
        runtime: 'automatic',
      }
    ],
    [
      '@babel/preset-env',
      {
        modules: 'commonjs', // 升级之后这里变为'auto'
        useBuiltIns: 'usage',
        corejs: '3.9',
      },
    ],
  ],
  plugins,
};
```

## 解决方案:模块转换:@babel/preset-env的配置项modules
```text
modules:

"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto".
```
* modules值为umd:
其含义为将es module的模块语法、模块特性转换成umd的模块语法、模块特性;
如果是非es module的模块语法、模块特性，则不会转换其模块语法和模块特性，只是做一层umd的模块包装。

* modules值为systemjs:
其含义为将es module的模块语法、模块特性转换成systemjs的模块语法、模块特性;
如果是非es module的模块语法、模块特性，则不会转换其模块语法和模块特性，只是做一层systemjs的模块包装。

* modules值为commonjs或者cjs（二者等价）:
其含义为将es module的模块语法、模块特性转换成commonjs的模块语法、模块特性。
如果是非es module的模块语法、模块特性，则原样输出

* modules值为false:
其含义为：不转换es module;如果是非es module的模块语法、模块特性，则原样输出。

* modules值为auto:
其含义为：根据caller参数supportsStaticESM来决定要不要转换es module，为true则不转换，为false则转换成commonjs。caller可以手动传入，也可以是loader或者plugin传入的（如babel-loader）。非必要不要手动传入，因为会影响loader或者plugin的行为，导致产物和预期有差别。


将babel-loader中处理node_modules下的模块的配置单独拎出去，覆盖公共的babel.config.js配置

用babel-loader去处理node_modules的原因是做语法兼容。

```
[
  {
    test: /\.(ts|js)x?$/,
    include: [
      path.resolve(__dirname, '../src'),
      // /node_modules[\\/]antd/, // 从这里去掉
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      }, {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      }
    ],
  },
  {
    test: /\.(ts|js)x?$/,
    include: [
      /node_modules[\\/]antd/,
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          presets: [
            ['@babel/preset-env', {
              modules: 'cjs',
              useBuiltIns: 'usage',
              corejs: '3.9',
            }],
          ],
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
]
```
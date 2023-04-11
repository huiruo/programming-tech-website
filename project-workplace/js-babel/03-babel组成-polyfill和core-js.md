## （3）@babel/plugin-transform-runtime

polyfill 直译是垫片的意思，又是 Babel 里一个非常重要的概念。先看下面几行代码：

不适用polyfill:
```js
// src/index.js
const add = (a, b) => a + b
 
const arr = [1, 2]
const hasThreee = arr.includes(3)
new Promise()
```
Array.prototype.includes 和 Promise 竟然没有被转译！
```js
// dist/index.js
"use strict";
 
var add = function add(a, b) {
  return a + b;
};
 
var arr = [1, 2];
var hasThreee = arr.includes(3);
new Promise();
```
当在webpack中使用时，官方推荐和@babel/preset-env一起使用，因为这个preset会根据当前配置的浏览器环境自动加载相应的polyfill，而不是全部进行加载，从而达到减小打包体积的目的
```js
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env", {
        "useBuiltIns": "usage", // 'entry/false'
        "corejs": 3
      }
    ]
  ]
}
/*
useBuiltIns有三个选项

usage 当使用此选项时，只需要安装@babel-polyfill即可，不需要在webpack中引入，也不需要在入口文件中引入(require/import)

entry 当使用此选项时，安装完@babel-polyfill之后，然后在项目的入口文件中引入

false 当使用此选项时，需要安装依赖包，然后加入webpack.config.js的entry中
*/
```

针对于一些较老的浏览器，比如IE10或者更早之前。对一些最新的内置对象Promise/Map/Set，静态方法Arrary.from/Object.assign以及一些实例方法Array.prototype.includes，这些新的特性都不存在与这些老版本的浏览器中，那么就需要给这些浏览器中的原始方法中添加上这些特性，即所谓的polyfill。

Babel 把 ES6 的标准分为 syntax 和 built-in 两种类型。syntax 就是语法，像 const、=> 这些默认被 Babel 转译的就是 syntax 的类型。

而对于那些可以通过改写覆盖的语法就认为是 built-in，像 includes 和 Promise 这些都属于 built-in。

而 Babel 默认只转译 syntax 类型的，对于 built-in 类型的就需要通过 @babel/polyfill 来完成转译。

@babel/polyfill 实现的原理也非常简单，就是覆盖那些 ES6 新增的 built-in。示意如下：


由于 Babel 在 7.4.0 版本中宣布废弃 @babel/polyfill ，而是通过 core-js 替代，所以本文直接使用 core-js 来讲解 polyfill 的用法。
core-js 是 babel-polyfill 的底层依赖，通过各种奇技淫巧，用 ES3 实现了大部分的 ES2017 原生标准库，同时还要严格遵循规范。

第一步：安装 core-js
```
// 注意 core-js 要使用 --save 方式安装，因为它是需要被注入到源码中的，在执行代码前提供执行环境，用来实现 built-in 的注入
npm install --save core-js
```

第二步：配置 useBuiltIns

在 @babel/preset-env 中通过 useBuiltIns 参数来控制 built-in 的注入。它可以设置为 'entry'、'usage' 和 false 。默认值为 false，不注入垫片。

设置为 'entry' 时，只需要在整个项目的入口处，导入 core-js 即可。
```js
// src/index.js
import 'core-js'
 
const add = (a, b) => a + b
 
const arr = [1, 2]
const hasThreee = arr.includes(3)
new Promise()
 
// dist/index.js
"use strict";
 
require("core-js/modules/es7.array.includes");
require("core-js/modules/es6.promise");
//
// ……  这里还有很多
//
require("regenerator-runtime/runtime");
var add = function add(a, b) {
  return a + b;
};
var arr = [1, 2];
var hasThreee = arr.includes(3);
new Promise();
```

设置为 'usage' 时，就不用在项目的入口处，导入 core-js了，Babel 会在编译源码的过程中根据 built-in 的使用情况来选择注入相应的实现。
```js
// src/index.js
import 'core-js'
 
const add = (a, b) => a + b
 
const arr = [1, 2]
const hasThreee = arr.includes(3)
new Promise()
 
// dist/index.js
"use strict";
 
require("core-js/modules/es7.array.includes");
require("core-js/modules/es6.promise");
//
// ……  这里还有很多
//
require("regenerator-runtime/runtime");
var add = function add(a, b) {
  return a + b;
};
var arr = [1, 2];
var hasThreee = arr.includes(3);
new Promise();
```

配置 corejs 的版本

当 useBuiltIns 设置为 'usage' 或者 'entry' 时，还需要设置 @babel/preset-env 的 corejs 参数，用来指定注入 built-in 的实现时，使用 corejs 的版本。否则 Babel 日志输出会有一个警告。
最终的 Babel 配置如下：
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
const plugins = ['@babel/plugin-proposal-class-properties']
 
module.exports = { presets, plugins }
```


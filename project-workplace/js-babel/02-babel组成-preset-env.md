## （1）@babel/preset-env
presets 主要是配置用来编译的预置，plugins 主要是配置完成编译的插件

基本用法1
```js
const presets = [
  [
    '@babel/env',
    {
      debug: true
    }
  ]
]
const plugins = []
if (process.env["ENV"] === "prod") {
  plugins.push(...)
}
module.exports = { presets, plugins }
```

基本用法2：

```js
// 如果plugin已经在发布到npm中
// npm install @babel/plugin-transform-arrow-functions -D
// npm install @babel/preset-react -D
{
  "plugins": ["@babel/plugin-transform-arrow-functions"],
  "presets": ["@babel/preset-react"]
}
 
// 或者按照babel的规范，引入自己编写的plugin/preset
{
  "plugins": ["path/to/your/plugin"],
  "presets": ["path/to/your/preset"],
}
```

@babel/preset-* 是转换插件的集合，最常用的就是 @babel/preset-env，它包含了 大部分 ES6 的语法，具体包括哪些插件，可以在 Babel 的日志中看到。
如果源码中使用了不在 @babel/preset-env 中的语法，会报错，手动在 plugins 中增加即可。

例如 ES6 明确规定，Class 内部只有静态方法，没有静态属性。但现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上 static 关键字。

```js
// src/index.js
const add = (a, b) => a + b
 
class Person {
  static a = 'a';
  static b;
  name = 'morrain';
  age = 18
}
```
编译时就会报如下错误：
根据报错的提示，添加 @babel/plugin-proposal-class-properties 即可。
npm install --save-dev @babel/plugin-proposal-class-properties
然后配置：
```js
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true
    }
  ]
]
const plugins = ['@babel/plugin-proposal-class-properties']
 
module.exports = { presets, plugins }
```


## @babel/preset-env 中还有一个非常重要的参数 targets
babel提供了丰富的插件来对不同时期的代码进行转换。例如我们在es6最常使用的箭头函数，当需要转化为es5版本时，就用到了arrow-functions这个插件。

presets的中文翻译为预设，即为一组插件列表的集合，我们可以不必再当独地一个一个地去添加我们需要的插件。比如我们希望使用es6的所有特性，我们可以使用babel提供的ES2015这个预设。
- presets plugins插件的集合，如['es2015’]
数组，表示插件集合
- plugins 按需引进，拆成细小粒度的插件，如['transform-es2015-arrow-functions'、'transform-es2015-template-literals']


例子：
```js
{
  "plugins": [
    [
      "@babel/plugin-transform-arrow-functions",
      { "spec": true }
    ]
  ],
  "presets": [
    [
      "@babel/preset-react",
      {
        "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
        "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
        "throwIfNamespace": false, // defaults to true
        "runtime": "classic" // defaults to classic
        // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
      }
    ]
  ]
}
```

最早的时候我们就提过，Babel 转译是按需的，对于环境支持的语法可以不做转换的。
就是通过配置 targets 属性，让 Babel 知道目标环境，从而只转译环境不支持的语法。
如果没有配置会默认转译所有 ES6 的语法。

没有配置targets
```js
// src/index.js
const add = (a, b) => a + b
 
// dist/index.js
"use strict";
 
var add = function add(a, b) {
  return a + b;
};
```

按如下配置** targets**
```js
// babel.config.js
const presets = [
  [
    '@babel/env',
    {
      debug: true,
      targets: {
        chrome: '58'
      }
    }
  ]
]
const plugins = ['@babel/plugin-proposal-class-properties']
 
module.exports = { presets, plugins }
```

可以看到 const 和箭头函数都没有被转译，因为这个版本的 chrome 已经支持了这些特性。可以根据需求灵活的配置目标环境。
```js
// src/index.js
const add = (a, b) => a + b
 
// dist/index.js  配置targets  chrome 58
"use strict";
 
const add = (a, b) => a + b;
```
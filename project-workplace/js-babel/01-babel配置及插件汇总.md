
# 常用配置
## @babel/preset-typescript
ts预设插件
```js
// 配置
{
  "presets": [
    "@babel/preset-typescript"
  ]
}
```
## @babel/preset-react
react预设插件，包括对jsx预发解析等
```js
// 配置
{
  "presets": [
    "@babel/preset-typescript"
  ]
}
```

插件:babel-plugin-react-require
文件中有jsx标签时，添加react导入声明
```
{
  "plugins": ["babel-plugin-react-require"]
}
```

## @babel/preset-env
js预设插件，可以使用高版本js语法而不需要单独转换，根据babel和corejs polyfill语法映射进行转换
```js
// 配置
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ['last 2 versions', 'IE 10'], // browser使用
          "node": 6, // node环境使用
          "modules": "auto", // 转换js语法为目标版本，如cjs、umd、esm（如果esm格式则需要设置为false），auto情况下根据调用方设置（如babel-loader，@rollup/plugin-babel等）
        }
        // entry--自动将导入的模块根据设置的浏览器版本替换成补丁集
        // usage--按需导入，但实际问题更多，比如script标签引入的第三方脚本无法转换
        "useBuiltIns": "entry", // 定义babel如何处理polyfill，@babel/polyfill已弃用下，还需要安装core-js模块， usage 或 entry 时，也是直接使用core-js模块进行导入
        "corejs": { // useBuiltIns是usage或entry时有用，
          "version": "2.8", // 
          "proposals": true,
        }
      }
    ]
  ]
}
```

# 常用插件
## @babel/register
// 通过@babel/register使用node运行时进行即时编译

## @babel/runtime、@babel/plugin-transform-runtime
// 可以对promise等特性进行转换，不支持实例化的方法如 Array.includes(x) **前提是安装@babel/runtime插件
```js
// 在.babelrc配置中
{
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

## @babel/plugin-transform-modules-commonjs
将es6语法转换为commonjs
```
{
  "plugins": ["@babel/plugin-transform-modules-commonjs"]
}
```

## @babel/plugin-proposal-class-properties
编译类属性和静态属性（@babel/preset-env的ES2022中已包含）
```js
{
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

## @babel/plugin-proposal-decorators
编译class装饰器
```js
{
  "plugins": ["@babel/plugin-proposal-decorators"]
}

@isTestable(true)
class MyClass {}

function isTestable(value) {
  return function decorator(target) {
    target.isTestable = value;
  };
}
```
## @babel/plugin-syntax-dynamic-import
import语法动态导入
```js
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}

import('./a.js').then(()=>{
  console.log('a.js is loaded dynamically');
});
```
## @babel/plugin-proposal-export-namespace-from
编译export {} from 'xxx’语法
```js
{
  "plugins": ["@babel/plugin-proposal-export-namespace-from"]
}

export * as ns from "mod";
```

## @babel/plugin-proposal-export-default-from
编译export default from 语法
```js
{
  "plugins": ["@babel/plugin-proposal-export-default-from"]
}

export v from "mod";
```
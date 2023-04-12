---
title: exports与module.exports的区别
sidebar_position: 1
---

## 模块定义
一个模块用于导出你想要暴露的方法，上下文提供了exports对象就是用来导出的，它也是唯一的出口。

在模块中，还存在一个module对象，它代表模块本身，而exports是module的属性。

## javascript4种模块规范：
* 1.AMD(现在很少用了),Asynchronous Module Definition的缩写，采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

AMD采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。由于不是JavaScript原生支持，使用AMD规范进行页面开发需要用到对应的库函数: require.js

```javaScript
// 定义一个模块
define('module', ['dep'], function (dep) {
  return exports;
});

// 导入和使用
require(['module'], function (module) {});
```

* 2.es6
* 3.CommonJS,用于node服务端
```
CommonJS 没有浏览器支持。没有 live binding(实时绑定)。循环引用存在问题。同步执行的模块解析加载器速度很慢。虽然 CommonJS 是 Node.js 项目的绝佳解决方案，但浏览器不支持模块，因而产生了 Browserify, RequireJS 和 SystemJS 等打包工具，允许我们编写能够在浏览器中运行的 CommonJS 模块。
```

## A. CommonJS
CommonJS加载原理： CommonJS模块就是一个脚本文件，require命令第一次加载该脚本时就会执行整个脚本，然后在内存中生成该模块的一个说明对象。

```javaScript
{
    id: '',  //模块名，唯一
    exports: {  //模块输出的各个接口
        ...
    },
    loaded: true,  //模块的脚本是否执行完毕
    ...
}
```
以后用到这个模块时，就会到对象的exports属性中取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存中取值。

<br />

### CommonJS使用
以下模块加载机制被称为CommonJS规范。在这个规范下，每个.js文件都是一个模块，它们内部各自使用的变量名和函数名都互不冲突
```javascript
'use strict';

var s = 'Hello';

function greet(name) {
    console.log(s + ', ' + name + '!');
}

module.exports = greet;
```

其他模块中引入并使用
```javaScript
'use strict';

/*
引入hello模块:
其实变量greet就是在hello.js中 用 module.exports = greet 输出的greet函数
*/ 
var greet = require('./hello');

var s = 'Michael';

greet(s); // Hello, Michael!
```

### 模块的输出module.exports怎么实现？
hello.js
```javascript
// Node可以先准备一个对象module：
/*

可见，变量module是Node在加载js文件前准备的一个变量，并将其传入加载函数，我们在hello.js中可以直接使用变量module原因就在于它实际上是函数的一个参数：
module.exports = greet;
*/
var module = {
    id: 'hello',
    exports: {}
};

var load = function (module) {
    // 读取的hello.js代码:
    function greet(name) {
        console.log('Hello, ' + name + '!');
    }
    
    module.exports = greet;
    // hello.js代码结束
    return module.exports;
};

var exported = load(module);
// 保存module:
save(module, exported);
```

通过把参数module传递给load()函数，hello.js就顺利地把一个变量传递给了Node执行环境，Node会把module变量保存到某个地方。

由于Node保存了所有导入的module，当我们用require()获取module时，Node找到对应的module，把这个module的exports变量返回，
这样，另一个模块就顺利拿到了模块的输出：
```javascript
var greet = require('./hello');
```

<br />

## module.exports和exports区别
require/exports 的用法只有以下三种简单的写法：
```js
// 导入
const fs = require('fs')

// 导出
exports.fs = fs
/*
导出方法2:
我们建议使用: module.exports = xxx
方式来输出模块变量，这样，你只需要记忆一种方法。
*/
module.exports = fs
```

require能看到的只有module.exports这个对象，它是看不到exports对象的,而我们在编写模块时用到的exports对象实际上只是对module.exports的引用


方法一：对module.exports赋值：
```javascript
// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

module.exports = {
    hello: hello,
    greet: greet
};
```



方法二：直接使用exports：
```javascript
// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

function hello() {
    console.log('Hello, world!');
}

exports.hello = hello;
exports.greet = greet;
```

但是你不可以直接对exports赋值：
```javascript
// 代码可以执行，但是模块并没有输出任何变量:
exports = {
    hello: hello,
    greet: greet
};
```

## 我们来分析Node的加载机制：
首先，Node会把整个待加载的hello.js文件放入一个包装函数load中执行。

```javascript
/*
在执行这个load()函数前，Node准备好了module变量：
*/
var module = {
    id: 'hello',
    exports: {}
};

/*
load()函数最终返回module.exports：
*/
var load = function (exports, module) {
    // hello.js的文件内容
    ...
    // load函数返回:
    return module.exports;
};

var exported = load(module.exports, module);
```


### 结论
也就是说，默认情况下，Node准备的exports变量和module.exports变量实际上是同一个变量，并且初始化为空对象{}：
```javaScript
// 于是，我们可以写
exports.foo = function () {
  return 'foo';
};
exports.bar = function () {
  return 'bar';
};

// 也可以写：
module.exports.foo = function () { 
  return 'foo';
};
module.exports.bar = function () {
  return 'bar';
};
```
换句话说，Node默认给你准备了一个空对象{}，这样你可以直接往里面加东西。

* `可以把exports看成是对module.exports的引用, 可以用exports.foo往里面增加新的属性,如果要输出一个键值对象{}，可以利用exports这个已存在的空对象{}，并继续在上面添加新的键值；`
```
注意：
但是如果直接对exports赋值,exports就不再是module.exports的引用了, 所以module.exports仍然为空对象{}
```

* 但是，如果我们要输出的是一个函数或数组，那么，只能给module.exports赋值：
```javaScript
module.exports = function () { return 'foo'; };
```
给exports赋值是无效的，因为赋值后，module.exports仍然是空对象{}。

* 所以可以得出结论：直接对module.exports赋值，可以应对任何情况：
```javaScript
module.exports = {
    foo: function () { return 'foo'; }
};

// 或者：
module.exports = function () { return 'foo'; };
```


要实现“模块”这个功能，并不需要语法层面的支持。Node.js也并不会增加任何JavaScript语法。实现“模块”功能的奥妙就在于JavaScript是一种函数式编程语言，它支持闭包。

如果我们把一段JavaScript代码用一个函数包装起来，这段代码的所有“全局”变量就变成了函数内部的局部变量。

hello.js
```javascript
var s = 'Hello';
var name = 'world';

console.log(s + ' ' + name + '!');
```

Node.js加载了hello.js后，它可以把代码包装一下。
这样一来，原来的全局变量s现在变成了匿名函数内部的局部变量。
如果Node.js继续加载其他模块，这些模块中定义的“全局”变量s也互不干扰。
所以，Node利用JavaScript的函数式编程的特性，轻而易举地实现了模块的隔离
```javascript
(function () {
    // 读取的hello.js代码:
    var s = 'Hello';
    var name = 'world';

    console.log(s + ' ' + name + '!');
    // hello.js代码结束
})();
```

### A-1.CommonJs 特点
* 1.在导入模块时候，CommonJS是导出值的拷贝并缓存，而在ES6 Module中是值的动态引用。
```
CommonJS模块是动态引入的，模块依赖关系的确认发生在代码运行时；而ES6 Module模块是静态引入的，模块的依赖关系在编译时已经可以确立。

CommonJS require函数可以在index.js任何地方使用，并且接受的路径参数也可以动态指定。因此，在CommonJS模块被执行前，是没有办法确定明确的依赖关系，模块的导入导出都发生在代码运行时(代码运行阶段)。
```

* 2.require的模块第一次加载时候会被执行，导出执行结果module.exports。

* 3.require的模块如果曾被加载过，再次加载时候模块内部代码不会再次被执行，直接导出首次执行的结果。

* 4.require函数是运行时执行的，所以require函数可以接收表达式，并且可以放在逻辑代码中执行。
```javaScript
const name = 'Tom';
const scriptName = 'tom.js';
if (name === 'Tom') {
    require('./' + scriptName);
}
```

* 0. CommonJS模块是加载时执行，即脚本代码在require时就全部执行。

* 1. 每个文件就是一个模块，有自己的作用域。每个模块内部，module变量代表当前模块，是一个对象，它的exports属性（即module.exports）是对外的接口。

* 2. module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。

* 3. 为了方便，Node为每个模块提供一个exports变量，指向module.exports。
```javaScript
let exports = module.exports
```


该规范的核心思想是：
允许模块通过require方法来同步加载所要依赖的其他模块，
通过 exports 或 module.exports 来导出需要暴露的接口。
```javaScript
/*CommonJS 模块化*/
// 导入
const moduleA = require('./moduleA');
// 导出
module.exports = moduleA.someFunc;

/*es6*/
// 导出
export function hello() { };
export default {
  // ...
};
// 导入 
import { readFile } from 'fs';
import React from 'react';
```

<br />


## JavaScript模块编译
在编译的过程中，Node对JavaScript文件的内容进行了头尾包装。
在头部加上了(function(exports, require, module, __filename, __dirname) {，在尾部加上了})。就像下面这样：
这样做还有一个好处，每个模块之间是相互独立的，不会引起变量污染。
```javascript
(function(exports, require, module, __filename, __dirname) {
//模块文件内容
})
```

## D:Node中的3种类模块
1. 核心模块
核心模块加载的优先级仅次于缓存加载，其加载速度是最快的，因为这些模块在node源代码的编译过程中就已经编译为二进制文件。
如果我们自己编写一个模块，取名为与核心模块相同（如：fs），当我们去引入时自然是不会成功的，除非换成其他的标识符形式引入。
```
核心模块的编译过程:
node在编译核心模块时，首先把JavaScript代码转存为C/C++代码，采用V8附带的js2c.py工具，转成node_natives.h头文件。
在这个过程中，JavaScript代码以字符串的形式存储在node命名空间中，是不能直接执行的。在启动node进程时，JavaScript代码直接加载进内存中。在加载过程中，JavaScript核心模块经历标识符分析后直接定位到内存中，比普通文件模块查找要快很多。
lib目录下的所有模块文件也是没有定义require、module、exports这些变量的。在引入核心模块的过程中，也经历了头尾包装的过程，然后才执行和导出了exports对象。
```

2. 路径形式的文件模块
以…/、./或/开始的标识符，在分析路径模块时，require()方法会将路径转为真实路径，并以真实路径作为索引。由于文件模块知道了文件的位置，因此加载速度也是比较快的，仅次于核心模块。

3. 自定义模块
自定义模块是一类特殊的文件模块，它可能是一个文件或者包的形式，这类模块的查找是最费时的，也是最慢的一种。node在查找模块时按照模块路径的查找策略，有点类似于JavaScript的原型链一样，逐级向上查找，直到顶级为止。

### D-1. node在引入模块时会经历以下阶段：
1. 路径分析
```
路径分析就是查找模块所在的路径，由于标识符的形式有多种，因此针对不用形式的标识符在查找和定位上有不同程度的差异。
```
2. 文件定位
3. 编译执行

模块的加载过程
node在加载模块时会优先从缓存中加载，任何模块在第一次被引入后就会被缓存起来，当第二次引入时，会优先从缓存加载，
与前端浏览器的缓存文件一样以提高性能。不同的是浏览器仅仅缓存文件，而node缓存的是编译和执行后的对象。

<br />

## A. 不同规范间加载
es6 module不能说是成是异步加载的，只能说是编译时静态分析的，commonjs是执行时动态分析的

### A-1. import加载CommonJS模块
使用import命令加载CommonJS模块，Node会自动将module.exports属性当做模块的默认输出，即等同于export default
```javaScript
// a.js
module.exports = {
  foo: 'hello',
  bar: 'world'
}

// 在import引入时等同于
export default {
  foo: 'hello',
  bar: 'world'
}
```

这是因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是module.exports，是一个对象，无法被静态分析，所以只能整体加载。

ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。
```javaScript
// 正确 
import packageMain from 'commonjs-package'; 

// 报错 
import { method } from 'commonjs-package';


// 加载单一的输出项，可以写成下面这样。
import packageMain from 'commonjs-package'; 
const { method } = packageMain;
```


### A-2. require加载ES6模块
require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层await命令，导致无法被同步加载。

require命令加载ES6模块时，所有的输出接口都会成为输入对象的属性。
```javaScript
// es.js
let foo = {bar : 'my-default'};
exxport default foo;
foo = null;

// cjs.js
const es_namespace = require('./es')
console.log(es_namespace.default);// {bar:'my-default'}
```

### A-3. 同时支持两种格式的模块
一个模块同时要支持 CommonJS 和 ES6 两种格式，也很容易。

如果原始模块是 ES6 格式，那么需要给出一个整体输出接口，比如export default obj，使得 CommonJS 可以用import()进行加载。

如果原始模块是 CommonJS 格式，那么可以加一个包装层。
```javaScript
// 先整体输入 CommonJS 模块，然后再根据需要输出具名接口。
import cjsModule from '../index.js';
export const foo = cjsModule.foo;
```

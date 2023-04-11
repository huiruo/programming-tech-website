---
title: cjs使用
sidebar_position: 6
---

# cjs
* 1.AMD(现在很少用了),Asynchronous Module Definition的缩写，采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

* 2.CommonJS 并不是 ECMAScript 标准的一部分，所以 类似 module 和 require 并不是 JS 的关键字，仅仅是对象或者函数而已，意识到这一点很重要。

运行时加载因为只有运行时才能得到这个对象。


如果要在浏览器中使用，如果想要使用对应的模块，需要提前加载。

由于服务端所有的模块都存放在本地硬盘上，可以同步加载完成（硬盘读取时间很快），但是，对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于”假死”状态。

例如http模块，如果浏览器像使用对应的方法，就需要等到http加载完成后才能使用。如果加载时间很长，整个应用就会停在那里等。
```js
// 引入http模块
const http = require('http');

// 使用http模块中的方法
http.createServer(/*...*/);
```



加载原理:
CommonJS一个模块对应一个脚本文件，require 命令每次加载一个模块就会执行整个脚本，然后生成一个对象。

这个对象一旦生成，以后再次执行相同的 require 命令都会直接到缓存中取值。也就是说：CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载时就返回第一次运行的结果，除非手动清除系统缓存。

## JavaScript模块编译
在编译的过程中，Node对JavaScript文件的内容进行了头尾包装。
在头部加上了(function(exports, require, module, __filename, __dirname) {，在尾部加上了})。就像下面这样：
这样做还有一个好处，每个模块之间是相互独立的，不会引起变量污染。
```js
(function(exports, require, module, __filename, __dirname) {
//模块文件内容
})
```

node在引入模块时会经历以下阶段：
1. 路径分析
```
路径分析就是查找模块所在的路径，由于标识符的形式有多种，因此针对不用形式的标识符在查找和定位上有不同程度的差异。
```
2. 文件定位
3. 编译执行

模块的加载过程
node在加载模块时会优先从缓存中加载，任何模块在第一次被引入后就会被缓存起来，当第二次引入时，会优先从缓存加载，
与前端浏览器的缓存文件一样以提高性能。不同的是浏览器仅仅缓存文件，而node缓存的是编译和执行后的对象。

Node中的3种类模块
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

## module 是一个对象， require 是一个函数
module 中的一些属性：
* exports：这就是 module.exports 对应的值，由于还没有赋任何值给它，它目前是一个空对象。
* loaded：表示当前的模块是否加载完成。
* paths：node 模块的加载路径
* require 函数中也有一些值得注意的属性：
    * main 指向当前当前引用自己的模块，所以类似 python 的 __name__ == '__main__', node 也可以用 require.main === module 来确定是否是以当前模块来启动程序的。
    * extensions 表示目前 node 支持的几种加载模块的方式。
    * cache 表示 node 中模块加载的缓存，也就是说，当一个模块加载一次后，之后 require 不会再加载一次，而是从缓存中读取。

`要实现模块这个功能，并不需要语法层面的支持。实现“模块”功能的奥妙就在于JavaScript是一种函数式编程语言，它支持闭包。`

把一段JavaScript代码用一个函数包装起来，这段代码的所有“全局”变量就变成了函数内部的局部变量。

hello.js
```js
var a1 = 'Hello';
var name = 'world';
console.log(a1 + ' ' + name + '!');
```

Node.js加载了hello.js后，它可以把代码包装一下。
这样一来，原来的全局变量s现在变成了匿名函数内部的局部变量。

如果Node.js继续加载其他模块，这些模块中定义的“全局”变量a1也互不干扰。
所以，Node利用JavaScript的函数式编程的特性，轻而易举地实现了模块的隔离
```js
(function () {
    // 读取的hello.js代码:
    var a1 = 'Hello';
    var name = 'world';
    console.log(a1 + ' ' + name + '!');
})();
```


模块的输出module.exports怎么实现？
hello.js
```js
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
```js
var greet = require('./hello');
```

## CommonJS使用
在这个规范下，每个.js文件都是一个模块，它们内部各自使用的变量名和函数名都互不冲突；

为了方便，Node为每个模块提供一个exports变量，指向module.exports。
```js
let exports = module.exports
```

require/exports 的用法只有以下三种简单的写法：
```js
// 导入
const fs = require('fs')

// 导出
exports.fs = fs
/*
导出方法2:
我们建议使用: module.exports = xxx 方式来输出模块变量，这样，你只需要记忆一种方法。
*/
module.exports = fs
```

```js
'use strict';

var s = 'Hello';

function greet(name) {
    console.log(s + ', ' + name + '!');
}

function foo(name) {
    console.log('foo');
}

// 方法一：对module.exports赋值：
// module.exports = greet; // 导出单个
// 导出多个
module.exports = {
    greet,
    foo
};

// 方法2：使用exports
exports.hello = hello;
exports.greet = greet;
```

其他模块中引入并使用
```js
'use strict';

// var greet = require('./hello');
var { foo, greet } = require('module');

var s = 'Michael';
greet(s); // Hello, Michael!
```

### exports与module.exports的区别
我们来分析Node的加载机制：首先Node会把整个待加载的hello.js文件放入一个包装函数load中执行。load()函数最终返回module.exports：
```js
// 在执行这个load()函数前，Node准备好了module变量：
var module = {
    id: 'hello',
    exports: {}
};

var load = function (exports, module) {
    // hello.js的文件内容
    ...
    // load函数返回:
    return module.exports;
};

var exported = load(module.exports, module);
```

默认情况下，Node准备的exports变量和module.exports变量实际上是同一个变量，并且初始化为空对象{}：
```js
exports.foo = function () {
  return 'foo';
};
exports.bar = function () {
  return 'bar';
};
```
可以把exports看成是对module.exports的引用, 可以用exports.foo往里面增加新的属性,如果要输出一个键值对象{}，可以利用exports这个已存在的空对象{}，并继续在上面添加新的键值；
```
注意：
但是如果直接对exports赋值,exports就不再是module.exports的引用了, 所以module.exports仍然为空对象{}
```

`但是，如果我们要输出的是一个函数或数组，那么，只能给module.exports赋值：`
```js
module.exports = function () { return 'foo'; };
```
给exports赋值是无效的，因为赋值后，module.exports仍然是空对象{}。

* 所以得出结论：直接对module.exports赋值，可以应对任何情况：
```js
module.exports = {
    foo: function () { return 'foo'; }
};

// 或者：
module.exports = function () { return 'foo'; };
```


## commonjs 输出拷贝的例子
exports 对象是模块内外的唯一关联， commonjs 输出的内容，就是 exports 对象的属性，模块运行结束，属性就确定了。
```js
// a.js
let a = 1;
let b = { num: 1 }
setTimeout(() => {
    a = 2;
    b = { num: 2 };
}, 200);
module.exports = {
    a,
    b,
};

// main.js
// node main.js
let {a, b} = require('./a');
console.log(a);  // 1
console.log(b);  // { num: 1 }
setTimeout(() => {
    console.log(a);  // 1
    console.log(b);  // { num: 1 }
}, 500);
```

require：输出是值的拷贝，模块就是对象，输入时必须查找对象属性
注意：CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值

修改值后再次引用并不会获取最新值,CommonJS 模块输出的是值的拷贝。
```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};


// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();

console.log(mod.counter); // 3
// lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。
// 这是因为mod.counter是一个原始类型的值，会被缓存。

// 除非写成一个函数，才能得到内部变动后的值。
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

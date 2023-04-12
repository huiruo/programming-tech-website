---
title: es6和commonjs模块区别
sidebar_position: 1
---

## 前言
在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。
由于 CommonJS 并不是 ECMAScript 标准的一部分，所以 类似 module 和 require 并不是 JS 的关键字，仅仅是对象或者函数而已，意识到这一点很重要。

module 是一个对象， require 是一个函数
```
module 中的一些属性：
exports：这就是 module.exports 对应的值，由于还没有赋任何值给它，它目前是一个空对象。
loaded：表示当前的模块是否加载完成。
paths：node 模块的加载路径

require 函数中也有一些值得注意的属性：

main 指向当前当前引用自己的模块，所以类似 python 的 __name__ == '__main__', node 也可以用 require.main === module 来确定是否是以当前模块来启动程序的。

extensions 表示目前 node 支持的几种加载模块的方式。

cache 表示 node 中模块加载的缓存，也就是说，当一个模块加载一次后，之后 require 不会再加载一次，而是从缓存中读取。

```

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范， 成为浏览器和服务器通用的模块解决方案。
```javaScript
// commonjs 写法
var clock = require('clock.js')
clock.start();
```

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

## 其他规范 AMD CMD
AMD (Asynchronous Module Definition) 就是异步加载模块，多用于浏览器（ requireJs应用了这一规范），写法为：
```javaScript
require([module],callback);

// eg
require(['clock.js'],function(clock){
  clock.start();
})
/*
虽然实现了异步加载，规避了浏览器的“假死”问题，但是也存在缺点： 一开始就把所有依赖写出来是不符合逻辑顺序的。那么，能不能像CommonJS一样用的时候才require，然后还能支持异步加载后执行呢？
*/
```

CMD (Common Module Definition) 则是依赖就近，用的时候再require（ seajs推崇的规范 ）
AMD和CMD的区别是对依赖模块的执行时机不同，而不是加载处理方式不同，二者皆为异步加载模块。
AMD依赖前置，js可以方便地清楚依赖模块有哪些，立即加载

CMD就近依赖，开发者可以在需要用到依赖的时候再require，但是对于js处理器来说，需要把代码处理为字符串解析一遍才知道依赖了哪些模块，即牺牲性能来获得开发的便利，虽然实际上解析的时间短到可以忽略，但是也有很多人诟病CMD这一点。
```javaScript
define(function(require,exports,module){
  var clock = require('clock.js');
  clock.start();
})
```

## es6
ES6的模块化设计思想是尽量静态化，使得编译时就能确定模块的依赖关系。
对比CommonJS和ES6模块：
```javaScript
// CommonJS
let { start, exists, readFile } = require('fs')
// 相当于
// let _fs = require('fs')
// let start = _fs.start, exists = _fs.exists, readFile = _fs.readFile

// ES6
import { start, exists, readFile } from 'fs'
```

注意：
1. export语句输出的接口是对应值的引用，也就是一种动态绑定关系，通过该接口可以获取模块内部实时的值。
对比CommonJS规范：CommonJS模块输出的是值的缓存，不存在动态更新。

2. export命令规定要处于模块顶层，一旦出现在块级作用域内，就会报错，import同理。

## es6 的动态加载
import()函数接收与import相同的参数，返回一个Promise对象，加载获取到的值作为then方法的回调参数。
```javaScript
const main = document.querySelector('main')

import(`./section-modules/${someVariable}.js`)
	.then(module => {
  	module.loadPageInto(main);
	})
	.catch(err => {
    main.textContext = err.message;
})

// 加载获得接口参数：
import('./module1.js')
.then(({default:defaultFn,foo,bar}) => {
  console.log(defaultFn)
})

// 同时加载多个模块并应用于async函数中
async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] = 
        await Promise.all([
          import('./module1,js'),
          import('./module2.js'),
          import('./module3.js')
        ])
}
main();
```



## 什么是运行时加载呢？
例子：整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。
这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。
```javascript
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
## 什么是编译时加载或静态加载呢？
上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。
```javascript
// ES6模块
import { stat, exists, readFile } from 'fs';
```

## ES6 模块与 CommonJS 模块差异
## 区别1. ES6 模块输出的是值的引用，CommonJS 模块输出的是值的拷贝。
```
ES6 module: JS 引擎预编译时，遇到关键词 import，就会生成一个只读引用，等到脚本真正执行时，再根据这个只读引用到被加载的模块中取值。

换句话说，原始值变了，import 的值也会跟着变，不会缓存值。
import：输出是值的引用，ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入（这也导致了没法引用 ES6 模块本身，因为它不是对象）
```

require：输出是值的拷贝，模块就是对象，输入时必须查找对象属性
注意：CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
```javaScript
// a.js
import * as b from './b';
console.log(b.foo);
console.log(b.person);
setTimeout(() => {
  console.log(b.foo);
  console.log(b.person);
  import('./b').then(({ foo, person }) => {
    console.log(b.foo);
    console.log(b.person);
  });
}, 1000);

// b.js
export let foo = 1;
export let person = {
  name: 'tb'
}
setTimeout(() => {
  foo = 2;
  person.name = 'kiki'
}, 500);

// 打印
// 1
// { name: 'tb'}
// 2
// { name: 'kiki'}
// 2
// { name: 'kiki'}
```


```javaScript
// lib.js 
let num = 3;
function changeNum() {
  num = 4;
}
module.exports = {
  num: num,
  changeNum: changeNum,
};

//main.js
var mod = require('./lib.js')
console.log(mod.num); // 3
mod.changeNum();
console.log(mod.num); // 3

// 这是由于，mod.num是一个原始类型的值，会被缓存。可以通过写成一个函数，来得到内部修改后的值：
// lib.js 
let num = 3;
function changeNum() {
  num = 4;
}
module.exports = {
  get num(){
    return num
  },
  changeNum: changeNum,
};

//main.js
var mod = require('./lib.js')
console.log(mod.num); // 3
mod.changeNum();
console.log(mod.num); // 3
```

对比ES6模块：
```javaScript
// lib.js 
export let num = 3;
export function changeNum() {
  num = 4;
}

//main.js
import {num,changeNum} from './lib.js'
console.log(num); // 3
changeNum();
console.log(num); // 4
```

## 区别2. ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

<br/>

## 区别3. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
原因：CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

使用 import 的方式引入，即使最终没用到，module 必定会被加载。

使用 require 引入，可以更实际的按需加载 module。如在开发环境时，需要加载浏览器插件库，生产环境则不需要，这时就可以只在满足开发环境的 if 语录中 require 用到的 module。

CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

差异1举例:commonjs
```javascript
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
//lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。
//这是因为mod.counter是一个原始类型的值，会被缓存。
//除非写成一个函数，才能得到内部变动后的值。
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

es6:
```javascript
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
//ES6 模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化。
```


## CommonJS的循环加载
加载原理
CommonJS一个模块对应一个脚本文件，require 命令每次加载一个模块就会执行整个脚本，然后生成一个对象。

这个对象一旦生成，以后再次执行相同的 require 命令都会直接到缓存中取值。也就是说：CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载时就返回第一次运行的结果，除非手动清除系统缓存。

上面代码可以看到：第一，在 b.js 中，a.js 没有执行完毕，第二，当 main.js 执行到第二行时不会再次执行 b.js，而是输出缓存的 b.js 的执行结果，即它的第四行：exports.done = true
```javaScript
// a.js
exports.done = false;
var b = require('./b.js'); // 1. a.js暂停执行，转到执行b.js ； b.js完毕后回来，b:{done:true}
console.log('在a.js中，b.done=%j',b.done); // 5. '在a.js中，b.done=true'
exports.done = true;
console.log('a.js执行完毕') // 6. 'a.js执行完毕'

// b.js
exports.done = false;
var a = require('./b.js') // 2. a:{done:false}
console.log('在b.js中，a.done=%j',a.done); // 3. '在b.js中，a.done=false'
exports.done = true;
console.log('b.js执行完毕') // 4. 'b.js执行完毕'，继续执行a.js

// main.js
var a = require('./a.js');
var b = require('./b.js');
console.log('在main.js中，a.done=%j，b.done=%j',a.done,b.done); // 7.'在main.js中，a.done=true，b.done=true'
```
总结一下：1. 由于 CommonJS 模块遇到循环加载返回的是当前已经执行的部分的值，而不是代码全部执行后的值（上面的第2步注释）2. CommonJS 输入的是被输出值的缓存（复制），而非动态引用。


## 对比：ES6模块是动态引用，变量不会被缓存
```javaScript
// a.js
import {bar} from './b.js';
export function foo(){
  console.log('foo')
  bar();
  console.log('执行完毕')
}
foo();

// b.js
import {foo} from './a.js' // 如果为CommonJS，这里直接就返回undefined值且不会再更改
export function bar(){
  console.log('bar')
  if(Math.random() > 0.5){
    foo();
  }
}

// 执行结果可能为：foo bar 执行完毕
// 执行结果也可能为： foo bar foo bar 执行完毕 执行完毕
```
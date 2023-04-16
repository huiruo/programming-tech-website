## ESM 和 CommonJS 的区别

## JavaScript模块编译
在编译的过程中，Node对JavaScript文件的内容进行了头尾包装。
在头部加上了(function(exports, require, module, __filename, __dirname) {，在尾部加上了})。就像下面这样：
这样做还有一个好处，每个模块之间是相互独立的，不会引起变量污染。
```js
(function(exports, require, module, __filename, __dirname) {
  // 模块文件内容
})
```

## Node中的3种类模块
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

## node在引入模块时会经历以下阶段
1. 路径分析
```
路径分析就是查找模块所在的路径，由于标识符的形式有多种，因此针对不用形式的标识符在查找和定位上有不同程度的差异。
```
2. 文件定位
3. 编译执行

### cjs
es6 module不能说是成是异步加载的，只能说是编译时静态分析的，commonjs是执行时动态分析的

* commonjs 输出拷贝
* __filename、__dirname 在 CommonJS 中存在，在 ESM 中不存在
* 模块顶层的this指向, CommonJS this 指向的是当前 module 的默认 exports；ESM 由于语言层面的设计指向的是 undefined。
* 因为CommonJS的require语法是同步的，所以就导致了CommonJS模块规范只适合用在服务端

* 在循环加载，它们会有不同的表现。CommonJS 遇到循环依赖的时候，只会输出已经执行的部分，后续的输出或者变化，是不会影响已经输出的变量。
```
而ES6模块相反，使用import加载一个变量，变量不会被缓存，真正取值的时候就能取到最终的值；
```

### esm
* esm输出引用，import 的值是原始值的动态read-only引用，即原始值发生变化，引用值也会变化。
* ES6 模块是在编译时就能确定模块的输入输出，模块的依赖关系。
```
ES6 可以在编译时就完成模块加载，效率要比CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。
```
* ESM 中 import 的不是对象， export 的也不是对象,在编译阶段，import 模块中引入的值就指向了 export 中导出的值。import：输出是值的引用，ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入（这也导致了没法引用 ES6 模块本身，因为它不是对象）
```js
// 语法错误
import { a: myA } from './a.mjs'

// 语法错误
export {
  a: "a"
}
```


commonjs 和 esm 的主要区别可以概括成以下几点：
* 输出拷贝 vs 输出引用
* 编译时确认 vs 运行时确认
* esm 的 import read-only 特性
* esm 存在 export/import 提升

1. 不同点：this 的指向不同
```
CommonJS this 指向的是当前 module 的默认 exports；
ESM 由于语言层面的设计指向的是 undefined。
```
2. 不同点：filename，dirname 在 CommonJS 中存在，在 ESM 中不存在
在 CommonJS 中，模块的执行需要用函数包起来，并指定一些常用的值
```js
NativeModule.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];
```

所以我们全局才可以直接用 __filename、__dirname。而 ESM 没有这方面的设计，所以在 ESM 中不能直接使用 __filename 和 __dirname。

3. 相同点：ESM 和 CommonJS 都有缓存
都会缓存模块，模块加载一次后会缓存起来，后续再次加载会用缓存里的模块。

## exports与module.exports
esm 的 import read-only 特性
```
read-only 的特性很好理解，import 的属性是只读的，不能赋值，类似于 const 的特性.
```
esm 存在 export/import 提升
```
esm 对于 import/export 存在提升的特性，具体表现是规范规定 import/export 必须位于模块顶级，不能位于作用域内；其次对于模块内的 import/export 会提升到模块顶部，这是在编译阶段完成的。
```


### 首先看个 commonjs 输出拷贝的例子：
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

### esm 输出引用的例子
这就是 esm 输出引用跟 commonjs 输出值的区别;
模块内部引用的变化，会反应在外部，这是 esm 的规范。
```js
// a.mjs
let a = 1;
let b = { num: 1 }
setTimeout(() => {
    a = 2;
    b = { num: 2 };
}, 200);
export {
    a,
    b,
};

// main.mjs
// node --experimental-modules main.mjs
import {a, b} from './a';
console.log(a);  // 1
console.log(b);  // { num: 1 }
setTimeout(() => {
    console.log(a);  // 2
    console.log(b);  // { num: 2 }
}, 500);
```

## 区别1.ES6模块输出的是值的引用，CommonJS 模块输出的是值的拷贝
### ES6 module
JS 引擎预编译时，遇到关键词 import，就会生成一个只读引用，等到脚本真正执行时，再根据这个只读引用到被加载的模块中取值。

换句话说，原始值变了，import 的值也会跟着变，不会缓存值。

import：输出是值的引用，ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入（这也导致了没法引用 ES6 模块本身，因为它不是对象）

require：输出是值的拷贝，模块就是对象，输入时必须查找对象属性
注意：CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
```js
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


```js
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
```js
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

### 区别2.cjs模块是运行时加载，ES6 模块是编译时输出接口
* CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。
* ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
* CommonJS 模块的require()是同步加载模块
* ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

### commonjs
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

### es6
```js
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

## CommonJS的缓存
CommonJS一个模块对应一个脚本文件，require 命令每次加载一个模块就会执行整个脚本，然后生成一个对象。

这个对象一旦生成，以后再次执行相同的 require 命令都会直接到缓存中取值。也就是说：CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载时就返回第一次运行的结果，除非手动清除系统缓存。

上面代码可以看到：第一，在 b.js 中，a.js 没有执行完毕，第二，当 main.js 执行到第二行时不会再次执行 b.js，而是输出缓存的 b.js 的执行结果，即它的第四行：exports.done = true
```js
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


## ES6模块是动态引用，变量不会被缓存
```js
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

### 存在export/import提升
`import`只能在模块顶层声明,值得不能再if嵌套之中。可以声明在底部，因为会提升,正常的引用模块没办法看出变量声明提升的特性，需要通过循环依引用才能看出。
我们来看下 demo4：
```js
// a.js
import { foo } from './b';
console.log('a.js');
export const bar = 1; // const 定义的变量不能提升，但是前面有 export 后，可以提升声明部分。
export const bar2 = () => {
  console.log('bar2');
}
export function bar3() {
  console.log('bar3');
}

// b.js
export let foo = 1;
import * as a from './a';
console.log(a);

// 打印
// [Module] { bar: <uninitialized>, bar2: <uninitialized>, bar3: [Function: bar3] }
// a.js
```
* tree shaking。通过静态分析工具在编译时候检测哪些import进来的模块没有被实际使用过，以及模块中哪些变量、函数没有被使用，都可以在打包前先移除，减少打包体积。

## ESM 中 import 的不是对象， export 的也不是对象。
与CommonJS 不同，例如，下面的写法会提示语法错误：
```js
// 语法错误！这不是解构！！！
import { a: myA } from './a.mjs'

// 语法错误！
export {
  a: "a"
}

/*
import 和 export 的用法很像导入一个对象或者导出一个对象，但这和对象完全没有关系。他们的用法是 ECMAScript 语言层面的设计的，并且“恰巧”的对象的使用类似。

所以在编译阶段，import 模块中引入的值就指向了 export 中导出的值。如果读者了解 linux，这就有点像 linux 中的硬链接，指向同一个 inode。或者拿栈和堆来比喻，这就像两个指针指向了同一个栈。
*/
```

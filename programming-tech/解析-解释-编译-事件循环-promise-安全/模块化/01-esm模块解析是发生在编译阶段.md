---
title: NextJS
sidebar_position: 1
---

## A-1. 什么叫 编译时输出接口? 什么叫 运行时加载?
ESM 之所以被称为 编译时输出接口，是因为它的模块解析是发生在编译阶段。

与此对应的 CommonJS，它的模块解析发生在 执行阶段，因为 require 和 module 本质上就是个函数或者对象，只有在 执行阶段 运行时，这些函数或者对象才会被实例化。因此被称为运行时加载。
```
import 和 export 这些关键字是在编译阶段就做了模块解析，这些关键字的使用如果不符合语法规范，在编译阶段就会抛出语法错误。
```

### A-2. ESM 的加载细节
在讲解ESM 的加载细节之前，我们要了解 ESM 中也存在 变量提升 和 函数提升 ，意识到这一点非常重要。

ESM 的加载细节，它其实和前面提到的 CommonJS 的 Module._load 函数做的事情有些类似：
1. 检查缓存，如果缓存存在且已经加载，则直接从缓存模块中提取相应的值，不做下面的处理

2. 如果缓存不存在，新建一个 Module 实例

3. 将这个 Module 实例放到缓存中

4. 通过这个 Module 实例来加载文件

5. 加载文件后到全局执行上下文时，会有创建阶段和执行阶段，在创建阶段做函数和变量提升，接着执行代码。

6. 返回这个 Module 实例的 exports

### 例子：结合例子的循环加载，我们再做一个详细的解释：
```javaScript
// 运行 app.mjs
/*
setA to aa
running a.mjs
b val b
setB to bb
*/

// 运行a.mjs
/*
running b.mjs
a val undefined
setA to aa
running a.mjs
b val b
setB to bb
*/
```
当 app.mjs 加载 a.mjs 时，Module 会检查缓存中有没有 a.mjs，发现没有，于是 new 一个 a.mjs 模块，并将这个模块放到缓存中，再去加载 a.mjs 文件本身。

在加载 a.mjs 文件时，在 创建阶段 会为全局上下文中的函数 setA 和 变量 a 分配内存空间，并初始化变量 a 为 undefined。在执行阶段，发现第一行是加载 b.mjs，它会检查缓存中有没有 b.mjs，发现没有，于是 new 一个 b.mjs 模块，并将这个模块放到缓存中，再去加载 b.mjs 文件本身。

在加载 b.mjs 文件时，在 创建阶段 会为全局上下文中的函数 setB 和 变量 b 分配内存空间，并初始化变量 b 为 undefined。在执行阶段,发现第一行是加载 a.mjs，它会检查缓存中有没有 a.mjs，发现存在，于是 import 返回了缓存中 a.mjs 导出的相应的值。

虽然这个时候 a.mjs 根本还没有执行过，但是它的 创建阶段 已经完成了，即在内存中也已经存在了 setA 函数和值为 undefined 的变量 a。所以这时候在 b.mjs 里可以正常打印 a 并使用 setA 函数而没有异常抛错。

### 而相反的是es6
根据 ES6 规范，import 只能在模块顶层声明，所以下面的写法会直接报语法错误，不会有 log 打印，因为它压根就没有进入 执行阶段：
```javaScript
console.log('hello world');

if (true) {
  import { resolve } from 'path';
}

// out:
//   import { resolve } from 'path';
//          ^
// SyntaxError: Unexpected token '{'
```

<br />

## ESM 中 import 的不是对象， export 的也不是对象。
与CommonJS 不同，例如，下面的写法会提示语法错误：
```javaScript
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

## ESM 和 CommonJS 的区别
1. 不同点：this 的指向不同
```
CommonJS this 指向的是当前 module 的默认 exports；
ESM 由于语言层面的设计指向的是 undefined。
```
2. 不同点：filename，dirname 在 CommonJS 中存在，在 ESM 中不存在
在 CommonJS 中，模块的执行需要用函数包起来，并指定一些常用的值
```javaScript
NativeModule.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];
```

所以我们全局才可以直接用 __filename、__dirname。而 ESM 没有这方面的设计，所以在 ESM 中不能直接使用 __filename 和 __dirname。

3. 相同点：ESM 和 CommonJS 都有缓存
都会缓存模块，模块加载一次后会缓存起来，后续再次加载会用缓存里的模块。


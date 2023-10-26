---
title: step3-执行上下文-函数调用栈-this
sidebar_position: 4
---

## 执行上下文定义
理解闭包就不得不去理解作用域和执行上下文，理解this得理解词法作用域规则。

闭包、this可以把它们放在一个完整的知识链路里来理解，那就是JS 的执行上下文。

>`理解执行上下文和执行栈对于理解其他 JavaScript 概念（如变量声明提升，作用域和闭包）至关重要。`

执行上下文 包含了变量、函数声明，参数（arguments），作用域链，this等信息,一个执行上下文会包含以下内容：
* 变量环境:var，function 变量存放在变量环境
* 词法环境:包含了使用 let、const 等变量的内容。
* this 指针,this指的是执行上下文所属的作用域。一旦作用域链被创建，JS引擎就会初始化this关键字的值。

### `闭包的本质:`
作用域大部分时候是静态作用域,又叫词法作用域,这是因为作用域的嵌套关系可以在语法分析时确定;

闭包保持着对父函数得作用域引用，这在语法分析已经确定，父级函数的执行上下文在运行时赋值，所以闭包return的值就是执行上下文赋值的值，也就是父级函数执行之后不会销毁引用的作用域。

### 三种上下文-1.全局执行上下文
只有一个，浏览器中的全局对象就是 window 对象，this 指向这个全局对象。

### 三种上下文-2.Eval 函数执行上下文
指的是运行在 eval 函数中的代码，很少用而且不建议使用。

## 三种上下文-3.函数执行上下文-重点
存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文。函数作用域是在函数声明的时候就已经确定了，而函数执行上下文是在函数调用时创建的。

在 JavaScript 中，执行上下文包括两个主要阶段：创建阶段和执行阶段。
1. 创建阶段：在创建阶段，JavaScript 引擎会做以下事情：
    * 创建变量对象（Variable Object），用于存储变量、函数声明和函数参数。
    * 建立作用域链（Scope Chain），这是一个指向父级执行上下文的引用链，用于在作用域中查找标识符。
    * 确定 this 的值，即确定函数在执行时的上下文对象。
>在创建阶段，变量和函数声明会被提升（即在作用域内可见但未赋值），这就是为什么在执行上下文中可以访问未赋值的变量。
1. 执行阶段：在执行阶段，JavaScript 引擎会执行实际的代码，为变量分配值，并执行函数。在这个阶段，执行上下文的状态会根据代码的执行而改变。例如，变量的值会在执行时被赋值，函数会被调用，this 的值可能会随着函数的执行环境而改变。

### 和全局执行上下文之间的不同主要体现在以下方面上
它在机制层面和全局上下文高度一致，只需要关注它与全局上下文之间的不同即可

1. 创建的时机:全局上下文在进入脚本之初就被创建，而函数上下文则是在函数调用时被创建
2. 创建的频率:全局上下文仅在代码刚开始被解释的时候创建一次；而函数上下文由脚本里函数调用的多少决定，理论上可以创建无数次
3. 创建阶段的工作内容不完全相同,函数上下文不会创建全局对象（Window），而是创建参数对象（arguments）；创建出的 this 不再死死指向全局对象，而是取决于该函数是如何被调用的,如果它被一个引用对象调用，那么 this 就指向这个对象；

对比:
全局执行上下文:
* 创建一个全局变量对象存储函数和变量声明。
* 创建 `this` 对象将全局作用域中所有变量和函数作为属性和方法存储。
* 不可以访问函数上下文中的代码

函数执行上下文:
* 并不创建全局变量对象。相反，创建arguments对象存储所有传入函数的参数。
* 不创建`this` 对象，但可以访问被定义的环境，通常情况下为 `window` 对象。
* 通过作用域查找，可以访问上下文以及父上下文中的代码（变量和函数）。

debugger 进入 aFn(),会进入函数上下文的创建阶段，在这个阶段里，函数上下文的内容如下：
```js
var a1 = '1'
var a2 = '2'

function aFn(val) {
    var a4 = 4
    var a5 = 5
    return {
        a1: a1,
        a2: a2,
        a3: val
    }
}
console.log('test', a1)
debugger
aFn(3)
```
```js
Phase: Creation

arguments: {length: 1}

a1: 4

a2: 5

this: window
```
![](../assets/img-engine/函数的执行上下文例子.png)


## 执行上下文的三个生命周期
>ES5 规范去除了 ES3 中变量对象和活动对象，以词法环境组件(LexicalEnvironment component）和变量环境组件（VariableEnvironment component）替代。

### 执行上下文两个阶段:创建阶段-执行阶段
执行上下文是在编译阶段就被确定了的，但是执行的时候会被赋值修改,es5 执行上下文的生命周期也包括三个阶段：
```mermaid
flowchart LR
创建阶段-->执行阶段-->回收阶段
```

1. 创建阶段 —— 执行上下文的初始化状态，此时一行代码都还没有执行，只是做了一些准备工作
2. 执行阶段 —— 逐行执行脚本里的代码

Phase: Creation 就是创建阶段的全局上下文概览。为啥这时候变量没有值呢？这是因为创建阶段里，JS 引擎不多不少只做这么几件事：
1. 创建全局对象（Window/Global）
2. 创建 this ，并让它指向全局对象,也被称为 This Binding
3. LexicalEnvironment（词法环境） 组件被创建
4. VariableEnvironment（变量环境） 组件被创建
3. 给变量和函数安排内存空间
4. 默认给变量赋值为 undefined；将函数声明放入内存,创建作用域链

<span style={{fontWeight: 'bold',color:'#337ab7'}}>词法环境的结构如下：</span>

```js
GlobalExecutionContext = {  // 全局执行上下文
  LexicalEnvironment: {     // 词法环境
    EnvironmentRecord: {    // 环境记录
      Type: "Object",       // 全局环境
      // 标识符绑定在这里 
      outer: <null>         // 对外部环境的引用
  }  
}
 
FunctionExecutionContext = { // 函数执行上下文
  LexicalEnvironment: {     // 词法环境
    EnvironmentRecord: {    // 环境记录
      Type: "Declarative",      // 函数环境
      // 标识符绑定在这里      // 对外部环境的引用
      outer: <Global or outer function environment reference>  
  }  
}
```

```js
var a1 = '1'
var a2 = '2'

function aFn() {
    return {
        a1: a1,
        a2: a2
    }
}
console.log('test', a1)
```

js引擎对于我们是个黑盒，根据全局作用域的分析，创建阶段的执行上下文大概如下,可见发生在`预编译阶段`:
```js
Phase: Creation

window: global object

this: window

a1: undefined

a2: undefined

aFn: fn()
```
![](../assets/img-engine/创建阶段的执行上下文.png)

继续往下,执行阶段的全局上下文,看截图，当程序走到console,两个变量都已经赋值,因为 JS 引擎已经在一行一行执行代码、执行赋值操作了
![](../assets/img-engine/执行阶段阶段的执行上下文.png)
```js
Phase: Execution

window: global object

this: window

a1: 1

a2: 2

aFn: fn()
```

>所以变量提升的本质在于执行上下文的不同阶段，前者发生在预编译，后者发生在执行


### 执行上下文例子：
```js
function fn(a,b){
  debugger
  var a1 = 1
  let sum = a + b

  function test(){
    console.log('innerFn')
  }
}
fn(1,2)
```
![](../assets/img-engine/图4-执行上下文-内容.png)

>注意:执行上下文是在编译阶段创建并入栈的,即便代码没有执行。但 let，var 这些变量的声明都已经被提升，只是 let，const，这些词法环境的变量，只提升声明，不提升初始化，因此，V8 限制了访问，这被称为“暂时性死区”。

## 调用栈
首次运行JS代码时，会创建一个全局执行上下文并Push到当前的执行栈中。每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并Push到当前执行栈的栈顶。

函数执行完毕后，其对应的执行上下文也随之消失了叫做出栈，在 JS 代码的执行过程中，引擎会为我们创建“执行上下文栈”（也叫调用栈),当我们调用一个函数的时候，就会把它的上下文推入调用栈里，执行完毕后出栈，随后再为新的函数进行入栈操作。
```js
let global_let = 1
var global_val = 2
function testA() {
    console.log('执行第一个测试函数的逻辑');
    var testA1= 1
    debugger
    testB();
    console.log('再次执行第一个测试函数的逻辑');
}
function testB() {
    let test1 = 1
    var test2 = 2
    console.log('执行第二个测试函数的逻辑');
}
testA();
```
执行到testB:
![](../assets/img-engine/函数调用栈例子.png)

执行到testB,回到testA中的console:
![](../assets/img-engine/函数调用栈例子-执行完testB.png)

执行完回到了全局上下文，总结全过程：
![](../assets/img-engine/函数调用栈例子-执行完js.png)

### 调用栈例子
```js
var color = 'blue';
function changeColor() {
    var anotherColor = 'red';
    debugger
    function swapColors() {
        var tempColor = anotherColor;
        anotherColor = color;
        color = tempColor;
    }
    swapColors();
}
changeColor();
console.log('color:', color); // red
```
执行过程可以在 devTool 的 call stack 中看到，其中 anonymous 为全局上下文栈；其余为函数上下文栈

changeColor(),调用栈变成了2个：
* changeColor
* (anonymous)
![](../assets/img-engine/函数调用栈1.png)

当执行到swapColors(),调用栈变成了三个：
* swapColors 在栈顶
* changeColor
* (anonymous)
![](../assets/img-engine/函数调用栈2.png)

执行过程：

1. 首先创建了全局执行上下文，压入执行栈，其中的可执行代码开始执行。
2. 然后调用 changeColor 函数，JS引擎停止执行全局执行上下文，激活函数 changeColor 创建它自己的执行上下文，且把该函数上下文放入执行上下文栈顶，其中的可执行代码开始执行。
3. changeColor 调用了 swapColors 函数，此时暂停了 changeColor 的执行上下文，创建了 swapColors 函数的新执行上下文，且把该函数执行上下文放入执行上下文栈顶。
4. 当 swapColors 函数执行完后，其执行上下文从栈顶出栈，回到了 changeColor 执行上下文中继续执行。
5. changeColor 没有可执行代码，也没有再遇到其他执行上下文了，将其执行上下文从栈顶出栈，回到了 全局执行上下文 中继续执行。
6. 一旦所有代码执行完毕，JS引擎将从当前栈中移除 全局执行上下文。


```js
console.log(1);
function pFn() {
    console.log(2);
    (function cFn() {
        console.log(3);
    }());
    console.log(4);
}
pFn();
console.log(5);
//输出：1 2 3 4 5
```
先有全局环境下的执行上下文，调用pFn后将函数环境pFn的执行上下文压入栈中，由于pFn中执行了cFn函数，所以继续压入cFn函数的执行上下文，执行完毕后依次出栈。全局上下文只有应用程序退出前才会被销毁，比如关闭网页或者退出浏览器
![](../assets/img-engine/图4-执行栈.png)

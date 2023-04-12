---
title: 高阶函数-函数式编程-柯里化实现就是return fn
sidebar_position: 19
---

## 函数式编程中有两种操作是必不可少的
* 柯里化（Currying）,柯里化其实就是流水线上的加工站，
* 函数组合（Compose）,函数组合就是我们的流水线，它由多个加工站组成。

## 加工站——柯里化
柯里化的意思是将一个多元函数，转换成一个依次调用的单元函数。
是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```js
f(a,b,c) → f(a)(b)(c)

// 普通的add函数
function add(x, y) {
    return x + y
}

// 我们尝试写一个 curry 版本的 add 函数
function curryingAdd(x) {
    return function (y) {
        return x + y
    }
}

add(1, 2)           // 3
curryingAdd(1)(2)   // 3
```

## Currying 有哪些好处呢？

### 参数复用

```js
// 正常正则验证字符串 reg.test(txt)

// 函数封装后
function check(reg, txt) {
    return reg.test(txt)
}

check(/\d+/g, 'test')       //false
check(/[a-z]+/g, 'test')    //true

// Currying后
function curryingCheck(reg) {
    return function(txt) {
        return reg.test(txt)
    }
}

var hasNumber = curryingCheck(/\d+/g)
var hasLetter = curryingCheck(/[a-z]+/g)

hasNumber('test1')      // true
hasNumber('testtest')   // false
hasLetter('21212')      // false
```

### 提前确认
```js
var on = function(element, event, handler) {
    if (document.addEventListener) {
        if (element && event && handler) {
            element.addEventListener(event, handler, false);
        }
    } else {
        if (element && event && handler) {
            element.attachEvent('on' + event, handler);
        }
    }
}

var on = (function() {
    if (document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();

//换一种写法可能比较好理解一点，上面就是把isSupport这个参数给先确定下来了
var on = function(isSupport, element, event, handler) {
    isSupport = isSupport || document.addEventListener;
    if (isSupport) {
        return element.addEventListener(event, handler, false);
    } else {
        return element.attachEvent('on' + event, handler);
    }
}

/*
我们在做项目的过程中，封装一些dom操作可以说再常见不过，
上面第一种写法也是比较常见，但是我们看看第二种写法，
它相对一第一种写法就是自执行然后返回一个新的函数，
这样其实就是提前确定了会走哪一个方法，避免每次都进行判断。
*/
```

### 延迟运行
```js
// 像我们js中经常使用的bind，实现的机制就是Currying.

Function.prototype.bind = function (context) {
    var _this = this
    var args = Array.prototype.slice.call(arguments, 1)

    return function() {
        return _this.apply(context, args)
    }
}
```

## 最后再扩展一道经典面试题
```js
// 实现一个add方法，使计算结果能够满足如下预期：
// 实际上题目往往没有说清楚，这个调用不是直接返回15，
// 而是当它在一个表达式中参与运算时，会被当成15来用，
// 比如add(2) + 3得到5，或者div.innerHTML = add(1,2)(3)能让div中的内容为6。

/*
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
* */

function add() {
    console.log('...arguments',arguments)
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };
    console.log('_adder:',_args)

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}

console.log('a:',add(1)(2)(3)+0)                // 6
console.log('b:',add(1, 2, 3)(4)+0)             // 10
console.log('c:',add(1)(2)(3)(4)(5)+0)          // 15
console.log('d:',add(2, 6)(1)+0)                // 9
```

---
title: proxy-defineProperty区别
sidebar_position: 4
---

## Object.defineProperty
* 在 Vue2 里内部通过 Object.defineProperty API 劫持数据的变化，深度遍历 data 函数里的对象，给对象里每一个属性设置 getter、setter。
* 触发 getter 会通过 Dep 类做依赖收集操作，收集当前 Dep.target, 也就是 watcher。
* 触发 setter，执行 dep.notify 通知收集到的各类 watcher 更新，如 computed watcher、user watcher 、渲染 watcher。

### defineProperty基础：对象里目前存在的属性描述符有两种主要形式：数据描述符 和 存取描述符
描述符默认值汇总
* 拥有布尔值的键 configurable、enumerable 和 writable 的默认值都是 false。

* 属性值和函数的键 value、get 和 set 字段的默认值为 undefined。

1. configurable: configurable:true，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。 默认为 false。

2. enumerable: enumerable:true，该属性才会出现在对象的枚举属性中。 默认为 false。

3. writable: writable:true，属性的值也就是上面的 value，才能被赋值运算符 改变。 默认为 false。

4. value: 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。 默认为 undefined。

5. 存取描述符: get 属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。默认为 undefined。

6. 存取描述符: set 属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。 默认为 undefined。

defineProperty基础：需要注意的是:value,writable 和get,set不能同时进行配置

参数：
返回值:被传递给函数的对象
obj:要定义属性的对象
prop:监听属性
descriptor:要定义或修改的属性描述符
```js
let obj = {}
Object.defineProperty(obj, 'name', {
  configurable: true, // 可删除
  enumerable: true,	// 可枚举
  writable: true,	// 可修改
  value: 'val1'
})

console.log('test:', obj.name) // test: val1

// 同理：上面的例子还可以写成
let obj2 = {}
let name = 'val1'
Object.defineProperty(obj2, 'name', {
  configurable: true, // 可删除
  enumerable: true,	//可枚举
  get() {
    return name
  },
  set(newVal) {
    name = newVal
  }
})

console.log('test:', obj2.name) // test: val1

// 例子：注意： 应当直接在 Object 构造器对象上调用此方法，而不是在任意一个 Object 类型的实例上调用。
const object1 = {};
Object.defineProperty(object1, 'property1', {
    value: 42,
    writable: false
});

// object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42
```

<br />

### Object.defineProperty 不足
1. defineProperty 监听某个属性不能全对象监听,Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
>Vue 2.x 里，是通过 递归 + 遍历 data 对象来实现对数据的监控的

2. 无法检测对象的 property 的添加或移除。而对于这个缺陷，Vue2 提供了 vm.$set 和全局的 Vue.set API 让我们能够向对象添加响应式的 property

3. Object.defineProperty 的不能监听对数组索引的改动以及数组 length 的改动,为了解决这个问题，经过 vue 内部处理后可以使用以下几种方法来监听数组
```
push()
pop()
shift()
unshift()
splice()
sort()
reverse()
```

由于只针对了以上八种方法进行了 hack 处理,所以其他数组的属性也是检测不到的，还是具有一定的局限性。

obj的属性也可能是对象或者数组,可能需要递归

用户可能给obj赋值新的属性,这种情况可能需要单独处理

用Object.defineProperty实现数据响应式时我们必须要遍历所有的数据,还需要重写数组的方法,性能消耗也比较大,我们知道Vue2.x就是基于Object.defineProperty实现数据响应式的但新版本的Vue3放弃了Object.defineProperty采用Proxy重写了响应式系统

## ES6特性:Proxy返回一个新对象
### 用法-作用
Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

常用作用：
>在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写，修改某些操作的默认行为，这样我们可以不直接操作对象本身，而是通过操作对象的代理对象来间接来操作对象，达到预期的目的

语法：target: 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
handler: 一个通常以函数作为属性的对象

```js
let obj = { name: 'iphone', price: 99 }

let proxyObj = new Proxy(obj, {
  get: function (target, key) {
    console.log('get触发',{target, key})
    // 对象中不存在属性名时返回0
    return key in target ? target[key] : 0
  },
  // 通过代理，你可以轻松地验证向一个对象的传值。下面的代码借此展示了 set handler 的作用。
  set: function (target, key, value) {
    console.log('触发set:', { target, key, value })
    if (key === 'price') {
      if (value > 100) {
        console.log("报价过高")
        return true
      }
    }

    // obj[prop] = value;
    // return false; // 必须true 才成功赋值
    // 等同下面
    return Reflect.set(target, key, value)
  }
})

console.log('1:', proxyObj.name); // iphone
console.log('2:', proxyObj.namex); // 0
proxyObj.price = 666;
console.log('3:', proxyObj.price) // 99
proxyObj.price = 98;
console.log('4:', proxyObj.price) // 98
```

解析：
当我们访问对象内原本存在的属性时，会返回原有属性内对应的值;
如果试图访问一个不存在的属性时，会返回0 ，即我们访问 proxyObj.a 时，原本对象中有 a 属性，因此会返回 1 ，
当我们试图访问对象中不存在的 b 属性时，不会再返回 undefined ，而是返回了 0 ;

当我们试图去设置新的属性值的时候，总是会返回 888，因此，即便我们对 proxyObj.a 赋值为 666 ，但是并不会生效，依旧会返回 888


### 优点/特性
1. 区别1:proxy 对整个对象进行监听的方式比defineProperty是循环遍历对象属性的方式来进行监听性能好

2. proxy去代理了ob不会污染原对象（关键区别）,他会返回一个新的代理对象不会对原对象ob进行改动

3. proxy 可以监听对象新增属性，defineProperty不可以;劫持数据的get,set,deleteProperty,has,own

4. proxy 可以且不需要对数组的方法进行重载,defineProperty 不能监听数组下标改变值的变化，

5. Proxy 对象能够利用 handler 陷阱在 get、set 时捕获到任何变动，也能监听对数组索引的改动以及 数组 length 的改动

4. 利用 WeakMap,Map,Set 来实现依赖收集

## 不同点
### 不同点1:defineProperty监听数组,defineProperty不能监听数组长度变化-Proxy可以监听
```js
let obj = {
  name: 'js',
  age: 1,
  level: [1, 2, 3, 4, 5, 6]
}

function defineProperty(obj, key, val) {
  // obj的属性也可能是对象或者数组,这里递归实现非常简单,只需要把`observer`函数在`defineProperty` 重新调用一遍即可,
  // 在此判断传过来的`val`是不是一个对象,如果是一个对象在遍历下这个对象进行响应式收集
  observer(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 读取方法
      console.log('test1:读取', key, '成功')
      return val
    },
    set(newVal) {
      // 赋值监听方法
      if (newVal === val) return
      // observer(newVal)
      console.log('test1:监听赋值成功', key, 'key:', newVal)
      val = newVal
      // 可以执行渲染操作
    }
  })
}

function observer(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return
  }

  for (const key in obj) {
    // 给对象中的每一个方法都设置响应式
    defineProperty(obj, key, obj[key])
  }
}

observer(obj)
// 这里push 并不能实现监听
obj.level.push(10)
obj.level[0] = 100
obj.name = 'java'

const arr = [1, 2, 3, 4]
console.log('test:', Object.getOwnPropertyDescriptors(arr))
/*
可见：configurable: false,所以造成了pop,push这种会修改原数组长度的值都无法被监听到
test: {
  '0': { value: 1, writable: true, enumerable: true, configurable: true },
  '1': { value: 2, writable: true, enumerable: true, configurable: true },
  '2': { value: 3, writable: true, enumerable: true, configurable: true },
  '3': { value: 4, writable: true, enumerable: true, configurable: true },
  length: { value: 4, writable: true, enumerable: false, configurable: false }
}
* */
```

使用Proxy监听数组
```js
let handler = {
  set(target, key, value) {
    // 如果是数组，忽略更新length
    if (key === 'length') return true
    console.log('监听赋值成功', key, 'key:', value)
    return Reflect.set(target, key, value)
  },
  get(target, key) {
    if (typeof target[key] === 'object') {
      return new Proxy(target[key], handler)
    }
    console.log('读取', key, '成功', target[key])
    return Reflect.get(target, key)
  }
}

const list2 = [1, 2, 3, 4]
const proxyFn2 = new Proxy(list2, handler)
proxyFn2.push(1)
list2[0] = 100
```

### 那我们怎么来实现对数组的监听呢?答案就是重写Array的原型方法
原理就是重写数组的七个原始方法,当使用者执行这些方法时,我们就可以监听到数据的变化,然后做些跟新操作,下面我们在observer中加上关于对数组的判断
```js
const originalProto = Array.prototype;
const arrayProto = Object.create(originalProto); // 先克隆一份Array的原型出来
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodsToPatch.forEach(method => {
    arrayProto[method] = function () {
        // 执行原始操作
        originalProto[method].apply(this, arguments)
        console.log('监听赋值成功', method)
    }
})

function observer(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }
    if (Array.isArray(obj)) {
        // /*
        // 如果是数组, 重写原型
        obj.__proto__ = arrayProto
        // 传入的数据可能是多维度的,也需要执行响应式
        for (let i = 0; i < obj.length; i++) {
            observer(obj[i])
        }
        // */
    } else {
        for (const key in obj) {
            // 给对象中的每一个方法都设置响应式
            defineProperty(obj, key, obj[key])
        }
    }
}

function defineProperty(obj, key, val){
    // obj的属性也可能是对象或者数组,这里递归实现非常简单,只需要把`observer`函数在`defineProperty` 重新调用一遍即可,
    // 在此判断传过来的`val`是不是一个对象,如果是一个对象在遍历下这个对象进行响应式收集
    observer(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // 读取方法
            console.log('读取', key, '成功')
            return val
        },
        set(newVal) {
            // 赋值监听方法
            if (newVal === val) return
            // observer(newVal)
            console.log('监听赋值成功', newVal)
            val = newVal
            // 可以执行渲染操作
        }
    })
}

let obj3 = {
    name:'js',
    age:1,
    item:{
     name:'golang'
    },
    level:[1,2,3,4,5,6]
}

observer(obj3)
obj3.name = 'java'
obj3.item.name = 'test'
console.log('数组监听测试o----->')
obj3.level.push(10)
/*
*
数组监听测试o----->
读取 level 成功
监听赋值成功 push
* */
```

### 相同点:都不支持嵌套
```js
// 原始数据
const data = {
  name: 'Jane',
  age: 21,
  obj: {
    name: 'Tom'
  }
}

// defineProperty
Object.keys(data).forEach(key => {
  let oldValue = data[key]
  Object.defineProperty(data, key, {
    get() {
      console.log('%c 调用get', 'color: green', key)
      return oldValue
    },
    set(value) {
      console.log('%c 调用set', 'color: blue')
      oldValue = value
    }
  })
})

// console.log(data.obj.name)
data.obj.name = 'Tom01'    // 并不会触发set
data.name = 'Chen' // 触发 set
console.log(data.obj.name)
```

```js
// 原始数据
const data = {
  name: 'Jane',
  age: 21,
  obj: {
    name: 'Tom'
  }
}

// proxy
const proxyData = new Proxy(data, {
  get(target, prop) {
    console.log('%c 调用get', 'color: green', prop)
    return Reflect.get(target, prop)
  },
  set(target, prop, value) {
    console.log('%c 调用set', 'color: blue')
    return Reflect.set(target, prop, value)
  },
  deleteProperty(target, prop) {
    console.log('%c 调用delete', 'color: red')
    Reflect.deleteProperty(target, prop)
    return true
  }
})

// console.log(proxyData.obj.name)
proxyData.obj.name = 'Tom02' // 并不会触发set
proxyData.name = 'Chen' // 触发 set
console.log('1:',proxyData.obj.name)
```

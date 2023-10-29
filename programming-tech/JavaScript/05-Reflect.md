---
title: Reflect用法
sidebar_position: 7
---

## Reflect 是一个内置的对象，它提供拦截js操作的方法，是 ES6 为了操作对象而提供的新 API
```js
// es5 写法:Object.defineProperty
const student = {}
const r = Object.defineProperty(student, 'name', { value: 'Mike' })

// es6
const student = {}
const r = Reflect.defineProperty(student, 'name', { value: 'Mike' })


// es5 写法删除属性
const obj = { x: 1, y: 2 }
const a = delete obj.x

// es6 写法
const obj = { x: 1, y: 2 }
const a = Reflect.deleteProperty(obj, 'x')
```

### 例子2：对象读取操作
```js
// 普通写法
const obj = { name: 'test', age: 25 }
console.log('普通写法:',obj.name) // 'test'

// Reflect.get的读取方式
console.log('Reflect.get的读取方式:',Reflect.get(obj, 'name')) // test
```


### api
![](../assets/img-vue/Reflect-api.png)
```js
Reflect.apply(target, thisArg, args)

Reflect.construct(target, args)

// Reflect.get 方法查找并返回 target 对象的 name 属性，如果没有该属性，则返回 undefined。
Reflect.get(target, name, receiver)

// Reflect.set 方法设置 target 对象的 name 属性等于 value。
Reflect.set(target, name, value, receiver)

Reflect.defineProperty(target, name, desc)

Reflect.deleteProperty(target, name)

// 旧写法
'foo' in myObject // true
// 新写法
Reflect.has(myObject, 'foo') // true

Reflect.ownKeys(target)

Reflect.isExtensible(target)

Reflect.preventExtensions(target)

Reflect.getOwnPropertyDescriptor(target, name)

Reflect.getPrototypeOf(target)

Reflect.setPrototypeOf(target, prototype)
```

## 应用1：
让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如 `name in obj` 和 `delete obj[name]`，而 `Reflect.has(obj, name)`和 `Reflect.deleteProperty(obj, name)` 让它们变成了函数行为。
```js
let obj1 = { name: 1, test: 2 }
Reflect.deleteProperty(obj1, 'name')
console.log('test1', obj1)
```

## 应用2：
因为 `Reflect.get()`、`Reflect.set()` 具有返回值，并且 Proxy 的 handler 的 get、set 也要求有返回值，所以这时使用 Reflect 再合适不过了

```js
const proxy = new Proxy(obj, {
    get(target, key,) {
        return Reflect.get(target, key)
    },
    set(target, key, value) {
        return Reflect.set(target, key, value)
    }
})
proxy.name = 'Tom'
console.log('正常运行')
```

## 应用3：
修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc) 在无法定义属性时，
会抛出一个错误，定义成功时返回修改后的对象。而 Reflect.defineProperty(obj, name, desc) 在定义属性成功时返回 true ，失败时返回 false
```js
const obj = {}
Object.defineProperty(obj,"name",{
    value:"test1",
    writable: false //当设置为 false 的时候当前对象的属性值不允许被修改
})

console.log(Reflect.set(obj, 'name', 'test2')) // false
console.log('不阻塞了') // '不阻塞了'
```


## 应用4
Reflect.construct(target, args)
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// new 的写法
let p1 = new Person('Tom', 18);

// Reflect.construct 的写法，两种写法最终效果一样
let p2 = Reflect.construct(Person, ['Tom', 18]);
```

## 应用5
Reflect.getPrototypeOf 方法用于读取对象的`__proto__`属性，对应 Object.getPrototypeOf(obj)。
```js
let p = new Person();

console.log(Object.getPrototypeOf(p) === Person.prototype); // true
console.log(Reflect.getPrototypeOf(p) === Person.prototype);// true
```


## 应用6
Reflect.setPrototypeOf(obj, newProto)
Reflect.setPrototypeOf 方法用于设置目标对象的原型（prototype），对应 Object.setPrototypeOf(obj, newProto) 方法。
它返回一个布尔值，表示是否设置成功。
```js
let obj = {
    name: 'test'
}

// 旧写法，设置成功会返回修改后的对象
console.log(Object.setPrototypeOf(obj, Array.prototype));

// 新写法，设置成功会返回 true
console.log(Reflect.setPrototypeOf(obj, Array.prototype));
```

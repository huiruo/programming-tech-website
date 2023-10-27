## for...of为什么不能遍历Object对象
能够被for...of正常遍历的，都需要实现一个遍历器Iterator,它们的原型中都有一个Symbol.iterator方法，而Object对象并没有实现这个接口

```js
var obj = {
  'name': 'Jim Green',
  'age': 12
}

for (let key of obj) {
  console.log('for of obj', key)
}
// Uncaught TypeError: obj is not iterable


// 但是可以使用 for...in 循环遍历键名
for (let key in obj) {
  console.log('for in key', key)
}
/*
  for in key name
  for in key age
*/
```

### 要遍历对象的属性，您可以使用 for...in 循环或使用 Object.keys(),然后再用for of
for...of 循环通常用于遍历可迭代对象（例如数组、字符串、Map、Set等），但它不能直接用于遍历普通的对象（Object）。要遍历对象的属性，您可以使用 for...in 循环或使用 Object.keys(), Object.values(), 或 Object.entries() 方法，然后再使用 for...of 循环来遍历它们。
```js
const myObject = {
  name: "John",
  age: 30,
  city: "New York"
};

// 使用Object.keys()遍历对象属性
for (const key of Object.keys(myObject)) {
  console.log(key, myObject[key]);
}

// 使用Object.values()遍历对象属性值
for (const value of Object.values(myObject)) {
  console.log(value);
}

// 使用Object.entries()遍历键值对
for (const [key, value] of Object.entries(myObject)) {
  console.log(key, value);
}
```

## for in会遍历数组/对象所有的可枚举属性，包括原型,所以ES6中增加了一种新的循环语法来解决目前的问题
1. for-of循环用来遍历数据—例如数组中的值。
>这是最简洁、最直接的遍历数组元素的语法,这个方法避开了for-in循环的所有缺陷,与forEach()不同的是，它可以正确响应break、continue和return语句

2. for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象

3. for...in 循环主要是为了遍历对象而生，不适用于遍历数组


4. for-of循环也可以遍历其它的集合
>for-of循环不仅支持数组，还支持大多数类数组对象，例如DOM NodeList对象。
for-of循环也支持字符串遍历

### 最常用的，遍历对象数组
```js
const objectArray = [
  { name: "John", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 }
];

for (const obj of objectArray) {
  console.log(obj.name, obj.age);
}
```

### 例子for-of Set和Map的遍历

```js
function forOfTest(res) {
  for (const value of res) {
    const {
      orderId,
      price,
      qty,
      quoteQty,
      time,
      isBuyer,
      isMaker,
    } = value

    console.log('price:', price);
  }
}

forOfTest(order)


const map = new Map();
map.set('name', 'kepler');
map.set('number', '12138');

// 输出key val
console.log('for...of 输出key val');
for (let [key, val] of map) {
  console.log(key + "'s phone number is: " + val);
}

// 输出key
console.log('for...of 输出key');
for (let [key] of map) {
  console.log(key);
}

//输出val
log('for...of 输出val');
for (let [, val] of map) {
  console.log(val);
}
```

## for-of 和 for-in的区别
### for of 区别for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键， 也会遍历对象的整个原型链。

for...of 则不会这样，它只遍历当前对象不会遍历原型链。

参考for in

### for...of 循环：能遍历获得键值
1. for...in 循环：只能获得对象的键名，不能获得键值
2. for...of 循环：允许遍历获得键值

参考 for in

## for-of-遍历异步数组
可以使用正常的for循环或者for...of... 来遍历数组，并且使用async await来执行代码:
```js
// for循环
(async function(){
    for(let i = 0; i < taskList.length; i++) {
        await taskList[i]();
    }
})();

// for..of..
(async function(){
    for(let fn of taskList) {
    	await fn();
	}
})();


const fn1 = function() {
    return new Promise( resolve => {
        setTimeout(function(){
            console.log('fn1');
            resolve();
        }, 2000);
    });
};
const fn2 = function() {
    return new Promise( resolve => {
        setTimeout(function(){
            console.log('fn2');
            resolve();
        }, 1000);
    });
};
const fn3 = function() {
    console.log('fn3');
    return Promise.resolve(1);
};
const taskList = [fn1, fn2, fn3];
```
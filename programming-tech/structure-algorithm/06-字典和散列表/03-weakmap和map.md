## 弱化版本的区别
基本上，Map和Set与其弱化版本之间仅有的区别是：
* WeakSet或WeakMap类没有entries、keys和values等方法；
* 只能用对象作为键。

由于WeakSet或WeakMap类没有强引用的键，能够提升JavaScript垃圾回收的性能，并且因为没有迭代器方法，在不知道键的情况下，无法取出值。

（可以使用WeakMap 类封装 ES2015 类的私有属性）

## map 和对象
size map大小确定map只需要o（1）,普通对象需要o(n)

```js
const map = new Map();
map.set('someKey1', 1);
map.set('someKey2', 1);
...
map.set('someKey100', 1);

console.log(map.size) // 100, Runtime: O(1)

const plainObjMap = {};
plainObjMap['someKey1'] = 1;
plainObjMap['someKey2'] = 1;
...
plainObjMap['someKey100'] = 1;

console.log(Object.keys(plainObjMap).length) // 100, Runtime: O(n)
```
 
增删性能
map不需要把所有的键转换为字符串，节省了大量的性能
遍历

```js
const map = new Map();
map.set('someKey1', 1);
map.set('someKey2', 2);
map.set('someKey3', 3);

for (let [key, value] of map) {
  console.log(`${key} = ${value}`);
}
// someKey1 = 1
// someKey2 = 2
// someKey3 = 3

const plainObjMap = {};
plainObjMap['someKey1'] = 1;
plainObjMap['someKey2'] = 2;
plainObjMap['someKey3'] = 3;

for (let key of Object.keys(plainObjMap)) {
  const value = plainObjMap[key];
  console.log(`${key} = ${value}`);
}
// someKey1 = 1
// someKey2 = 2
// someKey3 = 3
```

顺序问题
对象中的key 是不保证顺序的，因为对于 number 是存放到 elements 中，会按照从小到大，对于字符串类型的是存放到 properties 中，会按照添加的顺。
map 是保证顺序的，按照添加的顺序依次出来的。

原型链问题
普通对象继承了很多原型方法，如toString
而map是干净的！

从 ECMAScript 2015 开始，如果你坚持使用原生的对象， 你可以 Object.create(null) 来生成一个干净的 object
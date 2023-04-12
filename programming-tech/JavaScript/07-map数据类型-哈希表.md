---
title: map数据类型-哈希表
sidebar_position: 4
---

## 哈希表概述
散列表（Hash table，也叫哈希表），是根据关键值(Key)而直接进行访问的数据结构。

也就是说，它通过把关键值key映射到表中一个位置来访问记录，以加快查找的速度。

这个映射函数叫做散列函数(哈希函数)，存放记录的数组叫做散列表。（哈希表一般用数组来存储）

向哈希表中存数据：
根据数据的key值和哈希函数，得到一个数组下标，这个下标的含义是数据在哈希表中的存放的位置。若发生了冲突，则再根据冲突的处理方法来解决冲突。找到最终存放的位置后，将数据存放进去。

在哈希表中查找数据：
根据数据的key值和哈希函数，以及解决冲突的方法来找。
所以哈希表查询某个数据的时间复杂度为o(1)

在时间复杂度为o(1),最差的时候 o(n)。

## 基础.java中hashmap和map关系
Map是存储键和值这样的键值对的数据的集合，但存储的数据是没有顺序的，其键不能重复，但其值是可以重复的。Map是一个接口，HashMap是实现了Map接口的类;
HashMap是基于哈希表实现的，每一个元素是一个key-value键值对。
对于 HashMap 而言，系统 key-value 当成一个整体进行处理，系统根据 Hash 算法来计算 key-value 的存储位置，这样可以保证能快速存、取 Map 的 key-value 对。

## js中Map
js中只有Map，没有HashMap。
从上面分析java中的HashMap可以发现，HashMap只是map的一种底层实现方式。所以在js里，用原生的map就够用了

在引入Map之前，js中保存键值对是通过对象的形式，而对象中，键的类型只能是字符串类型。而引入Map后，用Map来存储键值对，键的类型可以是数字类型，可以是字符串类型，可以是对象类型，函数类型等等

## map定义
`Map是一种数据结构，由键值对组成。Map看起来像一个二维数组，存放着一对对键值对，可通过键名获取对应的键值。`

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键，这给它的使用带来了很大的限制。
假设有这么一个数据:
```js
const dogs = [{name: 'max', size: 'small', breed: 'boston terrier', color: 'black'}, {name: 'don', size: 'large', breed: 'labrador', color: 'black'}, {name: 'shadow', size: 'medium', breed: 'labrador', color: 'chocolate'}
]

// 现在我们想要数组对象可以添加值，删除值及清空数组，用普通对象的方法处理如下：
let filters = {};
function addFilters(filters, key, value) {
    filters[key] = value;
}
function deleteFilters(filters, key) {
    delete filters[key];
}
function clearFilters(filters) {
    filters = {};
    return filters;
}
```
为了解决这个问题，ES6 提供了 Map 数据结构。
当数据量很大的时候，使用对象存储显然是不合理的，比如有的key是同名的场景下对象是不能区分的。

Map的精髓：极快的查找速度

也就是说，Object 结构提供了'字符串—值'的对应，Map 结构提供了'值—值'的对应，是一种更完善的 Hash 结构实现。

### 基础使用场景
```js
const codeMessage = new Map([
    [200, '请求返回成功'],
    [201, '新建或修改数据成功'],
    [202, '一个请求已经进入后台排队'],
    [204, '删除数据成功'],
    [400, '请求错误(InvalidParameter)'],
    [401, '用户没有权限'],
    [403, '用户得到授权，但是访问是被禁止的'],
    [404, 'Not found'],
    [408, '请求超时'],
    [410, '请求的资源被永久删除'],
    [500, '服务器内部错误(InternalError)'],
    [502, '网关错误'],
    [503, '服务不可用，服务器暂时过载或维护'],
    [504, '请求超时(Gateway Timeout)'],
]);

console.log('map test:', codeMessage.get(504))
```

## map 的作用
1. '键'的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了'字符串—值'的对应，Map 结构提供了'值—值'的对应，是一种更完善的 Hash 结构实现。
```
如果需要'键值对'的数据结构，Map 比 Object 更合适。

Object对象的键名只能是'数值'或'字符串'类型，而Map的键名可以是任意类型'数值'、'字符串'、'undefined'、'null'、'对象'
```

2. 有时候需要增删key时，使用map也会比obj方便


4. 接收后端返回的数据时，Map元素顺序与插入顺序相同，Object则按照键名的字典序排序

5. Map的作用就是做映射。对象也可以用来做映射，但由于对象的键名只能是字符串（或Symbol），因此存在一些限制，例如不能对对象进行映射。Map就没有这个限制，可以对任意类型进行映射。我有一次需要自己对DOM树进行遍历，由于遍历的规则可能导致重复访问节点，我就用Map将访问过的DOM节点映射为true，然后处理节点前进行判断。
```js
const visited = new Map();
visited.set(node, true);
if (!visited.get(node)) {
	// 当前节点未访问过，进行处理
}
```

简而言之，在需要对除字符串以外的数据类型进行映射的时候，Map就可以派上用场。


## 方法
```
clear 从映射中移除所有元素。
delete 从映射中移除指定的元素。
forEach 对映射中的每个元素执行指定操作。
get 返回映射中的指定元素。
has 如果映射包含指定元素，则返回 true。
set 添加一个新建元素到映射。
toString 返回映射的字符串表示形式。
valueOf 返回指定对象的原始值
```

### map键是否可重复? 不可
相比obj，Map专门设计用于频繁更新键值对，而且内置了具有可预测的名称和操作方法。

```js
let filters = new Map([
    ['breed', 'labrador'],
    ['size', 'large'],
    ['color', 'chocolate'],
])
console.log(filters.size) //3
filters.set('color', 'red') // 覆盖旧键
console.log(filters.get('color'));  // 'chocolate'
console.log(filters.delete('color'));
console.log(filters.get('color'));  // undefined
filters.clear()
filters.get('color');  // undefined
```

### 相对obj于map 遍历
常规对象里，为了遍历keys、values和entries，你必须将它们转换为数组，如使用Object.keys()、Object.values()和Object.entries()，
或使用for ... in，另外for ... in循环还有一些限制：它仅仅遍历可枚举属性、非Symbol属性，并且遍历的顺序是任意的。

在map 中：
for of遍历可迭代对象——Map。区别for in与for of，for in遍历可迭代对象的key，或数组的下标；
使用for…of或forEach来遍历。这点不同的优点是为你的程序带来更高的执行效率
Map结构是一个二维数组，通过ES6数组解构获取元素值

```js
for (let [key, value] of scoreMap) {
    console.log(`${key} 's score: `, value);
}
```

### values() 方法:和keys方法对应，values方法返回的就是Map对象中的value集合。
```js
const myMap2 = new Map([['Electronic Gadget', 'Smart Phone'], ['Input Devices', 'Mouse']]);
console.log('values():', myMap2.values());

//output: {"Smart Phone", "Mouse"}
```

---
title: algorithm
sidebar_position: 1
---

## 数据结构
```text
数据结构        抽象数据类型          数据表示

父链接树        UnionFind             整型数组

二分查找树      BST                   含有两个链接的节点

字符串          String                数组，偏移量和长度

二叉堆          PQ                    对象数组

散列表（拉链法）SeparateChaining HashSt 链表数组

散列表（线性探测法）   LinearProbingHashST  两个对象数组

图的邻接链表    Graph     Bag 对象的数组

单词查找树      TrieST    含有链接数组的节点

三向单词查早树  TST       含有三个链接的节点 
```

## 前端中数据结构和算法
### 单向链表
只能通过n.next来找到下一个节点,但是没有办法从当前节点找到上一个节点

特点：每个结点除了存放数据元素外，还要存储指向下一个节点的指针

优点：不要求大片连续空间，改变容量方便

缺点：不可随机存取，要耗费一定空间存放指针
```js
function Node(name,value){
	this.name = name;
	this.value = value;
	this.next = null;
}

let n1 = new Node("a",10);
n1.next = new Node("b",10);
n1.next.next = new Node("c",10);
n1.next.next.next = new Node("d",10);
```

### 原型链具有的两个基本特征
```
1.查找属性时可顺链向上查找
2.设置属性时只能设置当前对象的属性，而不会影响其上层链上的对象属性

第一点特征常常被人们称为继承，但是应该不能算是真正的继承，只能说在表现上与继承无异。
但是我们的原型链更应该是一个委托链，你可以通过这个委托链获取这个链上自你之后所有对象的能力，如果这个链发生变化你可能会失去某项能力。继承是对象本身具有这个能力或者特性，而原型委托是你及你身后的委托链具备这个能力。当然这对于对象的使用者我们来说是无所谓的，我们不必过分纠结到底是继承还是委托，但是了解事情的本质也是一件不错的事。
```

obj->Object.prototype->null

func->Function.prototype->Object.prototype->null

arr->Array.prototype->Object.prototype->null

```
原型链作为一个单向链表并没有完全发挥出单向链表的特性，换句话说JS中的原型链是只用部分能力的单向链表

原型对象规则：
1.每个构造函数在诞生的时候, 都会创建一个该函数的实例对象作为默认原型

2.而这个原型对象的原型, 则默认指向Object.prototype

3.当然, Object.prototype 也是它自己的实例

相当于 Object.prototype = new Object();

4. 但是, Object.prototype不再拥有原型对象

相当于 Object.prototype.__proto__ = null

5. 原型对象是有上限的
原型链通过__proto__属性连接各种原型对象
p1.__proto__ 可访问

p1.__proto__.__proto__ 可访问

p1.__proto__.__proto__.__proto__ 为null
```


## 你了解堆这种数据结构吗？讲一讲你对它的理解
是的，我了解堆（Heap）这种数据结构。堆是一种树状数据结构，通常用于优先队列、堆排序和图算法中。堆有两种主要类型：最大堆和最小堆。

1. **最大堆（Max Heap）**：在最大堆中，父节点的值大于或等于其子节点的值。这意味着堆中的根节点始终是最大值。最大堆通常用于实现优先队列，其中高优先级的元素位于堆的顶部。

2. **最小堆（Min Heap）**：在最小堆中，父节点的值小于或等于其子节点的值。这意味着堆中的根节点始终是最小值。最小堆也可用于优先队列，其中低优先级的元素位于堆的顶部。

堆的基本操作包括插入元素、删除最大（或最小）元素、查找最大（或最小）元素，以及堆的构建（建堆）等。这些操作通常具有O(log n)的时间复杂度，其中n是堆中元素的数量。

堆还有一个重要的性质，即"堆序性质"，它确保堆的树结构满足特定的排序要求。在最大堆中，堆序性质要求每个节点都大于或等于其子节点；在最小堆中，堆序性质要求每个节点都小于或等于其子节点。

堆的应用非常广泛，包括但不限于：

- 优先队列：用于处理具有不同优先级的任务。
- 堆排序：一种高效的排序算法，时间复杂度为O(n log n)。
- 图算法：在Dijkstra算法和Prim算法中使用堆来查找最短路径和最小生成树。
- 内存管理：在操作系统中用于分配和释放内存块。

总之，堆是一种非常有用的数据结构，可以在许多计算机科学和算法领域中发挥关键作用。它具有高效的插入和删除操作，以及对最大（或最小）元素的快速访问，这使得堆在处理大量数据和优先级排序方面非常有用。

## 用递归实现阶乘比如传入5，就返回5*4*3*2*1的结果
```js
function factorial(n) {
  // 基本情况：阶乘的定义中 0 和 1 的阶乘都是 1
  if (n === 0 || n === 1) {
    return 1;
  }
  // 递归情况：n 的阶乘等于 n 乘以 (n - 1) 的阶乘
  return n * factorial(n - 1);
}

// 例如，计算 5 的阶乘
const result = factorial(5);
console.log(result); // 输出 120
```

## 给出一个数组求最大值用什么方法，这个方法的原理
1. 遍历比较法：
```js
const array = [5, 2, 9, 1, 7];
let max = array[0]; // 初始时将第一个元素作为当前最大值

for (let i = 1; i < array.length; i++) {
  if (array[i] > max) {
    max = array[i]; // 更新当前最大值
  }
}

console.log("最大值：" + max);
```

2. max
```js
const array = [5, 2, 9, 1, 7];
const max = Math.max(...array);

console.log("最大值：" + max);
```
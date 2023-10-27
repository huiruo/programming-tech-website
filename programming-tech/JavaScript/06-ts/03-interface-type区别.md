
### type 是 类型别名，给一些类型的组合起别名，这样能够更方便地在各个地方使用
>type 声明的是类型别名，而 interface 声明的是新类型。
一个不太重要但是值得说给面试官的区别

语法：
```ts
interface Point {
  x: number;
  y: number;
}

type Point = {
  x: number;
  y: number;
};
```

### interface 是 接口,interface 只能表示对象结构的类型
有点像 type，可以用来代表一种类型组合，但它范围更小一些，只能描述对象结构。
```js
// 1、都可以描述一个对象或者函数
interface User {
    name: string,
    age: number
}

interface SetUser {
    (name: string, age: number) : void
}

type User = {
    name: string,
    age: number
}

type SetUser = (name: string, age: number) => void
```

## type 可用于 string、number、bool、undefined、null

而 interface 只能描述对象（含数组、函数、包装对象、元组; type 后面有 =，interface 没有；
```js
// id 可以为字符串或数字，那么我们可以定义这么一个名为 ID 的 type
type ID = string | number;

定义一个名为 Circle 的对象结构 type：

type Circle = {
  x: number;
  y: number;
  radius: number;
}
```

### type 可以 interface 不行:type 可以声明基本类别名，联合类型，元组类型
```js
type Name = string

interface Dog {
  wong();
}
interface Cat {
  miao();
}

type Pet = Dog | Cat;

let a: Pet = {
  wong() {},
};
```

```js
通过typeof获取实例的类型进行赋值
let div = document.createElement('div')
type B = typeof div
```

## 同名 interface 会合并，而同名 type 会报错
```js
interface Point {
  x: number;
}

interface Point {
  y: number;
}

const point: Point = { x: 10, y: 30 };
```

## 相同点
1. 都能描述对象（含数组、函数、包装对象）

2. 都能用于扩展一个类型。type 用交叉类型做到这一点，interface 用 extends 做到这一点。
接口是通过继承的方式来扩展，类型别名是通过 & 来扩展。

type 可以通过 & 的写法来继承 type 或 interface，得到一个交叉类型：
```js
type Shape = {
    x: number;
    y: number;
}

type Circle = Shape & { r: number }

const circle: Circle = { x: 0, y: 0, r: 8 }
```

## 推荐：能用interface就用interface
其实这个解释官方说的也比较明确，这样使用的原因是因为更贴合 JavaScript 对象的工作方式，再清晰一些，如果我们是定义一个 object，那么最好是使用 interface 去做类型声明，什么时候用 type 呢，当定义一个 function 的时候，用 type 会更好一些：

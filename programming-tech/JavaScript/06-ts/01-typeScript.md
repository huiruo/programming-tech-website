## TypeScript静态类型有什么好处
它的主要功能之一是为JavaScript变量提供类型支持。

* 在JavaScript中提供类型支持可以实现静态检查，从而更容易地重构代码和寻找bug。

* JavaScript中没有提供的面向对象的概念了，例如接口和私有属性（这在开发数据结构和排序算法时非常有用）。

* 类型可以一定程度上充当文档,TS 的类型系统、TSC 的静态检查、VS Code 等 IDE 的强力支持对于开发出可维护性好、稳定性高的大型 JavaScript 应用的重要性。


## 基础类型
1. 布尔类型（boolean）
2. 数字类型（number）
3. 字符串类型(string)
4. 数组类型（array）
5. 元组类型（tuple）
6. 枚举类型（enum）
7. 任意类型（any）
8. null 和 undefined
9. void类型
10. never类型

### 四大类型
```ts
// Boolean 类型
let isDone: boolean = false;

// Number 类型
let count: number = 10;

// String 类型
let name: string = "Semliker";

// Array 类型
const _checkList: string[] = ['all']

// Array泛型语法
let list: Array<number> = [1, 2, 3]; // Array<number>泛型语法
```

###  Enum 类型
使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。 TypeScript 支持数字的和基于字符串的枚举。
```js
enum addTypeEnums {Editor = "Editor", Commenter = "Commenter", Reader = "Reader"}

const onAddItem = (addType: string) => {
  let word = ""
  switch(addType){
    case addTypeEnums.Editor:
      word = "编辑者"
      break;
    case addTypeEnums.Commenter:
      console.log(22)
      word = "评论者"
      break;
    case addTypeEnums.Reader:
      console.log(33)
      word = "阅读者"
      break;
  }
  setAddTypeAlias(word)
}

// 0:未提交,1待复核,2:已通过,3:已驳回
import { Tag } from "antd";
import React from "react";

enum Status {total = -1, unSubmit = 0, waitCheck = 1, passed = 2, rejected = 3}

// 0:未提交,1待复核,2:已通过,3:已驳回
export default ({status}) => {
  switch ( status ) {
    case Status.unSubmit:
      return <Tag color="#108ee9">未提交</Tag>;
    case Status.waitCheck:
      return <Tag color="#2db7f5">待复核</Tag>;
    case Status.passed:
      return <Tag color="#87d068">已通过</Tag>;
    case Status.rejected:
    default:
      return <Tag color="#f50">已驳回</Tag>;
  }
}
```

### Any 类型:任何类型都可以被归为 any 类型
在许多场景下，这太宽松了。使用 `any` 类型，可以很容易地编写类型正确但在运行时有问题的代码。如果我们使用 `any` 类型，就无法使用 TypeScript 提供的大量的保护机制。为了解决 `any` 带来的问题，TypeScript 3.0 引入了 `unknown`类型。
```js
let notSure: any = 666;
notSure = "Semlinker";
notSure = false;
```

### unknown 类型
unknown 类型在TypeScript中用于表示变量的类型是未知的，或者可以是多种不同类型的值。它通常用于提供类型安全性，而在运行时需要进行类型检查或类型断言，以确定变量的确切类型。以下是一些关于unknown类型的使用示例和作用：

1. 作为函数参数类型：
unknown 类型通常用于函数参数，特别是当函数不确定要接收什么类型的参数时。在函数内部，您需要进行类型检查以确保参数的类型安全。这可以帮助防止不正确的数据类型导致运行时错误。
```js
function processInput(input: unknown): void {
  if (typeof input === "string") {
    console.log(input.toUpperCase());
  } else {
    console.log("Input is not a string");
  }
}
```

2. 作为函数返回值类型：
unknown 也可用作函数的返回值类型，因为它表示函数的确切返回类型是未知的。在调用函数后，您需要进行类型检查或类型断言以使用返回值。
```js
function generateValue(): unknown {
  return Math.random() > 0.5 ? "hello" : 42;
}

const result = generateValue();

if (typeof result === "string") {
  console.log("It's a string: " + result);
} else {
  console.log("It's not a string");
}
```

3. 作为变量类型：
您还可以将变量声明为 unknown 类型，以处理各种类型的数据。在使用这些变量之前，需要进行类型检查或类型断言。
```js
let data: unknown = fetchDataFromAPI();

if (Array.isArray(data)) {
  // 处理数组
} else if (typeof data === "object") {
  // 处理对象
}
```

>总结：unknown 类型在TypeScript中的作用是提供类型安全性，尤其在处理不确定类型的数据时非常有用。它鼓励开发者在使用这些值之前进行类型检查，以减少类型错误，并使代码更加可靠。


> `unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。这是有道理的：只有能够保存任意类型值的容器才能保存 `unknown` 类型的值。毕竟我们不知道变量 `value` 中存储了什么类型的值。

就像所有类型都可以赋值给 `any`，所有类型也都可以赋值给 `unknown`。这使得 `unknown` 成为 TypeScript 类型系统的另一种顶级类型（另一种是 `any`）。下面我们来看一下 `unknown` 类型的使用示例：

```js
let value: unknown;

value = true; // OK
value = 42; // OK
value = "Hello World"; // OK
value = []; // OK
value = {}; // OK
value = Math.random; // OK
value = null; // OK
value = undefined; // OK
value = new TypeError(); // OK
value = Symbol("type"); // OK

// 对 `value` 变量的所有赋值都被认为是类型正确的。但是，当我们尝试将类型为 `unknown` 的值赋值给其他类型的变量时会发生什么？
let value: unknown;

let value1: unknown = value; // OK
let value2: any = value; // OK
let value3: boolean = value; // Error
let value4: number = value; // Error
let value5: string = value; // Error
let value6: object = value; // Error
let value7: any[] = value; // Error
let value8: Function = value; // Error
```

### unknown 和 any类型的区别
在TypeScript中，unknown 和 any 都是用于处理不明确类型的数据的类型，但它们有一些重要的区别：
1. 类型安全：
  * any：使用 any 类型会关闭 TypeScript 的类型检查，因此您可以对任何类型的值执行任何操作，而不会得到编译时类型检查错误。这意味着您失去了类型的安全性。
  * unknown：使用 unknown 类型保留了类型安全性。当您使用 unknown 类型时，您必须进行类型检查或类型断言，以在运行时访问其值，这有助于避免在编译时出现类型错误。
2. 类型推断：
  * any：any 类型的值可以赋给任何其他类型，而且它不会触发类型推断。这意味着当您使用 any 类型时，TypeScript不会提供有关该值的类型信息。
  * unknown：使用 unknown 类型时，TypeScript会提供类型检查信息，但在尝试访问其属性或执行操作之前，您必须明确指定类型或进行类型检查。
3. 类型断言：
  * any：不需要类型断言，因为 any 类型是兼容的，可以赋给任何其他类型。
  * unknown：需要进行类型断言或类型检查，以告诉TypeScript您正在处理的确切类型。
示例：

```ts
let x: any;
let y: unknown;

x = 10;  // 没有类型检查问题
y = 10;  // 没有类型检查问题

let a: string = x;  // 无类型检查问题
let b: string = y;  // 错误：不能将类型“unknown”分配给类型“string”

if (typeof y === "string") {
  let c: string = y;  // 类型检查通过，需要类型检查
}

// 类型断言
let d: string = <string>y;  // 使用类型断言，显式告诉编译器 y 是一个字符串
```

综上所述，unknown 更适合在需要处理不明确类型的情况下保持类型安全，而 any 更适合在类型检查不太重要或类型不确定的情况下使用。一般来说，推荐尽量避免使用 any，因为它会削弱 TypeScript 的类型检查功能。



### Tuple 类型 
众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组。在 JavaScript 中是没有元组的，元组是 TypeScript 中特有的类型，其工作方式类似于数组。
元组可用于定义具有有限数量的未命名属性的类型。每个属性都有一个关联的类型。使用元组时，必须提供每个属性的值。为了更直观地理解元组的概念，我们来看一个具体的例子：
```js
let tupleType: [string, boolean];
tupleType = ["Semlinker", true];
//在上面代码中，我们定义了一个名为 `tupleType` 的变量，它的类型是一个类型数组 `[string, boolean]`，然后我们按照正确的类型依次初始化 tupleType 变量。与数组一样，我们可以通过下标来访问元组中的元素：
console.log(tupleType[0]); // Semlinker
console.log(tupleType[1]); // true

1.在元组初始化的时候，如果出现类型不匹配的话，比如：
tupleType = [true, "Semlinker"]; //TypeScript 编译器会提示以下错误信息：
[0]: Type 'true' is not assignable to type 'string'.
[1]: Type 'string' is not assignable to type 'boolean'.
2.很明显是因为类型不匹配导致的。在元组初始化的时候，我们还必须提供每个属性的值，不然也会出现错误，比如：
tupleType = ["Semlinker"]; //Property '1' is missing in type '[string]' but required in type '[string, boolean]'.
```

### Void 类型
void 类型像是与 any 类型相反，它表示没有任何类型。

```js
// 声明函数返回值为void
function warnUser(): void {
  console.log("This is my warning message");
}
```

### Null 和 Undefined 类型
默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给 `number`类型的变量。
然而，如果你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自的类型。
```js
let u: undefined = undefined;
let n: null = null;
```

### Never 类型
`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
```js
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

## 2.TypeScript 断言
通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。

类型断言有两种形式：
### “尖括号” 语法
```ts
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```
### as 语法
```ts
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

## 3.参数
### 3.1.可选参数及默认参数
```ts
function createUserId(name: string, id: number, age?: number): string {
  return name + id;
}

// 默认参数
function createUserId(
  name: string = "Semlinker",
  id: number,
  age?: number
): string {
  return name + id;
}
```

### 3.2.剩余参数
```ts
function push(array, ...items) {
  items.forEach(function (item) {
    array.push(item);
  });
}

let a = [];
push(a, 1, 2, 3);
```

## 4.函数重载
函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。要解决前面遇到的问题，方法就是为同一个函数提供多个函数类型定义来进行函数重载，编译器会根据这个列表去处理函数的调用。

在以下代码中，我们为 add 函数提供了多个函数类型定义，从而实现函数的重载。之后，可恶的错误消息又消失了，因为这时 result 变量的类型是 `string` 类型。在 TypeScript 中除了可以重载普通函数之外，我们还可以重载类中的成员方法。
```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;

function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}
```

方法重载是指在同一个类中方法同名，参数不同（参数类型不同、参数个数不同或参数个数相同时参数的先后顺序不同），调用时根据实参的形式，选择与它匹配的方法执行操作的一种技术。所以类中成员方法满足重载的条件是：在同一个类中，方法名相同且参数列表不同。下面我们来举一个成员方法重载的例子：
```js
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: string, b: number): string;
  add(a: number, b: string): string;
  add(a: Combinable, b: Combinable) {
    if (typeof a === "string" || typeof b === "string") {
      return a.toString() + b.toString();
    }
    return a + b;
  }
}

const calculator = new Calculator();
const result = calculator.add("Semlinker", " Kakuqo");
```
> 这里需要注意的是，当 TypeScript 编译器处理函数重载时，它会查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。 因此，在定义重载的时候，一定要把最精确的定义放在最前面。另外在 Calculator 类中，`add(a: Combinable, b: Combinable){ }` 并不是重载列表的一部分，因此对于 add 成员方法来说，我们只定义了四个重载方法。

## 5.类
### 5-1.类的属性与方法
```js
class Greeter {
  // 静态属性
  static cname: string = "Greeter";
  // 成员属性
  greeting: string;

  // 构造函数 - 执行初始化操作
  constructor(message: string) {
    this.greeting = message;
  }

  // 静态方法
  static getClassName() {
    return "Class name is Greeter";
  }

  // 成员方法
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

### 5-2.访问器
在 TypeScript 中，我们可以通过 `getter` 和 `setter` 方法来实现数据的封装和有效性校验，防止出现异常数据。
```ts
let passcode = "Hello TypeScript";

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (passcode && passcode == "Hello TypeScript") {
      this._fullName = newName;
    } else {
      console.log("Error: Unauthorized update of employee!");
    }
  }
}

let employee = new Employee();
employee.fullName = "Semlinker";
if (employee.fullName) {
  console.log(employee.fullName);
}
```

### 5-3.类的继承
```ts
class Animal {
  name: string;
  
  constructor(theName: string) {
    this.name = theName;
  }
  
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}
let sam = new Snake("Sammy the Python");
sam.move();
```

## 泛型
设计泛型的关键目的是在成员之间提供有意义的约束，这些成员可以是：
* 类的实例成员
* 类的方法
* 函数参数
* 函数返回值。

泛型（Generics）是允许同一个函数接受不同类型参数的一种模板。相比于使用 any 类型，使用泛型来创建可复用的组件要更好，因为泛型会保留参数类型。

### 泛型接口
```ts
interface GenericIdentityFn<T> {
  (arg: T): T;
}
```

### 泛型类
```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

### 泛型变量
其实这些大写字母并没有什么本质的区别，只不过是一个约定好的规范而已。也就是说使用大写字母 A-Z 定义的类型变量都属于泛型，把 T 换成 A，也是一样的。下面我们介绍一下一些常见泛型变量代表的意思：
- T（Type）：表示一个 TypeScript 类型
- K（Key）：表示对象中的键类型
- V（Value）：表示对象中的值类型
- E（Element）：表示元素类型

### 泛型函数
identity函数。 这个函数会返回任何传入它的值。 你可以把这个函数当成是 echo命令。

不用泛型的话，这个函数可能是下面这样：
```ts
function identity(arg: number): number {
    return arg;
}
```

-或者，我们使用any类型来定义函数：
使用any类型会导致这个函数可以接收任何类型的arg参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。
```ts
function identity(arg: any): any {
    return arg;
}
```

使用泛型: 我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。
```ts
function identity<T>(arg: T): T {
    return arg;
}
```


我们定义了泛型函数后，可以用两种方法使用。 
+ 第一种是，传入所有的参数，包含类型参数：
```ts
let output = identity<string>("myString");  // type of output will be 'string'
```

+ 第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：
```ts
let output = identity("myString");  // type of output will be 'string'
```

### 泛型数组
如果我们想同时打印出arg的长度。 我们很可能会这样做：如果这么做，编译器会报错说我们使用了arg的.length属性，但是没有地方指明arg具有这个属性
```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

```

现在假设我们想操作T类型的数组而不直接是T。由于我们操作的是数组，所以.length属性是应该存在的。 我们可以像创建其它数组一样创建这个数组：
```ts
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);  // Array has a .length, so no more error
  return arg;
}
```
> 你可以这样理解loggingIdentity的类型：泛型函数loggingIdentity，接收类型参数T和参数arg，它是个元素类型是T的数组，并返回元素类型是T的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T的的类型为number。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性。

## 装饰器
参考：[装饰器](./装饰器)

## 数组解构/对象结构
```js
//数组解构
let x: number; let y: number; let z: number;
let five_array = [0,1,2,3,4];
[x,y,z] = five_array;

//对象解构
type Keys = "firstname" | "surname"
type DudeType = {
  [key in Keys]: string
}

const test: DudeType = {
  firstname: "Pawel",
  surname: "Grzybek"
}
```

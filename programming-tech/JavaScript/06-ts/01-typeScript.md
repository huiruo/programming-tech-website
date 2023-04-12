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

```ts
Boolean 类型 ------------>
let isDone: boolean = false;

Number 类型 ------------>
let count: number = 10;

String 类型 ------------>
let name: string = "Semliker";

Array 类型 ------------>
const _checkList: string[] = ['all']
//泛型语法
let list: Array<number> = [1, 2, 3]; // Array<number>泛型语法

Enum 类型 ------------->
使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。 TypeScript 支持数字的和基于字符串的枚举。
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

//0:未提交,1待复核,2:已通过,3:已驳回
import { Tag } from "antd";
import React from "react";

enum Status {total = -1, unSubmit = 0, waitCheck = 1, passed = 2, rejected = 3}

//0:未提交,1待复核,2:已通过,3:已驳回
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

Any 类型:任何类型都可以被归为 any 类型 ----------->
let notSure: any = 666;
notSure = "Semlinker";
notSure = false;

// 在许多场景下，这太宽松了。使用 `any` 类型，可以很容易地编写类型正确但在运行时有问题的代码。如果我们使用 `any` 类型，就无法使用 TypeScript 提供的大量的保护机制。为了解决 `any` 带来的问题，TypeScript 3.0 引入了 `unknown`类型。
unknown 类型 -------->
// 就像所有类型都可以赋值给 `any`，所有类型也都可以赋值给 `unknown`。这使得 `unknown` 成为 TypeScript 类型系统的另一种顶级类型（另一种是 `any`）。下面我们来看一下 `unknown` 类型的使用示例：
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

//对 `value` 变量的所有赋值都被认为是类型正确的。但是，当我们尝试将类型为 `unknown` 的值赋值给其他类型的变量时会发生什么？
let value: unknown;

let value1: unknown = value; // OK
let value2: any = value; // OK
let value3: boolean = value; // Error
let value4: number = value; // Error
let value5: string = value; // Error
let value6: object = value; // Error
let value7: any[] = value; // Error
let value8: Function = value; // Error
// `unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。直观地说，这是有道理的：只有能够保存任意类型值的容器才能保存 `unknown` 类型的值。毕竟我们不知道变量 `value` 中存储了什么类型的值。

Tuple 类型  ------------>
众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组。在 JavaScript 中是没有元组的，元组是 TypeScript 中特有的类型，其工作方式类似于数组。
元组可用于定义具有有限数量的未命名属性的类型。每个属性都有一个关联的类型。使用元组时，必须提供每个属性的值。为了更直观地理解元组的概念，我们来看一个具体的例子：
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

Void 类型--------> void 类型像是与 any 类型相反，它表示没有任何类型。
// 声明函数返回值为void
function warnUser(): void {
  console.log("This is my warning message");
}

Null 和 Undefined 类型   ---------->
let u: undefined = undefined;
let n: null = null;
//默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给 `number`类型的变量。
//然而，如果你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自的类型。

Never 类型  -------->`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

## TypeScript 断言:
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

## 可选参数及默认参数
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

## 剩余参数
```ts
function push(array, ...items) {
  items.forEach(function (item) {
    array.push(item);
  });
}

let a = [];
push(a, 1, 2, 3);
```

## 函数重载
函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。要解决前面遇到的问题，方法就是为同一个函数提供多个函数类型定义来进行函数重载，编译器会根据这个列表去处理函数的调用。
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

在以上代码中，我们为 add 函数提供了多个函数类型定义，从而实现函数的重载。之后，可恶的错误消息又消失了，因为这时 result 变量的类型是 `string` 类型。在 TypeScript 中除了可以重载普通函数之外，我们还可以重载类中的成员方法。

方法重载是指在同一个类中方法同名，参数不同（参数类型不同、参数个数不同或参数个数相同时参数的先后顺序不同），调用时根据实参的形式，选择与它匹配的方法执行操作的一种技术。所以类中成员方法满足重载的条件是：在同一个类中，方法名相同且参数列表不同。下面我们来举一个成员方法重载的例子：
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
这里需要注意的是，当 TypeScript 编译器处理函数重载时，它会查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。 因此，在定义重载的时候，一定要把最精确的定义放在最前面。另外在 Calculator 类中，`add(a: Combinable, b: Combinable){ }` 并不是重载列表的一部分，因此对于 add 成员方法来说，我们只定义了四个重载方法。
```

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

## 类的属性与方法
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

## 访问器
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

## 类的继承
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
设计泛型的关键目的是在成员之间提供有意义的约束，这些成员可以是：类的实例成员、类的方法、函数参数和函数返回值。
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
```ts
其实这些大写字母并没有什么本质的区别，只不过是一个约定好的规范而已。也就是说使用大写字母 A-Z 定义的类型变量都属于泛型，把 T 换成 A，也是一样的。下面我们介绍一下一些常见泛型变量代表的意思：
- T（Type）：表示一个 TypeScript 类型
- K（Key）：表示对象中的键类型
- V（Value）：表示对象中的值类型
- E（Element）：表示元素类型
```
### 泛型函数
identity函数。 这个函数会返回任何传入它的值。 你可以把这个函数当成是 echo命令。
-不用泛型的话，这个函数可能是下面这样：
```ts
function identity(arg: number): number {
    return arg;
}
-或者，我们使用any类型来定义函数：
使用any类型会导致这个函数可以接收任何类型的arg参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。
function identity(arg: any): any {
    return arg;
}
```
使用泛型
```ts
function identity<T>(arg: T): T {
    return arg;
}
我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。

我们定义了泛型函数后，可以用两种方法使用。 
+ 第一种是，传入所有的参数，包含类型参数：
let output = identity<string>("myString");  // type of output will be 'string'

+ 第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：
let output = identity("myString");  // type of output will be 'string'
```
### 泛型数组
```ts
如果我们想同时打印出arg的长度。 我们很可能会这样做：如果这么做，编译器会报错说我们使用了arg的.length属性，但是没有地方指明arg具有这个属性
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```
```ts
现在假设我们想操作T类型的数组而不直接是T。由于我们操作的是数组，所以.length属性是应该存在的。 我们可以像创建其它数组一样创建这个数组：
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);  // Array has a .length, so no more error
  return arg;
}

你可以这样理解loggingIdentity的类型：泛型函数loggingIdentity，接收类型参数T和参数arg，它是个元素类型是T的数组，并返回元素类型是T的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T的的类型为number。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性。
```

## 装饰器
饰器其实是个很“黑科技”的东西，只要运行时修改类能实现的功能，都能用装饰器实现。所以，在这里说一下我对装饰器的抽象理解，也是我判断什么时候该使用装饰器的选型标准：
装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。
通俗的理解可以认为就是在原有代码外层包装了一层处理逻辑。
```
js的整个部署运行过程，可以分为构建期和运行期。而装饰器在构建期和运行期之间，给开发者开辟了一个“后构建期”、或者叫“前运行期”的空间，允许你在业务真正开始运行之前，加工你的代码。

可能有些时候，我们会对传入参数的类型判断、对返回值的排序、过滤，对函数添加节流、防抖或其他的功能性代码，基于多个类的继承，各种各样的与函数逻辑本身无关的、重复性的代码。
所以，对于装饰器，可以简单地理解为是非侵入式的行为修改。
```

```注解
Java的Annotation因为相当于多加了一层（标记 + 处理逻辑），是一把双刃剑。好处是，在不动代码的情况下你可以通过外部配置来修改程序的行为。比如给一个函数打上@Test标。如果通过UT框架运行，这些打标的函数会被当作是测试用例；但如果外部直接用普通的main启动，这些@Test就会没有一样，不会影响代码本身的逻辑。但反过来，也容易引来一些问题。比如有的时候，你很难知道那个根据标记执行的逻辑是不是真的跑了。也许你哪里配置拼错一个字，或者classpath少依赖一个包，就造成那个逻辑并没有真的执行。这时从表面上也许很难看出来出错了。


Java中的注解则不同，它是从语言层面为代码中的类，函数，字段增加一些运行时可以读到的元数据，而注解的提供者要在运行时对这些元数据进行读取，并做相应的处理。
Java语言层面只提供定义注解类，编译时解析注解并保存到类文件中，在运行时提供反射机制供注解开发者读取这些元数据。
但注解的具体用法就八仙过海，各显神通了，不限于装饰器模式。
```

```装饰器
装饰器是一个有逻辑的，可以执行的函数，只不过其写法有些特殊要求；而Java里面的Annotation只是个标记，需要其他代码来“根据标记执行“。
但java世界里做类似decorator的事情，希望动态魔改一个函数的行为，可以用动态代理或者AOP。
```


### 装饰器执行时机
修饰器对类的行为的改变，是代码编译时发生的（不是TypeScript编译，而是js在执行机中编译阶段），而不是在运行时。这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。
在Node.js环境中模块一加载时就会执行
### 装饰器本身其实就是一个函数，理论上忽略参数的话，任何函数都可以当做装饰器使用。

### 装饰器的类型有：类装饰器、访问器装饰器、属性装饰器、方法装饰器、参数装饰器，但是没有函数装饰器(function)。
### 类装饰器
应用于类构造函数，其参数是类的构造函数。
注意class并不是像Java那种强类型语言中的类，而是JavaScript构造函数的语法糖。
```ts
function helloWord(target: any) {
    console.log('hello Word!');
}

@helloWord
class HelloWordClass {

}
使用tsc编译后,执行命令node helloword.js，输出结果如下：hello Word!
```

```ts
function addAge(args: number) {
    return function (target: Function) {
        target.prototype.age = args;
    };
}

@addAge(18)
class Hello {
    name: string;
    age: number;
    constructor() {
        console.log('hello');
        this.name = 'yugo';
    }
}

console.log(Hello.prototype.age);//18
let hello = new Hello();

console.log(hello.age);//18
```
### 方法装饰器
它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。
方法装饰会在运行时传入下列3个参数：
1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、成员的名字。
3、成员的属性描述符{value: any, writable: boolean, enumerable: boolean, configurable: boolean}。
```ts
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}
function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   console.log(target);
   console.log("prop " + propertyKey);
   console.log("desc " + JSON.stringify(descriptor) + "\n\n");
};
@addAge
class Hello{
  name: string;
  age: number;
  constructor() {
    console.log('hello');
    this.name = 'yugo';
  }
  @method
  hello(){
    return 'instance method';
  }
  @method
  static shello(){
    return 'static method';
  }
}

我们得到的结果是:
Hello { hello: [Function] }
prop hello
desc {"writable":true,"enumerable":true,"configurable":true}
{ [Function: Hello] shello: [Function] }
prop shello
desc {"writable":true,"enumerable":true,"configurable":true}

假如我们修饰的是 hello 这个实例方法，第一个参数将是原型对象，也就是 Hello.prototype。
假如是 shello 这个静态方法，则第一个参数是构造器 constructor。第二个参数分别是属性名，第三个参数是属性修饰对象。
```
### 访问器装饰器
访问器装饰器应用于访问器的属性描述符，可用于观察，修改或替换访问者的定义。 访问器装饰器不能在声明文件中使用，也不能在任何其他环境上下文中使用（例如在声明类中）。
注意: TypeScript不允许为单个成员装饰get和set访问器。相反，该成员的所有装饰器必须应用于按文档顺序指定的第一个访问器。这是因为装饰器适用于属性描述符，它结合了get和set访问器，而不是单独的每个声明。

访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
1.对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2.成员的名字。
3.成员的属性描述符。
```ts
下面是使用了访问器装饰器（@configurable）的例子，应用于Point类的成员上：
class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}

function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}
```

### 属性装饰器
属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、成员的名字。
```ts
function log(target: any, propertyKey: string) {
    let value = target[propertyKey];
    // 用来替换的getter
    const getter = function () {
        console.log(`Getter for ${propertyKey} returned ${value}`);
        return value;
    }
    // 用来替换的setter
    const setter = function (newVal) {
        console.log(`Set ${propertyKey} to ${newVal}`);
        value = newVal;
    };
    // 替换属性，先删除原先的属性，再重新定义属性
    if (delete this[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}
class Calculator {
    @log
    public num: number;
    square() {
        return this.num * this.num;
    }
}
let cal = new Calculator();
cal.num = 2;
console.log(cal.square());
// Set num to 2
// Getter for num returned 2
// Getter for num returned 2
// 4
```

### 方法参数装饰器
参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、参数的名字。
3、参数在函数参数列表中的索引。
```ts
const parseConf = [];
class Modal {
    @parseFunc
    public addOne(@parse('number') num) {
        console.log('num:', num);
        return num + 1;
    }
}

// 在函数调用前执行格式化操作
function parseFunc(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        for (let index = 0; index < parseConf.length; index++) {
            const type = parseConf[index];
            console.log(type);
            switch (type) {
                case 'number':
                    args[index] = Number(args[index]);
                    break;
                case 'string':
                    args[index] = String(args[index]);
                    break;
                case 'boolean':
                    args[index] = String(args[index]) === 'true';
                    break;
            }
            return originalMethod.apply(this, args);
        }
    };
    return descriptor;
}

// 向全局对象中添加对应的格式化信息
function parse(type) {
    return function (target, name, index) {
        parseConf[index] = type;
        console.log('parseConf[index]:', type);
    };
}
let modal = new Modal();
console.log(modal.addOne('10')); // 11
```

## 解构别名类型限制
在用 TypeScript 开发时需要解构一个对象。

在结构时我是这样做的：
```js
const { name, age } = body.value
我想为这两个属性定义类型：

const { name: string, age: number } = body.value
但是这样会有问题。虽然能工作，但是实际上把 name 属性赋值给了 string 变量，把 age 属性赋值给了 number 变量。

正确的语法是这样的：
const { name, age }: { name: string; age: number } = body.value


最好的方式是为此类数据定义一个类型：
interface Dog {
  name: string
  age: number
}
这样写会更简单：
const dog: Dog = body.value
```

## react props.children包装
```js
interface chartsContainerProps {
  children: React.ReactNode
  showLoading?: boolean
  showError?: string
}
const ChartsContainer = (props: chartsContainerProps) => {
  const { showLoading = true, showError = '' } = props
  return (
    <>
		{props.children}
    </>
  )
}
export default ChartsContainer
```
## 泛型参数

### 一个函数也可以有多个泛型参数

```js
function createMan<T,K>(name:T,age:K):[T,K]{
    return [name,age];
}

let result=createMan<string,number>("张三",30);

console.log(result[0],result[1]);
// 结果：张三 30
```

> 定义多个泛型参数使用逗号做分隔符<T,K>，分别将泛型的 T 和 K 设置为参数 name 和 age 的类型，该函数返回的是一个元组，所以返回的类型设置为[T,K]，T 对应的 name，K 对应的 age

### 在定义接口时，可以为接口中的属性或方法定义泛型类型，在使用接口时，在指定具体的泛型类型。

来看一下泛型接口在函数中如何使用:

```js
interface ICreate {
  <T>(name: string, age: T): string;
}
let func: ICreate = function <T>(name: string, age: T): string {
  return name + "," + age;
};

func < number > ("李四", 20); //结果：李四,20
```

> 创建一个 ICreate 接口，里面定义了一个泛型函数的约束，`<T>`表示声明函数时必须是泛型格式，`(name:string,age:T)`表示声明函数时必须有 name 和 age 两个参数，两个参数的类型分别为 string 和泛型 T，声明变量 func 使用接口 ICreate 进行约束，赋值函数时必须按照接口的规范声明函数。使用 func 函数时`<number>`表示泛型 T 为 number 类型，这时参数 age:T 会映射为 age:number，所以传入的值必须是 number 类型即“20”

### 再来看一下泛型接口在类中如何使用

```js
//泛型接口
interface IUser<T>{
    name:string;
    age:number;
    getUserInfo:()=>T
}

//定义一个用户类
class User implements IUser<string>{
    public name:string;
    public age:number;
    constructor(name:string,age:number){
        this.name=name;
        this.age=age;
    }
    getUserInfo(){
        return `姓名${this.name}，年龄${this.age}`;
    }
}
let user=new User("张三",30);
console.log(user.getUserInfo());//结果：姓名张三，年龄30
```

> 首先定义一个泛型接口`IUser<T>`，`<T>`表示类继承接口时传入的类型，T 可以想象成接口的参数，可以在接口的属性或方法中使用，可以看到该接口内部的方法 getUserInfo 约束的类型是一个方法并且返回值的类型为泛型 T。接下来在 User 类中继承 IUser 接口并传入指定类型` <string>`，表示 getUserInfo 方法返回的值必须是 string 类型。

## 实战

```ts
if (props.controlItemParam.requestParam) {
  const { controlItemParam } = props;
  const { requestParam } = controlItemParam;
  const id = props?.templateId ? props?.templateId : controlItemParam.id;
  const res = await handleRequest<Result<MemberLevel[]>>(
    requestParam as RequestParam,
    {}
  );
  if (res.resultCode === success) {
    store.dispatch(
      designerActions.addSelectionOptions({
        dataMapId: requestParam?.dataMapId as string,
        id,
        options: res.data.map((item) => ({
          ...item,
          label: item.name,
          value: item.name,
        })),
      })
    );
  }
}

export const handleRequest = <T>(
  requestParam: RequestParam,
  options: ReqParams
): Promise<T> => {
  const { method } = requestParam;
  const apiMethod = services[method];
  if (!apiMethod) {
    throw new Error(`API method "${method}" not found`);
  }

  const params = options.params || {};

  return apiMethod(params) as Promise<T>;
};

export interface ReqParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: GetGoodsOptions & GetPageOptions & any;
}
```

## Record

Record 是 TypeScript 标准库中的一个泛型类型。它允许我们创建一个由指定类型的键和值组成的对象类型，其中键和值的类型可以任意指定。

Record 的语法如下：

```
Record<K, V>
```

其中，K 表示键的类型，V 表示值的类型。Record 的返回值是一个由 K 类型的键和 V 类型的值组成的对象类型。例如：

```js
type MyRecord = Record<string, number>;

const myRecord: MyRecord = {
  a: 1,
  b: 2,
  c: 3,
};
```

在这个例子中，我们定义了一个 MyRecord 类型，它是一个由字符串类型的键和数字类型的值组成的对象类型。我们还创建了一个名为 myRecord 的对象，它符合 MyRecord 类型的定义。这个对象包含了三个键值对，每个键都是字符串类型，每个值都是数字类型。

使用 Record 可以方便地定义一个对象类型，特别是在需要保证对象中键和值类型的一致性时非常有用。

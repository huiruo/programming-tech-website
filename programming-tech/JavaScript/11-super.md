## extends关键字实现类的继承

```js
class superClass {
    constructor(name) {
        this.name = name
    }
 
    printName() {
        console.log(this.name)
    }
}
 
 
class subClass extends superClass{
    constructor(name,age) {
        // super代表父类的构造函数
        // super代替的是父类的构建函数，使用super(name)相当于调用
        // subClass.prototype.constructor.call(this,name)
        super(name) 
        this.age = age
    }
 
    printAge() {
        console.log(this.age)
    }
}
 
let obj = new subClass('tom',30)
obj.printName()    // tom 
obj.printAge()    // 40
```

>如果在子类中不使用super则报错，原因是 子类是没有自己的this对象的，它只能继承父类的this对象，然后对其进行加工;super()就是将父类中的this对象继承给子类的，没有super()子类就得不到this对象

## react class component `super(props)`
在React会在类组件构造函数生成实例后再给this.props赋值，所以在不传递props在super的情况下，调用this.props为undefined，如下情况：
```js
class Button extends React.Component {
  constructor(props) {
    super(); // 没传入 props
    console.log(props);      //  {}
    console.log(this.props); //  undefined
  // ...
}
```

没有constructor，在render中this.props都是可以使用的，这是React自动附带的，是可以不写的：
```js
class HelloMessage extends React.Component{
    render (){
        return (
            <div>nice to meet you! {this.props.name}</div>
        );
    }
}
```

传入props的则都能正常访问，确保了 this.props 在构造函数执行完毕之前已被赋值，更符合逻:
```js
class Button extends React.Component {
  constructor(props) {
    super(props); // 没传入 props
    console.log(props);      //  {}
    console.log(this.props); //  {}
  // ...
}
```
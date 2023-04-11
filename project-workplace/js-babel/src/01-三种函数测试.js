const test1 = 'hello world'
const add = (a, b) => a + b

var add2 = function (a, b) {
  return a + b
}

function add3(a, b) {
  return a + b
}

console.log('add2', add2(1, 2))

// 测试函数表达式是否可以当构造函数，答案，可以
const Foo = function () {
  const _color = "blue";
  console.log('this',this)

  this.getColor = function () {
    return _color;
  }

  this.setColor = function(newColor) {
    this.color1 = newColor;
    return newColor
  }
}

Foo.prototype.getPro = function (){
  console.log('getPro',this.color1)
  return this.color1
}

const bar = new Foo();
console.log(bar.setColor('red'));
console.log('bar:',bar);
console.log('bar.getPro:',bar.getPro())
console.log('Foo.prototype:',Foo.prototype);

console.log('使用声明函数=======>')
// 使用声明函数
function  Foo2(color1){
  console.log('this',this)
  this.color1 = color1
}
Foo2.prototype.getPro = function (){
  // 可见函数表达式中的this 也是在自己实例中
  console.log('getPro',this.color1)
  return this.color1
}

const bar2 = new Foo2('red')
console.log('bar2:',bar2) // 可见当new 的时候 构造函数中的this 指向 bar2
console.log('bar2:',bar2.getPro())
console.log('Foo2:',Foo2.color1) // undefined
console.log('Foo2:',Foo2.prototype) // Foo2: { getPro: [Function (anonymous)] }

console.log('测试箭头函数=====>')
// 测试箭头函数
const Foo3 = (color1)=>{
  console.log('测试箭头函数',color1)
  console.log('测试箭头函数',this)
  this.color1 = color1
}

/*
构造函数是通过new关键字来生成对象实例，生成对象实例的过程也是通过构造函数给实例绑定this的过程，
而箭头函数没有自己的this。创建对象过程，new 首先会创建一个空对象，并将这个空对象的__proto__
指向构造函数的prototype，从而继承原型上的方法，但是箭头函数没有prototype。因此不能使用箭头
作为构造函数，也就不能通过new操作符来调用箭头函数。
* */
// 在浏览器中，Uncaught TypeError: Foo3 is not a constructor at <anonymous>
// 在node TypeError: Foo3 is not a constructor
const bar3 = new Foo3('red')


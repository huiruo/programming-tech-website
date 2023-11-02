## for of实现原理
for...of 循环的实现原理是基于可迭代协议（Iterable Protocol）的。可迭代协议定义了对象如何被迭代，以及如何产生一个迭代器对象，该迭代器对象用于逐个访问对象的元素。下面是关于 for...of 实现原理的简要解释：

1. 可迭代对象（Iterable）： 可迭代对象是实现了可迭代协议的对象，它必须有一个方法 Symbol.iterator，该方法返回一个迭代器对象。

2. 迭代器对象（Iterator）： 迭代器对象是实现了迭代器协议的对象，它必须有一个方法 next()，该方法在每次迭代中返回一个包含 value 和 done 属性的对象。value 表示当前迭代的值，done 表示是否完成迭代。

3. for...of 循环工作原理：
    * 当您使用 for...of 循环遍历一个可迭代对象时，它会首先获取该对象的迭代器，这是通过调用对象的 Symbol.iterator 方法来完成的。
    * 然后，for...of 循环会反复调用迭代器的 next() 方法，直到 done 的值为 true。
    * 在每次调用 next() 方法时，迭代器会返回一个包含当前元素的 value 属性，并检查是否完成迭代的 done 属性。
    * 当 done 为 true 时，for...of 循环终止。
    * for...of 循环会以这种方式逐个访问可迭代对象的元素，而无需您显式管理索引或迭代条件。

下面是一个示例，演示了如何手动实现一个可迭代对象和迭代器，以便更好地理解 for...of 的工作原理：
```js
// 可迭代对象
const iterableObject = {
  [Symbol.iterator]: function () {
    let index = 0;
    const data = [1, 2, 3, 4, 5];

    return {
      next: function () {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};

// 使用 for...of 遍历可迭代对象
for (const value of iterableObject) {
  console.log(value);
}
```
在这个示例中，我们手动实现了可迭代对象 iterableObject 和迭代器对象，以演示 for...of 循环的工作原理。for...of 循环通过迭代器对象依次访问可迭代对象的元素。


## forEach 实现原理
接受两个参数：数组 array 和回调函数 callback。函数内部使用一个 for 循环遍历数组，并在每次迭代中调用回调函数，并传递当前元素的值、索引和数组本身作为参数。
```js
function customForEach(array, callback) {
  // 检查传入的参数是否为一个数组
  if (!Array.isArray(array)) {
    throw new Error('The first argument must be an array.');
  }

  // 检查传入的参数是否为一个函数
  if (typeof callback !== 'function') {
    throw new Error('The second argument must be a function.');
  }

  // 遍历数组
  for (let i = 0; i < array.length; i++) {
    // 获取当前元素的值
    const currentValue = array[i];

    // 获取当前元素的索引
    const currentIndex = i;

    // 获取数组本身
    const arrayReference = array;

    // 调用回调函数，并传递参数
    callback(currentValue, currentIndex, arrayReference);
  }
}

const arr = [1, 2, 3, 4, 5];

customForEach(arr, (currentValue, index, array) => {
  console.log(`Element at index ${index}: ${currentValue}`);
});
```

## forEach:是函数式编程
遍历可迭代对象：ES6中引入了 iterable 类型，Array Set Map String arguments NodeList 都属于 iterable，他们特点就是都拥有 [Symbol.iterator] 方法

* array：一个数组对象。
    * callbackfn：必需参数，最多可以接收三个参数的函数。forEach 将为数组中的每个元素调用 callbackfn 函数一次。
    * thisArg：可选参数，callbackfn 函数中的 this 可引用的对象。如果省略 thisArg，则 this 的值为 undefined。

```js
const arr = ['a', 'b', 'c'];
arr.forEach((value, index, array) => {
  console.log("a[" + index + "] = " + value, 'arr:', array);
});
/*
a[0] = a arr: (3) ['a', 'b', 'c']
a[1] = b arr: (3) ['a', 'b', 'c']
a[2] = c arr: (3) ['a', 'b', 'c']
*/
```


```js
const arr = [0,1,2,3,4,5]
arr.forEach((item,index)=>{
    console.log(index,'-',item)
})

const arr = [0,1,2,3,4,5]
arr.forEach((item,index)=>{
        if(item===4){
        console.log('',arr[index])
        arr.splice(4,1)
        // index = index -1
    }
    console.log(index,'-',item,arr[index])
})
```

## 性能比较：for > forEach > map
因为for循环没有额外的函数调用栈和上下文,forEach:它的函数签名中包含了参数和上下文

>除非性能是关键问题，否则可以选择使用更具语义的 forEach，以增加代码的可读性和可维护性。
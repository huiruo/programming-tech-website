## ES6新增
## findIndex()为数组中的每个元素都调用一次函数执行：
当数组中的元素在测试条件时返回 true 时,
findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数。

如果没有符合条件的元素返回 -1

## findIndex 和 indexOf 对比
1. findIndex()和indexOf方法实现都是通过循环遍历查找。

2. findIndex()的应用场景要比indexOf广泛一些，可以查找大于等于小于，表达式可以随便写，
indexOf就只能在第一层查找相等的值。
findIndex是传入一个测试条件,也就是函数,找到了返回当前项索引,没有找到返回-1

3. findIndex()实际上相当于一个for循环，只不过找到了你不需要自己退出。

4. indexOf是判断数组中某个元素是否存在,不存在则返回-1

5. findIndex是用来查找索引的,返回的查找到的符合项的索引.

```js
const testArr = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }, { id: 3, name: '王五' }, { id: 2, name: '赵六' }]

const arrIndex = testArr.findIndex(item => {
    return item.name === '张三';
});

if (arrIndex > -1) {
    console.log("包含", testArr[arrIndex]);
} else {
    console.log("不包含");
}
```

/**
在处理大量数据的时候（这在现实生活中的项目里很常见），我们同样需要评估如何操作数据是最高效的。
在使用数组时，大部分方法的时间复杂度是O(n)。

另外，数组是元素的一个有序集合，为了保证元素排列有序，它会占用更多的内存空间。
所以可以尝试使用一个JavaScript对象来存储所有的栈元素

基于对象的栈：
* 推入(push)操作的时间复杂度是O(1)；
* 弹出(pop)操作的时间复杂度是O(1)；
* 查看栈顶元素(peek)操作的时间复杂度是O(1)。

基于对象的栈的空间复杂度也是O(n)，其中n是栈的大小，因为需要为每个元素创建一个对象

基于数组的栈：
* 推入(push)操作的时间复杂度是O(1)或O(n)，取决于数组是否已经分配了足够的空间；
* 弹出(pop)操作的时间复杂度是O(1)；
* 查看栈顶元素(peek)操作的时间复杂度是O(1)。

基于数组的栈的空间复杂度也是O(n)，其中n是栈的大小，因为需要一个数组来存储元素。
*/
class Stack {
  constructor() {
    /*
    * 要向栈中添加元素，我们将使用count变量作为items对象的键名，插入的元素则是它的值。
    * 在向栈插入元素后，我们递增count变量。
    * */
    this.count = 0;
    this.items = {};
  }

  push(element) {
    this.items[this.count] = element;
    this.count++;
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  isEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count;
  }

  clear() {
    /* while (!this.isEmpty()) {
        this.pop();
      } */
    this.items = {};
    this.count = 0;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }
    console.log('this.items:', this.items)
    let objString = `${this.items[0]}`;
    for (let i = 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }
    return JSON.stringify(this.items);
  }
}

const stack = new Stack();
stack.push(5);
stack.push({ key: 'test' });
console.log(stack.peek()) // {key: 'test'}
console.log(stack.toString())
/*
* 在内部，items包含的值和count属性如下所示。
{
    "0": 5,
    "1": {
        "key": "test"
    }
}
* */

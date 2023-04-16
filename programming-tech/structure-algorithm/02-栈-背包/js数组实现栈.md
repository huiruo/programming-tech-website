```js
class Stack {
  constructor() {
    this.items = [];
  }
  // 入栈
  push(element) {
    this.items.push(element);
  }
  // 出栈
  pop() {
    return this.items.pop();
  }
  // 获取栈顶元素
  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}
```
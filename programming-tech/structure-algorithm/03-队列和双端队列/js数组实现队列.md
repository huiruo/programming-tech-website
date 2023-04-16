```js
class Queue {
  constructor() {
    this.items = [];
  }

  // 添加元素到队列末尾
  enqueue(item) {
    this.items.push(item);
  }

  // 从队列头部移除元素并返回它
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  // 返回队列头部的元素，不改变队列本身
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
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

const myQueue = new Queue();

myQueue.enqueue("a");
myQueue.enqueue("b");
myQueue.enqueue("c");
```
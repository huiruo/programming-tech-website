class Queue {
  constructor() {
    // 控制队列的大小
    this.count = 0;
    // 第一个元素
    this.lowestCount = 0;
    this.items = {};
  }
  // 向队列尾部添加一个或多个项
  enqueue(element) {
    this.items[this.count] = element;
    this.count++;
  }

  // 移除队列第一项
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    // 如果不为空，暂存头部的值，以便改元素被移除后将它返回
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    // +1
    this.lowestCount++;
    return result;
  }
  // 返回队列第一个元素，最先添加也是最先被移除得元素
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }
    return objString;
  }
}

const queue = new Queue();
queue.enqueue('a');
queue.enqueue('b');
console.log(queue.toString());
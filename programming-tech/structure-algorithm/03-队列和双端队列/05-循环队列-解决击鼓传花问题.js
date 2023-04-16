/*
使用队列和双端队列来解决问题,循环队列

循环队列——击鼓传花游戏由于队列经常被应用在计算机领域和我们的现实生活中，就出现了一些队列的修改版本，
我们会在本章实现它们。这其中的一种叫作循环队列。

围成一个圆圈，把花尽快地传递给旁边的人。某一时刻传花停止，这个时候花在谁手里，谁就退出圆圈、结束游戏。
重复这个过程，直到只剩一个人。
*/
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

function hotPotato(elementsList, num) {
  const queue = new Queue();
  const eliminatedList = [];

  for (let i = 0; i < elementsList.length; i++) {
    // 把传入名单的名字都加入队列
    queue.enqueue(elementsList[i]);
  }

  while (queue.size() > 1) {
    // 给定一个数字，然后迭代队列，从队列开头移除一项,再将其添加到队列末尾
    // 一旦达到给定的传递次数，拿着花的人被淘汰，从队列中移除
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
    }
    eliminatedList.push(queue.dequeue());
  }

  return {
    eliminated: eliminatedList,
    winner: queue.dequeue()
  };
}

const names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl'];
const result = hotPotato(names, 7);
result.eliminated.forEach(name => { console.log(`${name}在击鼓传花游戏中被淘汰。`); });
console.log(`胜利者： ${result.winner}`);
/*
以上算法的输出如下。
Camila在击鼓传花游戏中被淘汰。
Jack在击鼓传花游戏中被淘汰。
Carl在击鼓传花游戏中被淘汰。
Ingrid在击鼓传花游戏中被淘汰。 胜利者：John
* */
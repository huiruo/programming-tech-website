/*
## 栈的实现
```text
将栈保存为一条链表：
顶部指向表头，实例变量first 指向栈顶

push 就将元素加入表头
pop ： 在表头删除
size(): 用实例变量 N 保存元素的个数，在压入将N+1;弹出N-1
isEmpty(): 只需检查first 是否 null 或 N 是否 0

链表的使用达到最优设计目标：
1.可以处理任意类型数据
2.所需空间总是和集合成正比
3.操作所需的时间和集合大小无关
```
*/

/*
在这里，我们定义了一个 Node 类，它表示链表中的节点，其中 value 表示节点的值，next 表示指向下一个节点的指针。

接下来，我们定义了一个 Stack 类，其中 head 表示链表的头节点，length 表示链表的长度。该类实现了以下几个方法：

push(value)：将值添加到栈的顶部。
pop()：从栈的顶部删除值并返回它。
peek()：返回栈的顶部值，但不删除它。
isEmpty()：检查栈是否为空。
size()：返回栈的大小。
*/
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  push(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.length++;
  }

  pop() {
    if (!this.head) {
      return null;
    }
    const value = this.head.value;
    this.head = this.head.next;
    this.length--;
    return value;
  }

  peek() {
    if (!this.head) {
      return null;
    }
    return this.head.value;
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }
}

const stack = new Stack();

// 测试 push 方法
stack.push(1);
stack.push(2);
stack.push(3);

// 测试 size 方法
console.log(stack.size()); // 输出：3

// 测试 peek 方法
console.log(stack.peek()); // 输出：3

// 测试 pop 方法
console.log(stack.pop()); // 输出：3
console.log(stack.pop()); // 输出：2
console.log(stack.pop()); // 输出：1
console.log(stack.pop()); // 输出：null

// 测试 isEmpty 方法
console.log(stack.isEmpty()); // 输出：true

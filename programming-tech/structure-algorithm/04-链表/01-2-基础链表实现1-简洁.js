class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(val) {
    const node = new ListNode(val);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.size++;
  }

  prepend(val) {
    const node = new ListNode(val);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }

    this.size++;
  }

  insertAtIndex(val, index) {
    if (index < 0 || index > this.size) {
      throw new Error('Invalid index');
    }

    if (index === 0) {
      this.prepend(val);
      return;
    }

    if (index === this.size) {
      this.append(val);
      return;
    }

    const node = new ListNode(val);
    let curr = this.head;
    let prev = null;
    let i = 0;

    while (i < index) {
      prev = curr;
      curr = curr.next;
      i++;
    }

    node.next = curr;
    prev.next = node;
    this.size++;
  }

  removeAtIndex(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('Invalid index');
    }

    let curr = this.head;
    let prev = null;
    let i = 0;

    if (index === 0) {
      this.head = curr.next;
    } else {
      while (i < index) {
        prev = curr;
        curr = curr.next;
        i++;
      }

      prev.next = curr.next;

      if (index === this.size - 1) {
        this.tail = prev;
      }
    }

    this.size--;
    return curr.val;
  }

  indexOf(val) {
    let curr = this.head;
    let i = 0;

    while (curr !== null) {
      if (curr.val === val) {
        return i;
      }

      curr = curr.next;
      i++;
    }

    return -1;
  }

  toArray() {
    const arr = [];
    let curr = this.head;

    while (curr !== null) {
      arr.push(curr.val);
      curr = curr.next;
    }

    return arr;
  }

  getSize() {
    return this.size;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}

/*
定义了一个 LinkedList 类来表示单向链表，它包含了头指针(head)、尾指针(tail)和链表的长度(size)。

LinkedList 类中的方法包括：
append(val)：在链表末尾添加一个新的节点。
prepend(val)：在链表开头添加一个新的节点。
insertAtIndex(val, index)：在指定位置插入一个新的节点
*/

const ll = new LinkedList();
ll.append(1);
ll.append(2);
ll.prepend(0);
ll.insertAtIndex(3, 3);
console.log(ll.toArray()); // [0, 1, 2, 3]
console.log(ll.indexOf(2)); // 2
ll.removeAtIndex(2);
console.log(ll.toArray()); // [0, 1, 3]
console.log(ll.getSize()); // 3
ll.clear();
console.log(ll.toArray()); // []
console.log(ll.getSize()); // 0

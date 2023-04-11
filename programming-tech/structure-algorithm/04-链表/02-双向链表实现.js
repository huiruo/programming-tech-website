function defaultEquals(a, b) {
  return a === b;
}

class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

/*
* 双向链表提供了两种迭代的方法：从头到尾，或者从尾到头。我们也可以访问一个特定节点的下一个或前一个元素。
* 为了实现这种行为，还需要追踪每个节点的前一个节点。所以除了Node类中的element和next属性，
* DoubleLinkedList会使用一个特殊的节点，这个名为DoublyNode的节点有一个叫作prev的属性
* */
class DoublyNode extends Node {
  constructor(element, next, prev) {
    super(element, next);
    this.prev = prev; // 新增的属性
  }
}

class DoublyLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
    super(equalsFn);
    // 保存对链表最后一个元素的引用
    this.tail = undefined;
  }

  push(element) {
    const node = new DoublyNode(element);
    if (this.head == null) {
      this.head = node;
      this.tail = node; // NEW
    } else {
      // attach to the tail node // NEW
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.count++;
  }
  /*
  * 向双向链表中插入一个新元素跟（单向）链表非常类似。区别在于，链表只要控制一个next指针，
  * 而双向链表则要同时控制next和prev（previous，前一个）这两个指针。
  * */
  /*
  * 第一种场景：
  * 在双向链表的第一个位置（起点）插入一个新元素。如果双向链表为空（行{1}），只需要把head和tail都指向这个新节点。
  * 如果不为空，current变量将是对双向链表中第一个元素的引用。就像我们在链表中所做的，把node.next设为current（行{2}），
  * 而head将指向node（行{4}——它将成为双向链表中的第一个元素）。不同之处在于，我们还需要为指向上一个元素的指针设一个值。
  * current.prev指针将由指向undefined变为指向新元素（node——行{3}）。node.prev指针已经是undefined，因此无须更新。
  * 
  * 另一种场景：
  * 假设我们要在双向链表最后添加一个新元素。这是一种特殊情况，因为我们还控制着指向最后一个元素的指针。current变量将引用最后一个元素（行{5}），
  * 然后开始建立链接，current.next指针（指向undefined）将指向node（行{6}——基于构造函数的缘故，node.next已经指向了undefined）。
  * node.prev将引用current（行{7}）。最后只剩一件事了，就是更新tail，它将由指向current变为指向node（行{8}）。
  * 
  * 然后还有第三种场景：在双向链表中间插入一个新元素。就像我们在之前的方法中所做的，迭代双向链表，直到要找的位置（行{9}）。
  * getElementAt方法是从LinkedList类中继承的，不需要重写一遍。我们将在current（行{10}）和previous元素之间插入新元素。首先，
  * node.next将指向current（行{11}），而previous.next将指向node（行{12}），这样就不会丢失节点之间的链接。
  * 然后需要处理所有的链接：current.prev将指向node（行{13}），而node.prev将指向previous（行{14}）。
  * */
  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode(element);
      let current = this.head;
      if (index === 0) {
        if (this.head == null) { // NEW
          this.head = node;
          this.tail = node; // NEW
        } else {
          node.next = this.head;
          this.head.prev = node; // NEW
          this.head = node;
        }
      } else if (index === this.count) { // last item NEW
        current = this.tail;
        current.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        node.next = current;
        previous.next = node;
        current.prev = node; // NEW
        node.prev = previous; // NEW
      }
      this.count++;
      return true;
    }
    return false;
  }
  // 从双向链表中移除元素跟链表非常类似。唯一的区别就是，还需要设置前一个位置的指针。
  /*
  * 我们需要处理三种场景：从头部、从中间和从尾部移除一个元素。
  * 
  * 我们来看看如何移除第一个元素。current变量是对双向链表中第一个元素的引用，也就是我们想移除的元素。
  * 我们需要做的就是改变head的引用，将其从current改为下一个元素（current.next——行{1}），
  * 还需要更新current.next指向上一个元素的指针（因为第一个元素的prev指针是undefined）。
  * 因此，把head.prev的引用改为undefined（行{3}——因为head也指向双向链表中新的第一个元素，也可以用current.next.prev）。
  * 由于还需要控制tail的引用，我们可以检查要移除的元素是否是第一个元素，如果是，只需要把tail也设为undefined
  * 
  * 下一种场景是从最后一个位置移除元素。既然已经有了对最后一个元素的引用（tail），我们就不需要为找到它而迭代双向链表。
  * 这样也就可以把tail的引用赋给current变量（行{4}）。接下来，需要把tail的引用更新为双向链表中倒数第二个元素（行{5}——current.prev，或者tail.prev）。
  * 既然tail指向了倒数第二个元素，我们就只需要把next指针更新为undefined（行{6}——tail.next= null）。
  * 
  * 第三种也是最后一种场景：从双向链表中间移除一个元素。首先需要迭代双向链表，直到要找的位置（行{7}）。current变量所引用的就是要移除的元素（行{7}）。
  * 要移除它，我们可以通过更新previous.next和current.next.prev的引用，在双向链表中跳过它。
  * 因此，previous.next将指向current.next（行{9}），而current.next.prev将指向previous（行{10}）
  * */
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = this.head.next;
        // if there is only one item, then we update tail as well //NEW
        if (this.count === 1) {
          // {2}
          this.tail = undefined;
        } else {
          this.head.prev = undefined;
        }
      } else if (index === this.count - 1) {
        // last item //NEW
        current = this.tail;
        this.tail = current.prev;
        this.tail.next = undefined;
      } else {
        current = this.getElementAt(index);
        const previous = current.prev;
        // link previous with current's next - skip it to remove
        previous.next = current.next;
        current.next.prev = previous; // NEW
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
  indexOf(element) {
    let current = this.head;
    let index = 0;
    while (current != null) {
      if (this.equalsFn(element, current.element)) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  }
  getHead() {
    return this.head;
  }
  getTail() {
    return this.tail;
  }
  clear() {
    super.clear();
    this.tail = undefined;
  }
  toString() {
    if (this.head == null) {
      return '';
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    while (current != null) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
  inverseToString() {
    if (this.tail == null) {
      return '';
    }
    let objString = `${this.tail.element}`;
    let previous = this.tail.prev;
    while (previous != null) {
      objString = `${objString},${previous.element}`;
      previous = previous.prev;
    }
    return objString;
  }
}
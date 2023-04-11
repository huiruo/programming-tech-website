/*
要表示链表中的第一个以及其他元素，我们需要一个助手类，Node类表示我们想要添加到链表中的项。
它包含一个element属性，该属性表示要加入链表元素的值；
以及一个next属性，该属性是指向链表中下一个元素的指针。
*/
class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

function defaultEquals(a, b) {
  return a === b;
}

class LinkedList {
  constructor(equalsFn = defaultEquals) {
    // 要比较链表中的元素是否相等，我们需要使用一个内部调用的函数
    // linkedList类的开发者可以自行传入用于比较两个JavaScript对象或值是否相等的自定义函数。
    this.equalsFn = equalsFn;
    // 链表中元素的数量
    this.count = 0;
    // 由于该数据结构是动态的，我们还需要将第一个元素的引用保存下来。
    this.head = undefined;
  }
  // 向链表尾部添加一个新元素。
  /*
  * 如果head元素为undefined或null，就意味着在向链表添加第一个元素。因此要做的就是让head元素指向node元素。下一个node元素会自动成为undefined。
  * 链表最后一个节点的下一个元素始终是undefined或null。
  * 
  * 向一个不为空的链表尾部添加元素。要向链表的尾部添加一个元素，首先需要找到最后一个元素。记住，我们只有第一个元素的引用，
  * 因此需要循环访问列表，直到找到最后一项。为此，我们需要一个指向链表中current项的变量
  * */
  push(element) {
    const node = new Node(element);
    let current;
    if (this.head == null) {
      // catches null && undefined
      this.head = node;
    } else {
      current = this.head;
      while (current.next != null) {
        current = current.next;
      }
      current.next = node;
    }
    this.count++;
  }
  // 返回链表中特定位置的元素。如果链表中不存在这样的元素，则返回undefined。
  getElementAt(index) {
    if (index >= 0 && index <= this.count) {
      /*
      * 然后，我们要初始化node变量，该变量会从链表的第一个元素head（行{2}）开始，迭代整个链表。
      * 然后，我们会迭代整个链表直到目标index。结束循环时，node元素将是index位置元素的引用。
      * */
      let node = this.head;
      for (let i = 0; i < index && node != null; i++) {
        node = node.next;
      }
      return node;
    }
    return undefined;
  }
  // 向链表的特定位置插入一个新元素
  insert(element, index) {
    // 由于我们处理的是位置（索引），就需要检查越界值,如果越界了，就返回false值，表示没有添加元素到链表中
    /*
    * 我们就要处理不同的场景。第一种场景是需要在链表的起点添加一个元素，也就是第一个位置
    * current变量是对链表中第一个元素的引用。我们需要做的是把node.next的值设为current（链表中第一个元素，或简单地设为head）。
    * 现在head和node.next都指向了current。接下来要做的就是把head的引用改为node（行{2}），这样链表中就有了一个新元素。
    * 
    * 现在来处理第二种场景：在链表中间或尾部添加一个元素。首先，我们需要迭代链表，找到目标位置
    * 这个时候，我们会循环至index - 1的位置，表示需要添加新节点位置的前一个位置。
    * 详解第二种情况：
    * previous将是对想要插入新元素的位置之前一个元素的引用，current变量将是我们想要插入新元素的位置之后一个元素的引用。
    * 在这种情况下，我们要在previous和current之间添加新元素。因此，首先需要把新元素（node）和当前元素链接起来（行{5}），
    * 然后需要改变previous和current之间的链接。我们还需要让previous.next指向node（行{6}），取代current。
    * 未简写的代码：
    * const previous = this.getElementAt(index - 1); // {3}
    * const current = previous.next; // {4}
    * node.next = current; // {5}
    * previous.next = node; // {6}
    * 
    * 详解末尾添加：
    * 如果试图向最后一个位置添加一个新元素，previous将是对链表最后一个元素的引用，而current将是undefined。在这种情况下，
    * node.next将指向current，而previous.next将指向node，这样链表中就有了一个新元素。
    * 
    * 详解中间提添加：
    * 链表中间添加一个新元素。在这种情况下，我们试图将新元素（node）插入previous和current元素之间。首先，我们需要把
    * node.next的值指向current，然后把previous.next的值设为node。这样列表中就有了一个新元素。
    * */
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        // 简写的代码
        const previous = this.getElementAt(index - 1);
        node.next = previous.next;
        previous.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }
  // 从链表的特定位置移除一个元素
  /*
  * 第一种是移除第一个元素，第二种是移除第一个元素之外的其他元素。
  * */
  removeAt(index) {
    // 由于该方法要得到需要移除的元素的index（位置），我们需要验证该index是有效的,从0（包括0）到链表的长度（count – 1，因为index是从零开始的）都是有效的位置
    if (index >= 0 && index < this.count) {
      let current = this.head;
      // 移除第一项,如果想移除第一个元素，要做的就是让head指向列表的第二个元素。如果把head赋为current.next，就会移除第一个元素。
      if (index === 0) {
        this.head = current.next;
      } else {
        /*
        * 现在，假设我们要移除链表的最后一个或者中间某个元素。为此，需要迭代链表的节点，直到到达目标位置，getElementAt。
        * 一个重要细节是：current变量总是为对所循环列表的当前元素的引用。我们还需要一个对当前元素的前一个元素的引用，它被命名为previous
        * */
        /*
        * 在迭代到目标位置之后，current变量会持有我们想从链表中移除的节点。因此，要从链表中移除当前元素，要做的就是将previous.next和current.next链接起来。
        * 这样，当前节点就会被丢弃在计算机内存中，等着被垃圾回收器清除。
        * */
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        previous.next = current.next;
      }

      this.count--;
      return current.element;
    }
    return undefined;
  }
  // 从链表中移除一个元素。
  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }
  // 返回元素在链表中的索引。如果链表中没有该元素则返回-1。
  /*
  * 一如既往，需要一个变量来帮助我们循环访问列表。该变量是current，它的初始值是head（行{1}）。然后迭代元素（行{2}），从head（索引0）开始，
  * 直到链表长度（count变量）为止。为了确保不会发生运行时错误，我们可以验证一下current变量是否为null或undefined。
  * 在每次迭代时，我们将验证current节点的元素和目标元素是否相等（行{3}）。此时，我们会使用传入LinkedList类构造函数的用于判断相等的函数
  * */
  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.size() && current != null; i++) {
      if (this.equalsFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }
  // 如果链表中不包含任何元素，返回true
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return this.count;
  }
  getHead() {
    return this.head;
  }
  clear() {
    this.head = undefined;
    this.count = 0;
  }
  toString() {
    if (this.head == null) {
      return '';
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    for (let i = 1; i < this.size() && current != null; i++) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
}

// test
const list = new LinkedList();

// 测试 push 方法
list.push(1);
list.push(2);
list.push(3);

// 测试 size 方法
console.log(list.size()); // 输出：3

// 测试 getElementAt 方法
console.log(list.getElementAt(0).element); // 输出：1
console.log(list.getElementAt(1).element); // 输出：2
console.log(list.getElementAt(2).element); // 输出：3
console.log(list.getElementAt(3)); // 输出：undefined

// 测试 insert 方法
list.insert(4, 1);
console.log(list.toString()); // 输出：'1,4,2,3'

// 测试 removeAt 方法
console.log(list.removeAt(2)); // 输出：2
console.log(list.toString()); // 输出：'1,4,3'

// 测试 remove 方法
console.log(list.remove(4)); // 输出：4
console.log(list.toString()); // 输出：'1,3'

// 测试 indexOf 方法
console.log(list.indexOf(3)); // 输出：1
console.log(list.indexOf(4)); // 输出：-1

// 测试 isEmpty 方法
console.log(list.isEmpty()); // 输出：false

// 测试 clear 方法
list.clear();
console.log(list.isEmpty()); // 输出：true
console.log(list.toString()); // 输出：''

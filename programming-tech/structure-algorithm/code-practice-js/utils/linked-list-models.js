/**
 * Node类表示我们想要添加到链表中的项。它包含一个element属性，该属性表示要加入链表元素的值；以及一个next属性，
 * 该属性是指向链表中下一个元素的指针。
 */
export class Node {
    constructor(element, next) {
        this.element = element;
        this.next = next;
    }
}

/**
 * 链表只要控制一个next指针，而双向链表则要同时控制next和prev 这两个指针。
 */
export class DoublyNode extends Node {
    constructor(element, next, prev) {
        super(element, next);
        this.prev = prev; //
    }
}

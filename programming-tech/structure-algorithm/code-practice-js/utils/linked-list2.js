export function ListNode(element) {
    this.element = element
    this.next = null
}

ListNode.prototype.set = function(node) {
    this.next = node
}

let setListNode = function(arr) {
    if (arr.length > 0) {
        let ln = null
        // let res = null;
        while(arr.length>0) {
            let temp = new ListNode(arr.pop())
            temp.set(ln)
            ln = temp
        }
        return ln
    }
    return false
}

export class LinkedList2{
    constructor() {
        this.count = 0;
        this.head = undefined;
    }

    push(element) {
        const node = new ListNode(element);
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

    getElementAt(index) {
        if (index >= 0 && index <= this.count) {
            let node = this.head;
            for (let i = 0; i < index && node != null; i++) {
                node = node.next;
            }
            return node;
        }
        return undefined;
    }

    size() {
        return this.count;
    }

    toString() {
        if (this.head == null) {
            return '';
        }
        let objString = `${this.head.element}`;
        console.log('this.head:',this.head)
        let current = this.head.next;
        for (let i = 1; i < this.size() && current != null; i++) {
            objString = `${objString},${current.element}`;
            current = current.next;
        }
        return objString;
    }
}
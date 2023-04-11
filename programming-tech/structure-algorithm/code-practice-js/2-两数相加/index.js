/*
* 给你两个非空 的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，
并且每个节点只能存储一位数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0开头。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/add-two-numbers
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
* */

import LinkedList from "../utils/linked-list.js";
import { LinkedList2, ListNode } from "../utils/linked-list2.js";



/*
const list = new LinkedList2()
list.push(5)
list.push(6)
list.push(4)
// console.log('list.toString() => ', list.toString());
*/

var addTwoNumbers2 = function (l1, l2) {
    let resNode = new ListNode(0); // 临时使用的 node 用来不停的增加链表节点
    let result = resNode; // 第一次挂载
    let tmpS = 0; // 相加 > 10 的进位数(1 或 0)

    while (l1 || l2 || tmpS) { // 判断 tmpS 的目的是防止最后还有一位进位需要前置
        let val1 = l1 ? l1.element || 0 : 0; // 需要判断 l1 是 null
        let val2 = l2 ? l2.element || 0 : 0; // 需要判断 l2 是 null
        let sum = val1 + val2 + tmpS; // this.element 相加并加上进位值
        tmpS = sum >= 10 ? 1 : 0; // 计算本次相加是否需要进位
        sum = sum % 10; // 当前位只需要个位数
        if (l1) l1 = l1.next; // 遍历链表
        if (l2) l2 = l2.next; // 遍历链表
        resNode.next = new ListNode(sum); // 将当前结果挂到临时的 node 上
        resNode = resNode.next; // 如果要继续挂载链表，需要将当前的指针移动到 next 上
    }

    return result.next; // result 是 resNode, resNode.next 才是最终结果
}

// console.log(addTwoNumbers2(L1, L2))

var addTwoNumbers1 = function (l1, l2) {
    let dummy = new LinkedList()
    let curr = dummy
    let carry = 0
    while (l1 || l2) {
        const x = l1 ? l1.element : 0
        const y = l2 ? l2.element : 0

        const total = x + y + carry
        curr.next = new LinkedList(total % 10)
        // bug 修复：视频中忘了移动 curr 指针了
        curr = curr.next
        carry = Math.floor(total / 10)

        if (l1) l1 = l1.next
        if (l2) l2 = l2.next
    }
    if (carry) curr.next = new LinkedList(carry)
    return dummy.next
};

// 方法1：使用简单链表
let l1_1 = new ListNode(2);
let l1_2 = new ListNode(4);
let l1_3 = new ListNode(3);
l1_1.next = l1_2;
l1_2.next = l1_3;

let l2_1 = new ListNode(5);
let l2_2 = new ListNode(6);
let l2_3 = new ListNode(4);
l2_1.next = l2_2;
l2_2.next = l2_3;

// l1, l2
const L1 = l1_1;
const L2 = l2_1;
console.log('L1==>:', L1)
console.log('L2==>:', L2)
console.log('使用简单链表:', addTwoNumbers2(L1, L2))

// 方法2：使用链表类
const input1 = new LinkedList2()
input1.push(2)
input1.push(4)
input1.push(3)

console.log('input1:', input1)
console.log('input1-get-head:', input1.getElementAt(0))
const input2 = new LinkedList2()
input2.push(5)
input2.push(6)
input2.push(4)

console.log('input2:', input2)
console.log('input2-get-head:', input2.getElementAt(0))
console.log('使用链表类:', addTwoNumbers2(input1.getElementAt(0), input2.getElementAt(0)))

---
title: exec-test
---

JavaScript RegExp 对象是有状态的。他们会将上次成功匹配后的位置记录在 lastIndex 属性中。使用此特性，

exec() 可用来对单个字符串中的多次 * 匹配结果进行逐条的遍历（包括捕获到的匹配），

而相比之下， String.prototype.match() 只会返回匹配到的结果。

如果你只是为了判断是否匹配（true或 false），可以使用 RegExp.test() 方法，或者 String.search() 方法。

```js
const regex1 = RegExp('foo*', 'g');
const str1 = 'table football, foosball';
let array1;

while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
  // expected output: "Found foo. Next starts at 9."
  // expected output: "Found foo. Next starts at 19."
}
```

## test() 方法和 exec() 方法比较
### test()

* 如果字符串与正则表达式匹配，test()方法返回true，否则返回false。
```js
const pattern = /abc/;
const text = "abcdef";
const result = pattern.test(text);
console.log(result); // 输出 true，因为 "abcdef" 包含 "abc"
```

```js
/*
* 执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false
* */

const text = "000-00-0000";
const pattern = /\d{3}-\d{2}-\d{4}/;
if (pattern.test(text)) {
    console.log("The pattern was matched.");
} else {
    console.log('not ok');
}

/*
/[^0-9]/g
/[^\d]/g
*/

// 需求：必须精确到小数点后4位
// const pattern2 = /^([0-9]{1,}[.][0-9]{4})$/;
// const pattern2 = /^([0-9]{3}[.][0-9]{4})$/;
const pattern2 = /^(([1-9][0-9]*){3}[.][0-9]{4})$/;
// const text2 = 12.333
// const text2 = 12.3334
// const text2 = 123.3334
// const text2 = 123.333455
const text2 = '023.3334'
if (pattern2.test(text2)) {
    console.log("必须精确到小数点后4位,The pattern was matched.");
} else {
    console.log('not ok');
}

console.log('=======');
// let reg = /^[\d]{2}$/g;
// let reg = /^([1-9][0-9]*)$/;
let reg = /^[1-9][0-9]*$/;
let str = "12";
// let str = "012";
// let str = "0";
console.log(reg.test(str));     //返回true
```

### exec()
1. exec()方法用于在字符串中查找匹配的文本，返回一个数组，其中包含匹配的子串和捕获组。

2. 如果没有找到匹配，exec()返回null。

3. 如果找到匹配，返回的数组包含匹配的文本作为第一个元素，然后是捕获组的匹配结果（如果有的话）。

```
exec()方法用于查找匹配，返回匹配的文本和捕获组信息。如果没有匹配，返回null。

exec()方法更适合在需要获取匹配的详细信息时使用，而test()方法通常用于简单的布尔匹配检查。
```
```js
const pattern = /ab(c)/;
const text = "abcdef";
const result = pattern.exec(text);
if (result) {
  console.log(result[0]); // 输出 "abc"，匹配的文本
  console.log(result[1]); // 输出 "c"，捕获组中的匹配
} else {
  console.log("No match found");
}
```

```js
/* 
正则表达式"g"标识使用
正则表达式使用"g"标识时，如果要查找目标字符串中所有的匹配，需要多次执行exec()方法，
每次执行时，都是从 lastIndex属性指定的位置开始匹配
* */
let str = 'hell word';
let pattern = /o/;
console.log(pattern.exec(str));
// [ 'o', index: 6, input: 'hell word', groups: undefined ]

let reg2 = /hello hu(\w+)/;
let str2 = 'hello huxiao6, balabala, hello huDi, 724';
let result = reg2.exec(str2);
console.log(result)
/*
[
  'hello huxiao6',
  'xiao6',
  index: 0,
  input: 'hello huxiao6, balabala, hello huDi, 724',
  groups: undefined
]
* */
```

### exec例子
```js
/*
* 规则：对于 exec() 方法
在模式中设置了全局标志（ g ），它每次也只会返回一个匹配项，多次调用exec() ，每次调用则都会在字符串中继续查找新匹配项；
* */
const text = "cat, bat, sat, fat";
const pattern2 = /.at/g;
let matches = pattern2.exec(text);   // 返回数组 ["cat", index: 0, input: "cat, bat, sat, fat", groups: undefined]
console.log(matches.index);                // 0
console.log(matches[0]);                   // cat
console.log(pattern2.lastIndex);           // 3

matches = pattern2.exec(text);       // 返回数组 ["bat", index: 5, input: "cat, bat, sat, fat", groups: undefined]
console.log(matches.index);                // 5
console.log(matches[0]);                   // bat
console.log(pattern2.lastIndex);           // 8

console.log('分割线=====》end')
console.log('分割线=====》end')

/*
* 在不设置全局标志的情况下，在同一个字符串上多次调用 exec() 将始终返回第一个匹配项的信息。
* */
let text2 = "cat, bat, sat, fat";
let pattern1 = /.at/;
let matches2 = pattern1.exec(text2);    // 返回数组 ["cat", index: 0, input: "cat, bat, sat, fat", groups: undefined]
console.log(matches2.index);                 // 0
console.log(matches2[0]);                    // cat
console.log(pattern1.lastIndex);            // 0

matches2 = pattern1.exec(text);
console.log(matches2.index);                 // 0
console.log(matches2[0]);                    // cat
console.log(pattern1.lastIndex);            // 0
```
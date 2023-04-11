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
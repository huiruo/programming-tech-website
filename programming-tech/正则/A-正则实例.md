```js
// 使用js正则截取-key-前面的字符串

const test1 = 'page-key-0';
const test2 = 'ptest-key-0';
const test3 = 'a-key-1';

const regex = /(.+)-key-/;
const result1 = test1.match(regex)[1];
const result2 = test2.match(regex)[1];
const result3 = test3.match(regex)[1];

console.log(result1); // 输出：page
console.log(result2); // 输出：ptest
console.log(result3); // 输出：a
```
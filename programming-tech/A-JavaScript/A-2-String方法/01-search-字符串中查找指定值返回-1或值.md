## str.search(regexp) 
search() 方法是 JavaScript 中用于在字符串中查找指定值。它可以在一个字符串中查找与给定的正则表达式相匹配的值，并返回匹配到的第一个字符的位置。如果没有找到匹配的值，则返回 -1。

regexp 一个正则表达式（regular expression）对象。如果传入一个非正则表达式对象 regexp，则会使用 new RegExp(regexp) 隐式地将其转换为正则表达式对象。
```js
const str = "hey JudE";
const re = /[A-Z]/g;
console.log(str.search(re)); // returns 4
console.log(str.search(/h/)); // returns 0
console.log(str.search(/hy/)); // returns -1
console.log(str[str.search(re)]) // J
```

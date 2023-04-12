## indexOf: 返回字符串中检索指定字符第一次出现的位置
lastIndexOf
```js
const str = 'hello world'

console.log('test:',str.indexOf('o')) // 4
// search 也可以达到同样效果
console.log(str.search(/[o]/g)); // 4
console.log('截取',str.slice(0,str.indexOf('o'))) // hell
```
## trim 方法可以用来去除一个字符串开头和结尾的空格。

它可以让你方便地删除字符串前后的空白，以便让字符串的开头和结尾处都没有空格。
```js
const str = "   hello world!   ";
console.log(str.trim());
```

## 1.js 字符串两边截取空白的 trim 的原型方法的实现
js 中本身是没有 trim 函数的。
```js
/*
删除左右两端的空格
删除左边的空格 /(^s*)/g
删除右边的空格 /(s*$)/g
*/
function trim(str){
 return str.replace(/(^s*)|(s*$)/g, "");
}
```
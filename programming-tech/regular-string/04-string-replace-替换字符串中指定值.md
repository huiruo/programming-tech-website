## replace() 

用于替换字符串中指定的值。它接受两个参数，第一个参数是需要被替换的值，第二个参数是替换后的值。replace() 方法会返回一个新的字符串，其中包含被替换后的内容。

例如，我们可以使用 replace() 方法来替换字符串中的所有空格，如下所示：
```js
let str = "  天气真好    ,太幸福了  ";
// \s表示空白符，+表示多个空白符
let strNew = str.replace(/\s+/g, "");
console.log(`str:${strNew},old:${str}`); // str:天气真好,太幸福了,old:  天气真好    ,太幸福了  

// trim只能去掉收尾
console.log('trim:',str.trim()); // trim: 天气真好    ,太幸福了
console.log('old',str)
```

* 模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项。 

* 原字符串不会改变。


使用2：正则表达式用对象的方式
```js
let reg = new RegExp(/[h]/gi);
let str3 = "HhpphH";
let str3New = str3.replace(reg, "S");
console.log(`${str3New}`); // SSppSS
```

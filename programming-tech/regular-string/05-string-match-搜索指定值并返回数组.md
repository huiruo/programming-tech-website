
## match()方法是字符串对象的方法，用于在字符串中查找正则表达式的匹配。

该方法接受一个正则作为参数，用来匹配一个字符串，
```
result返回值有两个属性可以记下：
input: 原始字符串，即 str;
index: 匹配到的字符位于原始字符串的索引值, 索引初始值为0；
lastIndex: 正则表达式属性,下一次匹配开始的位置
```

* 当正则表达式包含全局标志 g 时，match()方法会返回一个数组，包含所有匹配的子字符串。
* 如果正则表达式没有全局标志，match()只返回第一个匹配项及其捕获组。
* 如果没有找到匹配，match()返回 null。
* match()方法不提供详细的捕获组信息，只返回匹配的子字符串。
```js
const text = "abcdef abcgh";
const pattern = /abc/g;
const result = text.match(pattern);
console.log(result); // 输出 ["abc", "abc"]
```

实战：使用js正则截取-key-前面的字符串
```js
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

### 和exec区别
exec()方法是正则表达式对象的方法，用于在字符串中查找匹配。

exec()方法返回一个数组，其中包含匹配的子串和捕获组的信息。
如果没有找到匹配，exec()返回 null。
当正则表达式包含全局标志 g 时，exec()方法可以被多次调用，每次调用都会查找下一个匹配项。

异同：
* match()方法用于在字符串中查找正则表达式的匹配，返回匹配的子字符串数组。
* exec()方法用于在字符串中查找匹配，返回匹配的文本和捕获组信息。它还可以用于多次查找匹配项。
* 如果只需要匹配的子字符串，通常可以使用match()方法。如果需要获取更多关于匹配项的信息，或者需要多次查找匹配项，可以使用exec()方法。
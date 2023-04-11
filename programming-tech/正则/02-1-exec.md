```js
/*
* JavaScript RegExp 对象是有状态的。他们会将上次成功匹配后的位置记录在 lastIndex 属性中。使用此特性，
* exec() 可用来对单个字符串中的多次 * 匹配结果进行逐条的遍历（包括捕获到的匹配），
* 而相比之下， String.prototype.match() 只会返回匹配到的结果。
*
* 如果你只是为了判断是否匹配（true或 false），可以使用 RegExp.test() 方法，或者 String.search() 方法。
* */
const regex1 = RegExp('foo*', 'g');
const str1 = 'table football, foosball';
let array1;

while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
  // expected output: "Found foo. Next starts at 9."
  // expected output: "Found foo. Next starts at 19."
}


/* ## test() 方法和 exec() 方法比较
* 两个方法都用于查看查看某个模式（正则表达式）是否存在于一个字符串中，test() 方法执行速度
比 exec() 方法更快， 但exec() 方法返回信息更多；

正则表达式"g"标识使用
正则表达式使用"g"标识时，如果要查找目标字符串中所有的匹配，需要多次执行exec()方法，每次执行时，都是从 lastIndex属性指定的位置开始匹配
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
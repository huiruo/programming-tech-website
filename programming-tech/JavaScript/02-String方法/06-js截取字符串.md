## js截取两个字符串之间的内容：
```js
let str1 = "aaabbbcccdddeeefff";
console.log(str1.match(/aaa(\S*)fff/)[1]);// 结果 bbbcccdddeee

// 某个字符串前面的内容：
let str2 = "aaabbbcccdddeeefff";
console.log(str2.match(/(\S*)fff/)[1]);//结果 aaabbbcccdddeee

// js截取某个字符串后面的内容：
let str3 = "aaabbbcccdddeeefff";
console.log(str3.match(/aaa(\S*)/)[1]);//结果 bbbcccdddeeefff
```

## 例子：去掉首尾字符
使用字符串方法实现:查找出第一个不是空格的字符

查出最后一个不是空格的字符，截取中间的内容即可

substring()	提取字符串中两个指定的索引号之间的字符。
slice 同理
```js
function _trim2(targetStr){
    console.log(`${targetStr.search(/\S/)}`)

    let startIndex = Math.max(targetStr.search(/\S/), 0);
    // test
    console.log('test:',targetStr.match(/\S\s*$/g)); // test: [ 'a  ' ]
    let endIndex = targetStr.search(/\S\s*$/) + 1;

    console.log(`startIndex:${startIndex},endIndex:${endIndex}`)
    return targetStr.slice(startIndex, endIndex);
}

let strTest2 = `  hello world haha   hhhhhha  `;
console.log(`实现3${_trim2(strTest2)}`)
```
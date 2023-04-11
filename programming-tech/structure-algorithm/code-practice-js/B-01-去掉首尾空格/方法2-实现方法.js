
/*
* trim() 方法用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。
* */
let str = `  hello world haha   hhhhhha  `;
console.log('trim:',str.trim());

/*
* 正则实现：
* */
function _trim(targetStr){
    let reg = /^\s*|\s*$/g;
    return targetStr.replace(reg, "");
}

console.log(`实现2${_trim(str)}`)


/*
* 使用字符串方法实现:查找出第一个不是空格的字符
* 查出最后一个不是空格的字符，截取中间的内容即可
* \s用于匹配空白字符。
*
* [\s]表示，只要出现空白就匹配
* [\S]表示，非空白就匹配
* 是完全通配的意思，\s是指空白，包括空格、换行、tab缩进等所有的空白，而\S刚好相反
*
* substring()	提取字符串中两个指定的索引号之间的字符。
* slice 同
* */
function _trim2(targetStr){
    console.log(`${targetStr.search(/\S/)}`)

    let startIndex = Math.max(targetStr.search(/\S/), 0);
    // test
    console.log('test:',targetStr.match(/\S\s*$/g)); // test: [ 'a  ' ]

    let endIndex = targetStr.search(/\S\s*$/) + 1;

    console.log(`startIndex:${startIndex},endIndex:${endIndex}`)
    // return targetStr.substring(startIndex, endIndex);
    return targetStr.slice(startIndex, endIndex);
}

console.log(`实现3${_trim2(str)}`)
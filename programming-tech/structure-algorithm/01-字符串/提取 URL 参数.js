/*
写一个提取 URL 参数的 js 方法，例如：
要求：只识别queryParam，排除 hash 的干扰

写一个提取 url 参数的 js 方法，要求：只识别queryParam，排除 hash 的干扰
输出结果?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4

let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4"
* */


// (\?.+) 匹配 ? 后面的任意字符，且至少匹配一个字符，使用括号捕获这个部分，以便后面能够提取查询参数。
const url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4";
const regex = /(\?.+)/;
const match = url.match(regex);
console.log('match', match[1])


/*
[?&] 表示匹配?或&字符，这是URL中查询参数的分隔符。
[^?&]+ 表示匹配一个或多个非?和&字符，也就是匹配参数名和参数值。
= 表示匹配=字符，表示参数名和参数值的分隔符。
[^?&]+ 表示再次匹配一个或多个非?和&字符，表示参数值。
*/
let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4"
function getParamFromURL2(url, key) {
    const list = new Map();
    const reg = /[?&][^?&]+=[^?&]+/g;
    const arr = url.match(reg);
    if (arr) {
        console.log('arr', arr)
        arr.forEach(item => {
            let splitArr = item.substring(1).split('=');
            let key = decodeURIComponent(splitArr[0]);
            let val = decodeURIComponent(splitArr[1]);
            list.set(key, val)
        });
    }
    // 有一个问题：map会重复
    console.log('list:', list)
    return list.get(key);
}

console.log(getParamFromURL2(url, 'a'))


// 有一个问题：map会重复,用symbol,但是带来读取问题
let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4"
function getParamFromURL2(url, key) {
    const list = new Map();
    const testObj = {}
    const reg = /[?&][^?&]+=[^?&]+/g;
    const arr = url.match(reg);
    if (arr) {
        console.log('arr', arr)
        arr.forEach(item => {
            let splitArr = item.substring(1).split('=');
            let key = decodeURIComponent(splitArr[0]);
            let val = decodeURIComponent(splitArr[1]);
            list.set(key, val)
            let objKey = Symbol(key);
            testObj[objKey] = val
        });
    }
    console.log('list:', list)
    console.log('testObj:', testObj)
    console.log('obj:', Object.getOwnPropertyNames(testObj))
    console.log('obj:', Object.getOwnPropertySymbols(testObj))
    return list.get(key);
}

console.log(getParamFromURL2(url, 'a'))

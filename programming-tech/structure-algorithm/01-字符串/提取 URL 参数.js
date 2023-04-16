

/*
写一个提取 URL 参数的 js 方法，例如：
要求：只识别queryParam，排除 hash 的干扰

写一个提取 url 参数的 js 方法，要求：只识别queryParam，排除 hash 的干扰
输出结果?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4

let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4"
* */
let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4"
// ?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4
function getParamFromURL(url, key) {
    //...your code
    let re2 = /([^&=]+)=?([^&]*)/g
    let re = /(^|&)c=([^&]*)(&|$)/g;
    let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    // let r = url.match(reg);
    let r = url.match(re);
    console.log('str', url, 'key:', key)
    console.log(r)
    if (r != null) return unescape(r[2]); return null;
}

console.log(getParamFromURL(url, 'a'))

console.log('分割线======》')
function getParamFromURL2(url, key) {
    const list = new Map();
    const reg = /[?&][^?&]+=[^?&]+/g;
    const arr = url.match(reg);
    if (arr) {
        arr.forEach(item => {
            let splitArr = item.substring(1).split('=');
            let key = decodeURIComponent(splitArr[0]);
            let val = decodeURIComponent(splitArr[1]);
            list.set(key, val)
        });
    }
    return list.get(key);
}

console.log(getParamFromURL2(url, 'a'))

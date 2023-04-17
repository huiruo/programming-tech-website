/*
使用js,仅仅识别 tmall.com 以及 taobao.com 这两个域名下的链接
*/
let str = `今天我淘到了一个宝贝，你也看一下感觉很适合你 https://detail.tmall.com/item.htm?id=577359445691&spm=a1z10.10649-b-s.0.0.335e225cy94dcW ，种草的话，下单吧！`

function getUrlFromWords(text) {
    // let reg = /(https|http):\/\/[A-Za-z]+.((tmall.com)|(taobao.com))\/[A-Za-z]+.(htm|html)\?id=[0-9]+&spm=[a-zA-Z0-9.-]+/g
    let reg = /(https|http):\/\/[A-Za-z]+.((tmall.com)|(taobao.com))\/[A-Za-z]+.(htm|html)/g
    return reg.test(text)
}

console.log('test:', getUrlFromWords(str))


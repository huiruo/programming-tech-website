```js
/*
* 执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false
* */

const text = "000-00-0000";
const pattern = /\d{3}-\d{2}-\d{4}/;
if (pattern.test(text)) {
    console.log("The pattern was matched.");
} else {
    console.log('not ok');
}

/*
/[^0-9]/g
/[^\d]/g
*/

// 需求：必须精确到小数点后4位
// const pattern2 = /^([0-9]{1,}[.][0-9]{4})$/;
// const pattern2 = /^([0-9]{3}[.][0-9]{4})$/;
const pattern2 = /^(([1-9][0-9]*){3}[.][0-9]{4})$/;
// const text2 = 12.333
// const text2 = 12.3334
// const text2 = 123.3334
// const text2 = 123.333455
const text2 = '023.3334'
if (pattern2.test(text2)) {
    console.log("必须精确到小数点后4位,The pattern was matched.");
} else {
    console.log('not ok');
}

console.log('=======');
// let reg = /^[\d]{2}$/g;
// let reg = /^([1-9][0-9]*)$/;
let reg = /^[1-9][0-9]*$/;
let str = "12";
// let str = "012";
// let str = "0";
console.log(reg.test(str));     //返回true
```
/*
和数组去重类似，也是利用一个对象 obj，将数组元素作为对象的属性名，
如果不存在该属性名，则值赋为 1，如果存在，则值加 1。
*/
function findMaxDuplicateChar(str) {
    if (str.length == 1) {
        return str;
    }
    let charObj = {};
    for (let i = 0; i < str.length; i++) {
        // 利用String的charAt()方法获取各个字符; charAt() 方法可返回指定位置的字符
        if (!charObj[str.charAt(i)]) {
            charObj[str.charAt(i)] = 1;
        } else {
            charObj[str.charAt(i)] += 1;
        }
    }
    let maxChar = '',
        maxValue = 1;
    for (var k in charObj) {
        // 在obj对象中寻找值最大的那个属性
        if (charObj[k] >= maxValue) {
            maxChar = k;
            maxValue = charObj[k];
        }
    }
    return maxChar;
}
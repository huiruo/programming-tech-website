//下⾯两⾏，次轮循环执⾏
setTimeout(() => console.log('setTimeout'));

// 该方法用来把一些需要长时间运行的操作放在一个回调函数里,
// 在浏览器完成后面的其他语句后,就立刻执行这个回调函数
setImmediate(() => console.log('setImmediate'));

// 下⾯两⾏，本轮循环执⾏
process.nextTick(() => console.log('nextTick'));

Promise.resolve().then(() => console.log('Promise'));

// ⾸先，同步任务总是⽐异步任务更早执⾏。
(() => console.log(5))();
/*
5
nextTick
Promise
setTimeout
setImmediate
*/
process.nextTick(() => console.log(3));
Promise.resolve().then(() => console.log(4));
// 注意，只有前⼀个队列全部清空以后，才会执⾏下⼀个队列。代码中，全部process.nextTick的回调函数，执⾏都会早于Promise
process.nextTick(() => console.log(1));
Promise.resolve().then(() => console.log(2));

process.nextTick(() => console.log(5));
Promise.resolve().then(() => console.log(4));
/*
3
1
5
4
2
4
*/
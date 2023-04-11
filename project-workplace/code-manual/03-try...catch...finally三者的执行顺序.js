/*
## try...catch...finally三者的执行顺序
1. 如果try和catch模块中不存在return语句，那么运行完try和catch模块中的代码后再运行finally中的代码。
2. 如果try和catch模块中存在return语句，那么在运行return之前会运行finally中的代码
```
(1). 如果finally中存在return语句，则返回finally的return结果，代码运行结束。
(2). 如果finally不存在return语句，则返回try或catch中的return结果，代码运行结束。
```
3. 如果try和catch模块中存在throw语句，那么在catch运行throw之前会运行finally中的代码。
```
(1). 如果finally中存在return语句，则返回finally的return结果，代码运行结束。
(2). 如果finally不存在return语句，则运行catch中的throw语句，代码运行结束。
```
*/
// 执行顺序test_try、test_finally
function test() {
    try {
        console.log('test_try');
    } finally {
        console.log('test_finally');
    }
}

// 执行顺序test_1_try、test_1_finally、test_1_try_return
function test1() {
    try {
        console.log('test_1_try');
        return 'test_1_try_return';
    } finally {
        console.log('test_1_finally');
    }
}

// 执行顺序test_2_try、test_2_finally、test_2_finally_return
function test2() {
    try {
        console.log('test_2_try');
        return 'test_2_try_return';
    } finally {
        console.log('test_2_finally');
        return 'test_2_finally_return';
    }
}

// 执行顺序test_3_try、throw、test_3_finally、test_3_catch
function test3() {
    try {
        console.log('test_3_try');
        throw new Error('throw');
    } catch (error) {
        console.log(error.message);
        return 'test_3_catch';
    } finally {
        console.log('test_3_finally');
    }
}

test();
console.log(test1());
console.log(test2());
console.log(test3());
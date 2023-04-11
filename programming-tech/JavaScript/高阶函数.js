/*
* ## 高阶函数定义：
*
* JavaScript的函数其实都指向某个变量。既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。
* 使用函数作为参数或者把一个函数作为返回值的函数
* */
/*
* ### 1.回调函数
* */
function test(fn) {
    fn('Hello world');
};

test((words) => {
    console.log('回调函数', words);
}
);


/*
* ## 2.柯里化
* 把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，
* 并且返回接受余下的参数而且返回结果的新函数的技术。
* */
let sum = (a) => {
    return (b) => {
        return (c) => {
            return (d) => {
                return a + b + c + d;
            };
        };
    };
};
let result = sum(1)(3)(5)(7);
console.log('2.柯里化:', result);

// 普通的add函数
function addFn(x, y) {
    return x + y
}

// Currying后
function curryingAdd(x) {
    return function (y) {
        return x + y
    }
}

console.log('2-2.非柯里化:', addFn(1, 2))  // 3
console.log('2-2.柯里化:', curryingAdd(1)(2)) // 3

// 正常正则验证字符串 reg.test(txt)
// 函数封装后
function check(reg, txt) {
    return reg.test(txt)
}

console.log('未柯里化1:', check(/\d+/g, 'test'))       //false
console.log('未柯里化2:', check(/[a-z]+/g, 'test'))    //true

// Currying后
function curryingCheck(reg) {
    return function (txt) {
        return reg.test(txt)
    }
}

let hasNumber = curryingCheck(/\d+/g)
let hasLetter = curryingCheck(/[a-z]+/g)

console.log('柯里化后1:', hasNumber('test1'))      // true
console.log('柯里化后2:', hasNumber('testtest'))   // false
console.log('柯里化后3:', hasLetter('21212'))      // false

/*
* ## 3.纯函数,详细见：01_函数式编程_纯函数.md
* */
let pureFn = (a, b) => a - b;
console.log('3-1.纯函数:', pureFn(5, 4));

function getSum(num) {
    return num * 2 + num
}
console.log('3-2.纯函数:', getSum(5));


/*
斐波那契数列，以兔子的繁殖的例子而引入，故又称“兔子数列”，指的是这样一个数列：1、1、2、3、5、8、13、21、34、...； 在数学上，斐波那契数列以如下被以递归的方法定义：F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2)  (n>2，n∈N*)。
*/

// 方法1:递归方法
function f1(n) {
  if (n === 1 || n === 2) {
    return 1;
  } else {
    return f(n - 1) + f(n - 2);
  }
}

console.log('方法1：', f1(6));

// 方法2：动态规划方法（性能得到优化）
function f2(n) {
  let n1 = 1,
    n2 = 1,
    sum = 1;
  for (let i = 3; i <= n; i += 1) {
    sum = n1 + n2;
    n1 = n2;    // 往后移动一位数
    n2 = sum
  }
  return sum
}

console.log('方法2：', f2(5));
### every 对数组中的每个元素运行给定函数，如果该函数对每个元素都返回true，则返回true
every方法会迭代数组中的每个元素，直到返回false。

```js
const isEven = x => x % 2 === 0;
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

console.log('numbers.every(isEven)', numbers.every(isEven));
/* 在我们的例子里，numbers数组中第一个偶数是2（第二个元素）。第一个被迭代的元素是1，isEven会返回false。第二个被迭代的元素是2，isEven返回true——迭代结束。 */
```
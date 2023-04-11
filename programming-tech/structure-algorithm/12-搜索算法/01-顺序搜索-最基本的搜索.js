/*
## 顺序搜索是最低效的一种搜索算法。
顺序或线性搜索是最基本的搜索算法。
它的机制是，将每一个数据结构中的元素和我们要找的元素做比较。

顺序搜索迭代整个数组（行{1}），并将每个数组元素和搜索项做比较（行{2}）。
如果搜索到了，算法将用返回值来标示搜索成功。返回值可以是该搜索项本身，
或是true，又或是搜索项的索引（行{3}）。
如果没有找到该项，则返回-1（行{4}），表示该索引不存在；
*/

const DOES_NOT_EXIST = -1;

function defaultEquals(a, b) {
  return a === b;
}

function sequentialSearch(array, value, equalsFn = defaultEquals) {
  for (let i = 0; i < array.length; i++) {  // 1
    if (equalsFn(value, array[i])) {  // 2
      return i; // 3
    }
  }
  return DOES_NOT_EXIST;  // 4
}


function createNonSortedArray(size) {
  var array = [];

  for (var i = size; i > 0; i--) {
    array[i] = i;
  }

  return array;
}

var array = createNonSortedArray(99);
console.log('array', array)
// console.log('res:', sequentialSearch(array, -1))
console.log('res:', sequentialSearch(array, 88))
/*
当我们调用 quickSort 函数时，传入一个数组作为参数。首先，函数会检查数组的长度是否小于等于 1。
如果是，说明数组已经有序，直接返回即可。

接下来，我们选择数组中间的元素作为基准元素（这个实现并不是最优的，但是足够简单）。我们创建两个
新数组 left 和 right 来存储数组中比基准元素小和大的元素。遍历原始数组中除基准元素外的所有元素，
如果元素小于基准元素，则将它放入左数组，否则放入右数组。

然后我们对左数组和右数组分别递归调用 quickSort 函数。递归调用的结束条件就是数组长度小于等于 1。

最后，我们将左数组、基准元素和右数组合并起来，返回一个新数组。
这里我们使用了扩展运算符 ...，可以将多个数组合并成一个。

这个实现虽然简单易懂，但是它并不是最优的，因为在每次调用函数时都要创建新的数组，可能会消耗大量的内存空间。
在实际使用中，我们可以通过修改数组中元素的位置来实现原地排序，从而节省空间。
*/
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  debugger
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) {
      continue;
    }
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

const arr = [52, 63, 14, 59, 68, 35, 8, 67, 45, 99];
const sortedArr = quickSort(arr);
console.log(sortedArr); // [8, 14, 35, 45, 52, 59, 63, 67, 68, 99]

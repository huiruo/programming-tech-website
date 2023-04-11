/*
以下是一个更高效的快速排序实现，它采用了原地排序（in-place sorting）和
三项取中法（median-of-three partitioning）优化，可以在处理大型数组时提高性能。

解析实现:
quickSort 函数，它接受一个数组参数 arr，以及可选的两个参数 left 和 right，用于指定排序范围的左右边界。
在函数内部，通过检查左右边界是否合法（即左边界小于右边界），来决定是否需要递归调用自身进行排序。
如果需要排序，则调用 partition 函数来对数组进行划分，然后递归调用 quickSort 函数对划分后的
左右两部分分别进行排序。最终返回排序后的数组 arr。

接下来是 partition 函数的定义，它用于对数组进行划分，将小于基准元素的数放到左边，大于基准元素的数放到右边。
该函数接受四个参数，分别是要排序的数组 arr，排序范围的左右边界 left 和 right，以及基准元素的下标 pivotIndex。
该函数首先将基准元素 pivotValue 保存下来，然后将其移到数组的最右侧（这样可以避免在后面的遍历过程中再次访问到基准元素，提高效率）。

partition 函数则是实现了原地排序，它通过遍历数组并将小于基准元素的元素
移动到数组左侧来实现。

接着，函数定义了一个 storeIndex 变量，用于记录小于基准元素的数应该插入的位置。
然后从左到右遍历数组，如果当前数小于基准元素，则将其与 storeIndex 处的数交换，并将 storeIndex 加 1，
表示已经有一个小于基准元素的数被放到了左侧。遍历结束后，将基准元素移到 storeIndex 处，
然后返回该位置作为新的基准元素位置。
*/
function quickSort(arr, left = 0, right = arr.length - 1) {
  console.log('quickSort:', { arr, left, right })
  debugger
  if (left < right) {
    const pivotIndex = getPivotIndex(arr, left, right);
    const newPivotIndex = partition(arr, left, right, pivotIndex);
    quickSort(arr, left, newPivotIndex - 1);
    quickSort(arr, newPivotIndex + 1, right);
  }
  return arr;
}

function getPivotIndex(arr, left, right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[left] > arr[mid]) {
    swap(arr, left, mid);
  }
  if (arr[left] > arr[right]) {
    swap(arr, left, right);
  }
  if (arr[mid] > arr[right]) {
    swap(arr, mid, right);
  }
  return mid;
}

function partition(arr, left, right, pivotIndex) {
  const pivotValue = arr[pivotIndex];
  swap(arr, pivotIndex, right);
  let storeIndex = left;
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      swap(arr, i, storeIndex);
      storeIndex++;
    }
  }
  swap(arr, storeIndex, right);
  return storeIndex;
}

function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

const arr = [52, 63, 14, 59, 68, 35, 8, 67, 45, 99];
quickSort(arr);
console.log(arr); // [8, 14, 35, 45, 52, 59, 63, 67, 68, 99]

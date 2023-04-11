/*
这个算法的基本思路是，维护一个已排序的子数组，每次将未排序部分的第一个元素插入到已排序部分的合适位置。
具体步骤如下：
1. 从第二个元素开始，遍历整个数组。
2. 对于当前元素，将它存储在一个变量 currentVal 中。
3. 从当前元素的前一个元素开始，向前遍历已排序的子数组。
4. 如果遍历到的元素大于 currentVal，就将它向右移动一位，为插入 currentVal 腾出位置。
5. 重复步骤 4，直到找到一个小于等于 currentVal 的元素，或者遍历到已排序部分的开头。
6. 将 currentVal 插入到上一步找到的位置后面。
7. 重复步骤 2 到 6，直到遍历完整个数组。

最终，整个数组就会被排序好，算法的时间复杂度为 O(n^2)，空间复杂度为 O(1)。
*/
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let currentVal = arr[i];
    let j = i - 1;
    debugger
    while (j >= 0 && arr[j] > currentVal) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = currentVal;
  }
  return arr;
}

// 示例使用
const arr = [52, 63, 14, 59, 68, 35, 8, 67, 45, 99];
console.log(insertionSort(arr)); // 输出 [8, 14, 35, 45, 52, 59, 63, 67, 68, 99]

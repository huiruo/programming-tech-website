/*
数组长度是否小于等于1，如果是则直接返回该数组。否则，将数组平均分成两个子数组，然后递归地
对左右子数组进行归并排序。最后将排好序的左右子数组合并成一个有序数组，并返回该数组。在合并
两个子数组的过程中，我们使用双指针法，分别从两个子数组的开头开始比较大小，每次将较小的元素
加入新的数组中，直到其中一个子数组的元素全部被加入新的数组中，然后将另一个子数组中剩余的元素
直接加入新的数组中即可。
*/
function mergeSort(arr) {
  // 如果数组长度小于等于1，直接返回数组
  if (arr.length <= 1) {
    return arr;
  }

  // 将数组平均分成两个子数组
  const mid = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid);

  debugger
  console.log('leftArr:', leftArr)
  console.log('rightArr:', rightArr)

  // 递归地对左右子数组进行归并排序
  const sortedLeftArr = mergeSort(leftArr);
  const sortedRightArr = mergeSort(rightArr);
  console.log('========')

  // 将排好序的左右子数组合并成一个有序数组
  const mergedArr = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < sortedLeftArr.length && rightIndex < sortedRightArr.length) {
    if (sortedLeftArr[leftIndex] < sortedRightArr[rightIndex]) {
      mergedArr.push(sortedLeftArr[leftIndex]);
      leftIndex++;
    } else {
      mergedArr.push(sortedRightArr[rightIndex]);
      rightIndex++;
    }
  }

  const mergedArrReturn = mergedArr.concat(sortedLeftArr.slice(leftIndex)).concat(sortedRightArr.slice(rightIndex));
  console.log('mergedArrReturn:', mergedArrReturn)
  return mergedArrReturn;
}

// 测试代码
const arr = [52, 63, 14, 59, 68, 35, 8, 67, 45, 99];
console.log(mergeSort(arr)); // [8, 14, 35, 45, 52, 59, 63, 67, 68, 99]

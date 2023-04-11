/*
基本思想是在未排序的部分中找到最小元素并将其放在已排序的末尾

具体地说，算法从数组的第一个元素开始遍历，将其视为最小值，然后在未排序部分中查找更小的值，
找到后交换位置。重复此过程直到整个数组都被排序。

时间复杂度为O(n^2)，因为对于每个未排序元素，都需要在剩余的未排序部分中查找最小元素。
*/
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      debugger
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 找到的没排序好的最小值
    if (minIndex !== i) {
      swap(arr, i, minIndex);
    }
  }
  return arr;
}

function swap(array, index1, index2) {
  const aux = array[index1];
  array[index1] = array[index2];
  array[index2] = aux;
}

const arr = [10, 8, 10, 2, 3, 5, 7, 8, 9, 1, 3, 4, 5];
console.log(selectionSort(arr)); // [1, 2, 3, 3, 4, 5, 5, 7, 8, 8, 9, 10, 10]

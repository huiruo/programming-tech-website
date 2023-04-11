function binarySearch(arr, element) {
  console.log({ arr, element })
  let left = 0;
  let right = arr.length - 1;

  debugger
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === element) {
      return mid;
    } else if (arr[mid] < element) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

const arr = [2, 3, 1, 5, 7, 9, 8];
const element = 8;
const index = binarySearch(arr.sort((a, b) => a - b), element);

if (index === -1) {
  console.log(`The element ${element} is not found in the array.`);
} else {
  console.log(`The element ${element} is found at index ${index} in the array.`);
}

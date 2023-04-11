const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};

function defaultCompare(a, b) {
  if (a === b) {
    return Compare.EQUALS;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function swap(array, index1, index2) {
  const aux = array[index1];
  array[index1] = array[index2];
  array[index2] = aux;
}


function partition(array, left, right, compareFn) {
  const pivot = array[Math.floor((right + left) / 2)]; // 8
  let i = left; // 9
  let j = right; // 10

  while (i <= j) { // 11
    while (compareFn(array[i], pivot) === Compare.LESS_THAN) { // 12
      i++;
    }
    while (compareFn(array[j], pivot) === Compare.BIGGER_THAN) { // 13
      j--;
    }
    if (i <= j) { // 14
      swap(array, i, j); // 15
      i++;
      j--;
    }
  }
  return i; // 16
}

function quick(array, left, right, compareFn) {
  let index;  // 1
  if (array.length > 1) { // 2
    index = partition(array, left, right, compareFn); // 3
    if (left < index - 1) {   // 4
      quick(array, left, index - 1, compareFn); // 5
    }
    if (index < right) {  // 6
      quick(array, index, right, compareFn); // 7
    }
  }
  return array;
}

function quickSort(array, compareFn = defaultCompare) {
  return quick(array, 0, array.length - 1, compareFn);
}

const array = [52, 63, 14, 59, 68, 35, 8, 67, 45, 99];
console.log('array:', array)
console.log('array:', quickSort(array))

/*
在所有排序算法中最简单。从运行时间的角度来看，冒泡排序是最差的一个。
冒泡排序一共要进行(n-1)次循环,每一次循环都要进行当前n-1次比较
所以一共的比较次数是:

(n-1) + (n-2) + (n-3) + … + 1 = n*(n-1)/2;

所以冒泡排序的时间复杂度是 O(n2)
*/


/*
在外层的for循环中，我们遍历数组len - 1次，第一层循环的结果,比较所有相邻的两个项，如果第一个比第二个大，则交换它们。
每次都会将最大的元素交换到数组的最后面。

冒泡排序比较所有相邻的两个项，如果第一个比第二个大，则交换它们。

就是把目标元素和相邻的比较，大就往上移动一个位置，移动后又拿移动后的位置重复刚才的动作,
假如小，那么比较的元素就成了目标元素（小的留在原为不直行交换动作），目标元素继续和后面的相邻，一个一个比较
元素项向上移动至正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。

在内层的for循环中，我们遍历数组的前len - i - 1个元素，
每次都将相邻的元素进行比较并交换位置，从而将最大的元素移到数组的末尾。

解析：
在冒泡排序算法中，每一次循环都会将最大的元素交换到数组的最后面，因此在进行i次循环后，
数组的最后i个元素已经按照升序排列好了。因此，在进行第i+1次循环时，我们只需要遍历数组
的前len-i-1个元素即可，因为数组的最后i个元素已经是有序的了。
所以，我们只需要循环len-1次就能够排好整个数组。
*/

function swap(array, index1, index2) {
    var temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

function bubbleSort2(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        debugger
        for (var j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
            }
        }
    }
    return arr;
}

var arr = [10, 8, 10, 2, 3, 5, 7, 8, 9, 1, 3, 4, 5];
console.log(bubbleSort2(arr));

/*
版本2:基本相同,没有从内循环减去外循环中已跑过的轮数
*/
function bubbleSort(array) {
    var length = array.length;
    var cost = 0;
    for (var i = 0; i < length; i++) { //{1}
        cost++;
        for (var j = 0; j < length - 1; j++) { //{2}
            cost++;
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
            }
        }
    }
    console.log('cost for bubbleSort with input size ' + length + ' is ' + cost);
    console.log('array:', array);
    /*
    cost for bubbleSort with input size 13 is 169
    array: (13)[1, 2, 3, 3, 4, 5, 5, 7, 8, 8, 9, 10, 10]
    * */
}

bubbleSort([10, 8, 10, 2, 3, 5, 7, 8, 9, 1, 3, 4, 5])

function swap(array, index1, index2) {
    var temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}
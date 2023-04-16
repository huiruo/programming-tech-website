/*
1.使用js: 对下面数组进行排重，并按 升序 排序，代码尽量简练:
*/
const array = ['2', 'b', '9', 'a', '7', '3', '4', 'b', '6', '4'];
function handle(arr) {
    // ...your code
    const newArr = Array.from(new Set(arr))
    newArr.sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b
        } else if (typeof a === 'number' && typeof b !== 'number') {
            return -1;
        } else if (typeof a !== 'number' && typeof b === 'number') {
            return 1;
        } else {
            return a > b ? 1 : -1;
        }
    })
    return newArr
}
console.log(handle(array));
// output: ['2', '3', '4', '6', '7', '9', 'a', 'b']

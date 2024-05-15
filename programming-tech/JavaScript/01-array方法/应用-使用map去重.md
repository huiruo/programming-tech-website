
```js
const mergeArraysFn =(arr1: any[], arr2:any[])=>{
  const mergedArray = [...arr1, ...arr2];

  const map = new Map();
  mergedArray.forEach(item => {
      map.set(item.key, item);
  });
  
  // 不排序
  // return Array.from(map.values());

  // 排序
  const sortedArray = Array.from(map.values()).sort((a, b) => parseInt(a.key) - parseInt(b.key));

  return sortedArray
}

const arr1 = [
    { "key": "1", "show_name": "1天" },
    { "key": "3", "show_name": "3天" },
    { "key": "7", "show_name": "7天" },
    { "key": "30", "show_name": "30天" }
];

const arr2 = [
    { "key": "1", "show_name": "1天" },
    { "key": "9", "show_name": "9天" },
    { "key": "90", "show_name": "90天" }
];

// 调用函数
const merged = mergeArrays(arr1, arr2);
```
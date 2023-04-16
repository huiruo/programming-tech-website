## 广度优先遍历
广度优先搜索算法会从指定的第一个顶点开始遍历图，先访问其所有的邻点（相邻顶点），就像一次访问图的一层。
换句话说，就是先宽后深地访问顶点
```js
const departArrTest = [{
    id: 1,
    name: '部门1',
    pid: 0,
    children: [{
        "id": 2,
        "name": "部门2",
        "pid": 1,
        "children": []
    },
    {
        "id": 3,
        "name": "部门3",
        "pid": 1,
        "children": []
    }]
},
{
    id: 10,
    name: '部门1',
    pid: 9,
    children: [
        {id: 11, name: '部门1', pid: 10},
    ]
}]

const generateList = (data, dataList) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i]
        if (node.children) {
            generateList(node.children, dataList, node.id)
        }
        delete node['children'];
        dataList.push(node)
    }

    return dataList
}

console.log('将树形节点改为一维数组:',generateList(departArrTest, []))
```


## 方式1：使用递归来将嵌套的对象数组转换为扁平的数组
此代码会将 testArr 数组中的所有对象递归地遍历，并将它们添加到 result 数组中。如果当前对象有 children 属性，则递归地调用 flatten 函数来处理子节点，并使用展开运算符将结果添加到 result 数组中。最终返回 result 数组即可。

这个实现的时间复杂度是 O(n)，其中 n 是扁平化后数组的长度，因此性能较好。
```js
const testArr = [{
  "id": 1,
  "p_id": 0,
  "name": "首页",
  "children": [{
    "id": 4,
    "p_id": 1,
    "name": "权限管理",
    "children": [{
      "id": 6,
      "p_id": 4,
      "name": "角色列表",
      "children": []
    }]
  }]
},
{
  "id": 2,
  "p_id": 0,
  "name": "菜单管理",
  "children": []
},
{
  "id": 3,
  "p_id": 0,
  "name": "菜单列表",
  "children": []
}]

function flatten(arr) {
  const result = [];

  arr.forEach(item => {
    result.push(item);
    if (item.children && item.children.length) {
      result.push(...flatten(item.children));
    }
  });

  return result;
}

console.log(flatten(testArr))
```

## 方式2
迭代方式扁平化对象数组的实现，该实现使用一个辅助栈来保存待处理的节点，只要栈不为空，就循环处理：

时间复杂度是 O(n)，其中 n 是扁平化后数组的长度，但是它使用迭代而不是递归，因此避免了函数调用栈溢出的问题，可以提高性能。

需要注意的是，这个实现在处理嵌套很深的对象数组时，可能会因为栈空间不足而出现性能问题，因此需要根据实际情况进行测试和优化。
```js
const testArr = [{
  "id": 1,
  "p_id": 0,
  "name": "首页",
  "children": [{
    "id": 4,
    "p_id": 1,
    "name": "权限管理",
    "children": [{
      "id": 6,
      "p_id": 4,
      "name": "角色列表",
      "children": []
    }]
  }]
},
{
  "id": 2,
  "p_id": 0,
  "name": "菜单管理",
  "children": []
},
{
  "id": 3,
  "p_id": 0,
  "name": "菜单列表",
  "children": []
}]

function flatten(arr) {
  const result = [];
  const stack = [...arr];

  while (stack.length) {
    const item = stack.pop();
    result.push(item);
    if (item.children && item.children.length) {
      stack.push(...item.children.reverse());
    }
  }

  return result;
}

console.log(flatten(testArr))
```
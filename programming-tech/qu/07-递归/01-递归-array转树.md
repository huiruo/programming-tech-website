## 简单

递归实现会有性能问题，当 n 比较大时，递归会导致大量的函数调用，从而增加了计算的时间和空间复杂度。因此，我们建议使用迭代的方式来计算斐波那契数列前 n 项和。

```js
function fibonacciSum(n) {
  if (n <= 1) {
    return n;
  } else {
    return fibonacciSum(n - 1) + fibonacciSum(n - 2) + 1;
  }
}

fibonacciSum(10); // 143
```

## array 转树

### 方式 1

```js
function buildTree(arr, parentId) {
  let result = [];
  for (let item of arr.filter((item) => item.p_id === parentId)) {
    let children = buildTree(arr, item.id);
    if (children.length) {
      item.children = children;
    }
    result.push(item);
  }
  return result;
}

let arr = [
  { id: 1, p_id: 0, name: "首页" },
  { id: 2, p_id: 0, name: "菜单管理" },
  { id: 3, p_id: 0, name: "菜单列表" },
  { id: 4, p_id: 1, name: "权限管理" },
  { id: 5, p_id: 6, name: "管理员列表" },
  { id: 6, p_id: 4, name: "角色列表" },
];

let tree = buildTree(arr, 0);

console.log(JSON.stringify(tree, null, 2));
```

### 方式 2-添加到哈希表中

```js
function buildTree(nodes) {
  const nodeMap = {}; // 哈希表用于存储每个节点的引用

  // 将每个节点添加到哈希表中，并用一个新的 children 属性来存储其子节点
  nodes.forEach((node) => {
    node.children = [];
    nodeMap[node.id] = node;
  });

  const tree = [];

  // 遍历节点，将每个节点添加到其父节点的 children 数组中
  nodes.forEach((node) => {
    if (node.p_id === 0) {
      // 根节点
      tree.push(node);
    } else {
      const parent = nodeMap[node.p_id];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return tree;
}

const nodes = [
  { id: 1, p_id: 0, name: "首页" },
  { id: 2, p_id: 0, name: "菜单管理" },
  { id: 3, p_id: 0, name: "菜单列表" },
  { id: 4, p_id: 1, name: "权限管理" },
  { id: 5, p_id: 6, name: "管理员列表" },
  { id: 6, p_id: 4, name: "角色列表" },
];

const tree = buildTree(nodes);
console.log(tree);
```

### 方式 3

```js
function getTree(data) {
  var newData = [],
    hash = {};
  for (var i = 0; i < data.length; i++) {
    if (!hash[data[i].province]) {
      hash[data[i].province] = {
        province: data[i].province,
      };
      hash[data[i].province]["city"] = [
        {
          name: data[i].city,
          code: data[i].code,
        },
      ];
      newData.push(hash[data[i].province]);
    } else if (hash[data[i].province].province == data[i].province) {
      hash[data[i].province]["city"].push({
        name: data[i].city,
        code: data[i].code,
      });
    }
  }
  return newData;
}

var data = [
  {
    province: "浙江",
    city: "温州",
    code: "10010",
  },
  {
    province: "浙江",
    city: "杭州",
    code: "10011",
  },
  {
    province: "安徽",
    city: "合肥",
    code: "10012",
  },
  {
    province: "安徽",
    city: "马鞍山",
    code: "10013",
  },
  {
    province: "浙江",
    city: "宁波",
    code: "10014",
  },
];

console.log(getTree(data));
```

### 哈希表法
有一种时间复杂度更优的算法可以解决这个问题，称为“哈希表法”，其时间复杂度为 $O(n)$。

具体实现方法是：

1.遍历数组，以每个节点的 id 为键，将节点存储在一个哈希表中；
2.再次遍历数组，以每个节点的 pid 为键，在哈希表中查找对应的父节点，将节点添加到父节点的 children 数组中。

这种方法的优点是，在第二次遍历时，我们可以通过哈希表快速找到每个节点的父节点，而不需要每次都遍历整个数组。这样可以将算法的时间复杂度从 $O(n^2)$ 降低到 $O(n)$。


使用时间复杂度更小的算法需要改变数据结构的形式，将每个节点存储为一个对象，
并且用一个 Map 来保存节点的 id 和对象的映射关系。
这样，在遍历数组的同时，可以快速找到节点的父节点，
 从而将节点添加到相应的父节点的 children 属性中。以下是一个可能的实现：

```js
function buildTree(data) {
  const map = new Map();
  const tree = [];

  // 将每个节点存储为一个对象，并用 Map 来保存节点的 id 和对象的映射关系
  for (const item of data) {
    map.set(item.id, { ...item, children: [] });
  }

  // 遍历数组，将每个节点添加到相应的父节点的 children 属性中
  for (const item of data) {
    const node = map.get(item.id);
    const parent = map.get(item.pid);
    if (parent) {
      parent.children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
}

// 示例数据
const data = [
  { id: 7, pid: 7, title: 'test7-pid-7' },
  { id: 1, pid: 0, title: 'test1-pid-0' },
  { id: 2, pid: 1, title: 'test2-pid-1' },
  { id: 3, pid: 1, title: 'test3-pid-1' },
  { id: 4, pid: 2, title: 'test4-pid-2' },
  { id: 5, pid: 2, title: 'test5-pid-2' },
  { id: 6, pid: 3, title: 'test6-pid-5' },
];

// 转换为树形结构数组
const tree = buildTree(data);

console.log(tree);
```
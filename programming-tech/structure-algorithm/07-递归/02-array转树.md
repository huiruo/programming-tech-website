## 方式1
```js
function buildTree(arr, parentId) {
  let result = [];
  for (let item of arr.filter(item => item.p_id === parentId)) {
    let children = buildTree(arr, item.id);
    if (children.length) {
      item.children = children;
    }
    result.push(item);
  }
  return result;
}

let arr = [
  { id: 1, p_id: 0, name: '首页' },
  { id: 2, p_id: 0, name: '菜单管理' },
  { id: 3, p_id: 0, name: '菜单列表' },
  { id: 4, p_id: 1, name: '权限管理' },
  { id: 5, p_id: 6, name: '管理员列表' },
  { id: 6, p_id: 4, name: '角色列表' }
];

let tree = buildTree(arr, 0);

console.log(JSON.stringify(tree, null, 2));
```


## 方式2

```js
function buildTree(nodes) {
  const nodeMap = {}; // 哈希表用于存储每个节点的引用

  // 将每个节点添加到哈希表中，并用一个新的 children 属性来存储其子节点
  nodes.forEach(node => {
    node.children = [];
    nodeMap[node.id] = node;
  });

  const tree = [];

  // 遍历节点，将每个节点添加到其父节点的 children 数组中
  nodes.forEach(node => {
    if (node.p_id === 0) { // 根节点
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
  { id: 1, p_id: 0, name: '首页' },
  { id: 2, p_id: 0, name: '菜单管理' },
  { id: 3, p_id: 0, name: '菜单列表' },
  { id: 4, p_id: 1, name: '权限管理' },
  { id: 5, p_id: 6, name: '管理员列表' },
  { id: 6, p_id: 4, name: '角色列表' },
];

const tree = buildTree(nodes);
console.log(tree);
```

## 方式3
```js
function getTree(data) {
    var newData = [],
        hash = {};
    for (var i = 0; i < data.length; i++) {
        if (!hash[data[i].province]) {
            hash[data[i].province] = {
                'province': data[i].province
            };
            hash[data[i].province]['city'] = [{
                'name': data[i].city,
                'code': data[i].code
            }]
            newData.push(hash[data[i].province]);
        } else if (hash[data[i].province].province == data[i].province) {
            hash[data[i].province]['city'].push({
                'name': data[i].city,
                'code': data[i].code
            })
        }
    }
    return newData;
}

var data = [{
    'province': '浙江',
    'city': '温州',
    'code': '10010'
}, {
    'province': '浙江',
    'city': '杭州',
    'code': '10011'
}, {
    'province': '安徽',
    'city': '合肥',
    'code': '10012'
}, {
    'province': '安徽',
    'city': '马鞍山',
    'code': '10013'
}, {
    'province': '浙江',
    'city': '宁波',
    'code': '10014'
}];

console.log(getTree(data));
```


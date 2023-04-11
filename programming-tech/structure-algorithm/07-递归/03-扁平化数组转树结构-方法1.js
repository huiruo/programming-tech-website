/*
pid 代表属于的父级 id
id 代表的是自己本身的id，本身的 id 是多少
[
   { id: 7, pid: 7, title: 'test7-pid-7' },
   { id: 1, pid: 0, title: 'test1-pid-0' },
   { id: 2, pid: 1, title: 'test2-pid-1' },
   { id: 3, pid: 1, title: 'test3-pid-1' },
   { id: 4, pid: 2, title: 'test4-pid-2' },
   { id: 5, pid: 2, title: 'test5-pid-2' },
   { id: 6, pid: 3, title: 'test6-pid-5' },
] 使用js, 转为树形结构数组
*/
// 方法1：使用递归函数来实现将给定数组转换为树形结构数组的操作
// 上述递归方法的时间复杂度为 $O(n^2)$，因为在最坏的情况下，需要遍历整个数组 $n$ 次，
// 每次还要遍历当前节点的子节点数组，导致总时间复杂度为 $O(n^2)$。
function buildTree(data, parentId) {
  const tree = [];
  for (const item of data) {
    if (item.pid === parentId) {
      const children = buildTree(data, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
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
const tree = buildTree(data, 0);

console.log(tree);
/*
[
  {
    id: 1,
    title: 'test1-pid-0',
    children: [
      {
        id: 2,
        title: 'test2-pid-1',
        children: [
          { id: 4, title: 'test4-pid-2', children: [] },
          { id: 5, title: 'test5-pid-2', children: [{ id: 6, title: 'test6-pid-5', children: [] }] }
        ]
      },
      { id: 3, title: 'test3-pid-1', children: [] }
    ]
  },
  { id: 7, title: 'test7-pid-7', children: [] }
]
*/

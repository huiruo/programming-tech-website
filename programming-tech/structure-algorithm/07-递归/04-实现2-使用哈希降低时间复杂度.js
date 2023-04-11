/*
有一种时间复杂度更优的算法可以解决这个问题，称为“哈希表法”，其时间复杂度为 $O(n)$。

具体实现方法是：

1.遍历数组，以每个节点的 id 为键，将节点存储在一个哈希表中；
2.再次遍历数组，以每个节点的 pid 为键，在哈希表中查找对应的父节点，将节点添加到父节点的 children 数组中。

这种方法的优点是，在第二次遍历时，我们可以通过哈希表快速找到每个节点的父节点，而不需要每次都遍历整个数组。这样可以将算法的时间复杂度从 $O(n^2)$ 降低到 $O(n)$。


使用时间复杂度更小的算法需要改变数据结构的形式，将每个节点存储为一个对象，
并且用一个 Map 来保存节点的 id 和对象的映射关系。
这样，在遍历数组的同时，可以快速找到节点的父节点，
 从而将节点添加到相应的父节点的 children 属性中。以下是一个可能的实现：
*/
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

/*
      1
     / \
    2   3
   / \   \
  4   5   6
 /     \  |
7       8 9
*/
// 使用邻接表表示图
const graph = {
  1: [2, 3],
  2: [4, 5],
  3: [6],
  4: [7],
  5: [8],
  6: [9],
  7: [],
  8: [],
  9: [],
};

// 深度优先搜索实现
function dfs(node, target, visited) {
  visited[node] = true;
  if (node === target) return true;
  for (const neighbor of graph[node]) {
    if (!visited[neighbor]) {
      const found = dfs(neighbor, target, visited);
      if (found) return true;
    }
  }
  return false;
}

console.log('======')
console.log('dfs:', dfs(1, 8, {})); // true

// 广度优先搜索实现
function bfs(start, target) {
  const queue = [start];
  const visited = { [start]: true };
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === target) return true;
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }
  return false;
}

console.log('bfs:', bfs(1, 8)); // true

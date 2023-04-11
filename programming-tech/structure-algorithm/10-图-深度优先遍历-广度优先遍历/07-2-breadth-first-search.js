import Queue from '../../common/queue';

const Colors = {
  WHITE: 0,
  GREY: 1,
  BLACK: 2
};

const initializeColor = vertices => {
  const color = {};
  for (let i = 0; i < vertices.length; i++) {
    color[vertices[i]] = Colors.WHITE;
  }
  return color;
};

export const breadthFirstSearch = (graph, startVertex, callback) => {
  // 获取顶点
  const vertices = graph.getVertices();
  // 获取邻接表
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices); // 1
  const queue = new Queue(); // 2

  queue.enqueue(startVertex); // 3

  while (!queue.isEmpty()) {  // 4
    const u = queue.dequeue(); // 5
    const neighbors = adjList.get(u); // 6
    color[u] = Colors.GREY; // 7
    for (let i = 0; i < neighbors.length; i++) { // 8
      const w = neighbors[i]; // 9
      if (color[w] === Colors.WHITE) { // 10
        color[w] = Colors.GREY; // 11
        queue.enqueue(w); // 12
      }
    }
    color[u] = Colors.BLACK; // 13
    if (callback) { // 14
      callback(u);
    }
  }
};

// 使用BFC寻找最短路径
export const BFS = (graph, startVertex) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  const queue = new Queue();
  const distances = {}; // 1
  const predecessors = {};  // 2
  queue.enqueue(startVertex);
  for (let i = 0; i < vertices.length; i++) { // 3
    distances[vertices[i]] = 0; // 4
    predecessors[vertices[i]] = null; // 5
  }
  while (!queue.isEmpty()) {
    const u = queue.dequeue();
    const neighbors = adjList.get(u);
    color[u] = Colors.GREY;
    for (let i = 0; i < neighbors.length; i++) {
      const w = neighbors[i];
      if (color[w] === Colors.WHITE) {
        color[w] = Colors.GREY;
        distances[w] = distances[u] + 1;  // 6
        predecessors[w] = u;  // 7
        queue.enqueue(w);
      }
    }
    color[u] = Colors.BLACK;
  }
  return {  // 8
    distances,
    predecessors
  };
};

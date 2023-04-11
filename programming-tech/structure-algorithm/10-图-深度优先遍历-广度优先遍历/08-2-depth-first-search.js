// import Graph from '../../data-structures/graph';

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

export const depthFirstSearch = (graph, callback) => { // 1
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);

  for (let i = 0; i < vertices.length; i++) { // 2
    if (color[vertices[i]] === Colors.WHITE) { // 3
      depthFirstSearchVisit(vertices[i], color, adjList, callback); // 4
    }
  }
};

const depthFirstSearchVisit = (u, color, adjList, callback) => {
  color[u] = Colors.GREY; // 5
  if (callback) { // 6
    callback(u);
  }
  // console.log('Discovered ' + u);
  const neighbors = adjList.get(u); // 7
  for (let i = 0; i < neighbors.length; i++) { // 8
    const w = neighbors[i]; // 9
    if (color[w] === Colors.WHITE) { // 10
      depthFirstSearchVisit(w, color, adjList, callback); // 11
    }
  }
  color[u] = Colors.BLACK; // 12
  // console.log('explored ' + u);
};

const DFSVisit = (u, color, d, f, p, time, adjList) => {
  // console.log('discovered ' + u);
  color[u] = Colors.GREY;
  d[u] = ++time.count;
  const neighbors = adjList.get(u);
  for (let i = 0; i < neighbors.length; i++) {
    const w = neighbors[i];
    if (color[w] === Colors.WHITE) {
      p[w] = u;
      DFSVisit(w, color, d, f, p, time, adjList);
    }
  }
  color[u] = Colors.BLACK;
  f[u] = ++time.count;
  // console.log('explored ' + u);
};

export const DFS = graph => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  const d = {};
  const f = {};
  const p = {};
  const time = { count: 0 };
  for (let i = 0; i < vertices.length; i++) {
    f[vertices[i]] = 0;
    d[vertices[i]] = 0;
    p[vertices[i]] = null;
  }
  for (let i = 0; i < vertices.length; i++) {
    if (color[vertices[i]] === Colors.WHITE) {
      DFSVisit(vertices[i], color, d, f, p, time, adjList);
    }
  }
  return {
    discovery: d,
    finished: f,
    predecessors: p
  };
};

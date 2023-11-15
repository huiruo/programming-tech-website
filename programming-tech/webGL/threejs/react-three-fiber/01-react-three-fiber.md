## React-three-fiber是threejs的React渲染器
通过JSX语法来实现Threejs的各种组件，`<mesh />`会被动态的转换成new THREE.Mesh()

Three.js，请确保您至少浏览以下链接：

* 确保您对 [Three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) 有基本的了解
  > [threejs examples](https://threejs.org/examples/)
* 当您了解场景scene、相机camera、网格mesh、几何geometry、材质material是什么时，请fork这个[演示案例](https://github.com/pmndrs/react-three-fiber#what-does-it-look-like)。
* 查找你看到的 JSX 元素（如mesh、ambientLight等），所有 Three.js 的导出都是针对 three-fiber 的 native exports，这里就是可以理解为所有 threejs 类型都能在 R3F 中用 JSX方式使用。

[中文参考文档](https://fiber.framer.wiki/Introduction)

## 官方例子
[丰富的官方例子](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
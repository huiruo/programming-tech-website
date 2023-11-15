## 完整例子
[例子](https://github.com/huiruo/react-three-fiber-example/blob/main/src/components/demo1/index.tsx)

## 1.设置画布
Canvas元素的尺寸会和父元素的尺寸保持同步，所以如果你要设置canvas元素的大小就可以设置父元素的宽和高,Canvas组件会在后台做一些非常重要的工作：
* 它设置了一个场景和相机，这是渲染必须的环节
* 它开始每一帧的持续渲染，你不需要自己去定义一个循环渲染
```js
import ReactDOM from 'react-dom'
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <div id="canvas-container">
      <Canvas />
    </div>
  )
}
```

## 2.添加一个Mesh组件
果你要在场景中看到什么，我们还需要添加一个小写开头的`<mesh />`元素，这不需要引入，直接就可以用，相当于是去执行
```js
new THREE.Mesh()
```

```jsx
<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>
```

Mesh类型是threejs的场景中基本的一种元素，这个元素用来组织几何体（geometry）和材质（material），这样才能组成一个三维的元素。

我们可以在创建mesh元素的时候搭配上BoxGeometry几何体和MeshStandardMaterial材质，它们两回自动的绑定到他的父元素mesh对象上。

### 上面几句代码相当于下面的这些Threejs代码
```js
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
document.querySelector('#canvas-container').appendChild(renderer.domElement)

const mesh = new THREE.Mesh()
mesh.geometry = new THREE.BoxGeometry()
mesh.material = new THREE.MeshStandardMaterial()

scene.add(mesh)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()
```

## Props
在Fiber组件上设置任何的props，那么其实就是给对应的Threejs的元素设置一样名称的属性。

### ambientLight这个组件，从文档上我们能知道构造他的时候可以传入颜色值
```js

<ambientLight intensity={0.1} />

// 相当于
const light = new THREE.AmbientLight()
light.intensity = 0.1
```

### 简化写法
对于一些Threejs中的元素，他们本来有一些set方法，在Fiber组件上呢，有更简化的写法可以达到同样的效果（比如颜色、向量、位置等等）。
```js
const light = new THREE.DirectionalLight()
light.position.set(0, 0, 5)
light.color.set('red')

// 相当于
<directionalLight position={[0, 0, 5]} color="red" />
```

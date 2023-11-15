## hooks用法
Hooks 允许你对组件进行特定信息的请求或者绑定。例如，想要参与渲染循环的组件可以使用 useFrame，需要了解 three.js 运行信息或者获取相关功能引用，可以使用 useThree 等等。所有hooks都会在组件卸载后自行清理。

Hooks只能用在Canvas组件内部，因为它们依赖于上下文环境！

不能像下面代码这样来写：
```js
import { useThree } from '@react-three/fiber'

function App() {
  const { size } = useThree() // This will just crash
  return (
    <Canvas>
      <mesh>
```

### 应该像这样，useThree要放在组件中，然后把组件放到Canvas元素中：
```js
function Foo() {
  const { size } = useThree()
  ...
}

function App() {
  return (
    <Canvas>
      <Foo />
```

## useThree
这个Hook能帮你获取到一个对象，这个对象包含了默认的渲染器、场景、你的相机以及等等。它也能给你当前在画面的中canvas的储存还有视口的坐标信息等等。

这个Hook是响应式的，例如，如果调整浏览器大小，将获得最新的测量结果，同样适用于可能更改的任何状态对象。
```js
import { useThree } from '@react-three/fiber'

function Foo() {
  const state = useThree()
```

### Selector
可以为组件选择属性，这样可以避免那些仅关心特定内容的组件进行不必要的重新渲染。但是需要注意的是，响应性并不包含相应属性的内部的属性。

```js
// 只有当默认相机改变的时候才会触发重新渲染
const camera = useThree((state) => state.camera)
// 只有窗口大小发生改变的时候才会触发重新渲染
const viewport = useThree((state) => state.viewport)
// ❌ 像这种的话就不会触发了，因为这是需要的是camera内部属性，不会有响应式的效果
const zoom = useThree((state) => state.camera.zoom)
```

## useFrame
这个hook允许你在每一帧渲染时执行代码，例如运行特效、更新控制等等。你会收到state对象（与 useThree 相同）和一个时钟增量。你的回调函数会在每一帧渲染之前被调用。当组件卸载时，它会自动从渲染循环中取消订阅。
```js
import { useFrame } from '@react-three/fiber'

function Foo() {
  useFrame((state, delta, xrFrame) => {
    // 这个函数依据显示设备的刷新率在每次渲染前执行
  })
```

>在 useFrame 中要小心你做的事情！你不应该在其中使用 setState！你的计算应该尽量简单，同时要注意所有通常与循环处理有关的常见陷阱，例如变量的重复使用等等。

### Taking over the render-loop 接手循环渲染
如果你需要对循环渲染有更多的控制，你可以传递一个数字渲染优先级值。这将导致 React Three Fiber 完全禁用自动渲染。现在，渲染将由你负责，这在你处理特效合成器、抬头显示等内容时非常有用。
```js
function Render() {
  // 当设置了渲染优先级参数，那么需要你自己设置相关代码进行渲染
  useFrame(({ gl, scene, camera }) => {
    gl.render(scene, camera)
  }, 1)

function RenderOnTop() {
  // 这个会在Render中的useFrame之后执行
  useFrame(({ gl, ... }) => {
    gl.render(...)
  }, 2)
```

### Negative indices 负数优先级
当把优先级数字设置为负数时，自动的渲染行为不会被禁用，但是可以让你管理在整个组件树种所有useFrame的执行顺序。
```js
function A() {
  // This will execute first
  useFrame(() => ..., -2)

function B() {
  // This useFrame will execute *after* A's
  useFrame(() => ..., -1)
```

## useLoader
这个Hook加载资源并暂停，以便更容易地处理回退和错误。它可以将任何three.js的加载器作为其第一个参数：GLTFLoader，OBJLoader，TextureLoader，FontLoader等。它基于React.Suspense，因此回退处理和错误处理发生在父层级别。
```js
import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Model() {
  const result = useLoader(GLTFLoader, '/model.glb')
  // 不用担心模型加载后的展现问题
  // 我们会保证模型会被正确加载并展示
  return <primitive object={result.scene} />
}

function App() {
  return (
    <Suspense fallback={<FallbackComponent /> /* or null */}>
      <Model />
    </Suspense>
  )
}
```

>通过useLoader加载的资源默认是会被缓存的。根据资源的url来作为资源的缓存标识。这让你能够方便的在组件的任何地方重复使用数据。


### Loader extensions 加载扩展
可以在使用第三个参数，传入一个回调函数，来对你的loader进行一个配置和额外处理。
```js
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

useLoader(GLTFLoader, url, (loader) => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco-gltf/')
  loader.setDRACOLoader(dracoLoader)
})
```

### Loading multiple assets at once 同时加载多个资源
```js
const [bumpMap, specMap, normalMap] = useLoader(TextureLoader, [url1, url2, url2])
```

### Loading status 加载状态
你可以通过第四个参数，传入一个回调来获取加载的状态。不过请考虑使用替代方案，如THREE.DefaultLoadingManager或者更好的Drei的加载辅助工具。
```js
useLoader(loader, url, extensions, (xhr) => {
  console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
})
```

### Pre-loading assets 预加载资源
您可以在全局空间中预加载资源，以便在组件树中安装之前可以预先加载模型。
```js
import { useLoader, useGraph } from '@react-three/fiber'

function Model(url) {
  const scene = useLoader(OBJLoader, url)
  const { nodes, materials } = useGraph(scene)
  return <mesh geometry={nodes.robot.geometry} material={materials.metal} />
}
```

## useGraph
一个可以通过Object3D数据方便地创建一个可记忆（不会在组件重新执行时重复创建）的、命名的对象/材质集合。
```js
import { useLoader, useGraph } from '@react-three/fiber'

function Model(url) {
  const scene = useLoader(OBJLoader, url)
  const { nodes, materials } = useGraph(scene)
  return <mesh geometry={nodes.robot.geometry} material={materials.metal} />
}
```

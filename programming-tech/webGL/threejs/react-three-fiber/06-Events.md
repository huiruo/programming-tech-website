## Events
实现了自己的 raycast 方法的 three.js 对象（如 meshes、lines 等）可以通过在它们上面声明事件来进行交互。我们支持指针事件、点击和滚轮滚动。这些事件包含浏览器事件以及 three.js 的事件数据（对象、点、距离等）。如果需要的话，您可能需要对它们进行 polyfill。 

此外，还有一个特殊的 onUpdate，在每次对象获得新属性时调用，这对于像 self => (self.verticesNeedUpdate = true) 这样的事情非常有用。 

还请注意画布元素上的 onPointerMissed，它会在点击未命中任何网格时触发。
```js
<mesh
  onClick={(e) => console.log('click')}
  onContextMenu={(e) => console.log('context menu')}
  onDoubleClick={(e) => console.log('double click')}
  onWheel={(e) => console.log('wheel spins')}
  onPointerUp={(e) => console.log('up')}
  onPointerDown={(e) => console.log('down')}
  onPointerOver={(e) => console.log('over')}
  onPointerOut={(e) => console.log('out')}
  onPointerEnter={(e) => console.log('enter')} // see note 1
  onPointerLeave={(e) => console.log('leave')} // see note 1
  onPointerMove={(e) => console.log('move')}
  onPointerMissed={() => console.log('missed')}
  onUpdate={(self) => console.log('props have been updated')}
/>
```

Event data 事件对象数据:
```js
({
  ...DomEvent                   // 所有原始的事件对象数据
  ...Intersection                 // 所有交互相关数据 - see note 2
  intersections: Intersection[]    // 每一个产相交的对象的第一个相交数据
  object: Object3D              // raycast真实击中的三维物体
  eventObject: Object3D         // 注册了事件的三维物体
  unprojectedPoint: Vector3     // 表示的是鼠标指针在场景中的三维坐标
  ray: Ray                      // 用来投射的射线实例
  camera: Camera                // 在raycaster使用的camera
  sourceEvent: DomEvent         // 原始事件对象的引用
  delta: number                 // 鼠标从按下到抬起所移动的像素距离
}) => ...
```

## 事件系统如何工作？冒泡和捕获？
### Event propagation(bubbling) 事件传播
因为在3D中，物体可以互相遮挡，所以事件传播（Propagation）的方式与DOM有些不同。事件的交集数组包含所有与射线相交的物体，而不仅仅是最近的物体。每个物体的第一个交点才会被包含在事件中。事件首先被传递到离相机最近的物体，然后像在DOM中一样从其祖先元素中冒泡。之后，它被传递到下一个最近的物体，然后是它的祖先元素，以此类推。这意味着，默认情况下，即使物体处理了事件，它们对指针事件也是透明的（这个透明指的是，后面的那些三维物体也能透过遮挡在前面的三维物体接受到事件）。

event.stopPropagation()不仅会阻止事件冒泡，还会阻止事件被传递到更远的对象（该对象后面的对象）。当指针悬停在该对象上时，所有其他更近或更远的对象都不再被视为被点击。如果它们之前收到了pointerover事件，则会立即收到pointerout事件。
```js
onPointerOver={e => {
  e.stopPropagation()
  // ...
}}
```

如果你想让一个对象阻止后面的对象接收指针事件，它需要有一个事件处理程序，即使你不想让该对象响应指针事件。如果你想同时处理该事件并使用stopPropagation()，请记住，在调用stopPropagation()期间，pointerout事件也会发生。你可能希望在此之后进行其他事件处理。

### Pointer capture 指针捕获
因为事件会传递给所有相交的对象，因此捕获指针的方式也有所不同。在DOM中，捕获对象替换了命中测试，但在React Three Fiber中，捕获对象被添加到命中测试结果中：如果未命中捕获对象，则所有命中对象（及其祖先）首先接收事件，然后是捕获对象及其祖先。捕获对象还可以使用event.stopPropagation()，以便真正被命中的对象得到pointerout事件。

请注意，您只能通过event.target访问setPointerCapture和releasePointerCapture方法：它们不会添加到场景数据中的Object3D实例中。

setPointerCapture和releasePointerCapture采用与DOM中相同的pointerId参数，但目前它们不支持多个活动指针。
```js
onPointerDown={e => {
  // 只有距离相机最近物体才会被处理
  e.stopPropagation()
  // 你可以通过这个方法捕获目标元素
  e.target.setPointerCapture(e.pointerId)
}}
onPointerUp={e => {
  e.stopPropagation()
  // 可选的释放捕获
  e.target.releasePointerCapture(e.pointerId)
}}
```

### Customizing the event setting 自定义事件设置
在一些高级的使用场景中我们需要自定义设置事件的一些设置，我们可以通过`<Canvas />`元素的events属性来进行全局的事件管理：
```js
import { Canvas, events } from '@react-three/fiber'

const eventManagerFactory: Parameters<typeof Canvas>[0]['events'] = (state) => ({
  // 默认设置
  ...events(state),

  // 决定事件层是否激活状态
  enabled: true,

  // 事件层的优先级，高优先级的优于低优先级，同时可能会阻止事件像低事件层传播
  priority: 1,

  // filter可以用来重新排序或者重新构建交叉产生的相关数据
  filter: (items: THREE.Intersection[], state: RootState) => items,

  // 这里计算逻辑局定pointer事件如何转换成raycaster和pointer Vector2的数据
  compute: (event: DomEvent, state: RootState, previous?: RootState) => {
    state.pointer.set((event.offsetX / state.size.width) * 2 - 1, -(event.offsetY / state.size.height) * 2 + 1)
    state.raycaster.setFromCamera(state.pointer, state.camera)
  },

  // 更多的默认配置信息./packages/fiber/src/web/events.ts
  // 类型定义信息./packages/fiber/src/core/events.ts
})

function App() {
  return (
    <Canvas events={eventManagerFactory}>
}
```

### Using a different target element 使用不同的目标对象
有些情况下，你可能希望将事件处理程通过DOM元素来触发，而不是canvas。这通常是为了在共享的父元素上处理事件，这样可以让画布和DOM覆盖层都能够接收事件。

你可以使用event管理:
```js
const events => useThree(state => state.events)
useEffect(() => {
  state.events.connect(domNode)
```

或者，canvas元素上有个eventSource属性可以设置dom姐弟哪和通过React.Ref指向的dom对象。
```js
function App() {
  const target = useRef()
  return (
    <div ref={target}>
      <Canvas eventSource={target.current}>
```

### Using a different prefix(DOM only) 使用不同的前缀（只有DOM可以）
默认情况下Fiber会使用offsetX/offsetY作为前缀去设置raycaster。你可以通过eventPrefix属性来进行自定义设置。
```js
function App() {
  return (
    <Canvas eventPrefix="client">
```

### Allow raycast without user interaction 用户无交互可以投射射线
默认情况下，Fiber只会在用户与画布交互时进行射线投射。如果这样的情况，比如相机将可悬停对象移动到光标下方，它将不会触发hover事件。如果需要这种行为，即在这样的情况你也想触发hover事件，您可以通过执行update()来强制进行射线投射，在需要时随时调用它。
```js
const events => useThree(state => state.events)
useEffect(() => {
  // 会在已知的最后一个pointer event对象上触发PointerMove事件
  state.events.update()
```

你可以把这个行为抽象到更复杂的逻辑中
```js
function RaycastWhenCameraMoves() {
  const matrix = new THREE.Matrix4()
  useFrame((state) => {
    // 相机移动的时候就会执行
    if (!matrix.equals(state.camera.matrixWorld)) {
      state.events.update()
      matrix.copy(state.camera.matrixWorld)
    }
  })
}
```

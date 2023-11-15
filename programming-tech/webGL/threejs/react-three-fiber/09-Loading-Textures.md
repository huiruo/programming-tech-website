## Loading Textures(加载材质)
为了加载纹理，我们将使用three.js中的TextureLoader与useLoader相结合，这将允许我们传递纹理的位置并获取可以用来作为材质的数据。

最好用代码来解释，假设您下载了此纹理并将其放在项目的公共文件夹中，要从中获取颜色材质数据，您可以执行以下操作：
```js
const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')
```

然后让我们利用这些材质数据来创建一个小的场景：
```js
import { Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

function Scene() {
  const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
```

如果一切顺利的话，你现在应该可以把材质应用到一个球体上了，就像这样：
```js
<meshStandardMaterial map={colorMap} />
```

可以正常显示，但是如果我们有很多材质需要去引入的话，是不是意味着我们需要给每一个材质资源使用 useLoader？
完全不必！我们可以利用第二个参数，把相关的图片资源作为数组传入第二个参数，这样就会返回所有相关的材质数据了：
```js
const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])
```

还在完成后我们可以把这些材质放到 mesh 的各个属性中：
```js
<meshStandardMaterial
  map={colorMap}
  displacementMap={displacementMap}
  normalMap={normalMap}
  roughnessMap={roughnessMap}
  aoMap={aoMap}
/>
```

displacement 的效果可能会有些太多了，可以设置 displacementScale 为 0.2，这个属性设置为这个值是比较常见的，看起来效果会比较好。我们最终的代码看起来是这个样子：
```js
function Scene() {
  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    'PavingStones092_1K_Color.jpg',
    'PavingStones092_1K_Displacement.jpg',
    'PavingStones092_1K_Normal.jpg',
    'PavingStones092_1K_Roughness.jpg',
    'PavingStones092_1K_AmbientOcclusion.jpg',
  ])
  return (
    <mesh>
      {/* Width and height segments for displacementMap */}
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        displacementScale={0.2}
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </mesh>
  )
}
```

## Using useTexture
另一种导入这些材质文理的方式是使用 @react-three/drei 中的 useTexture，这样会更容易一些，而且不需要导入 TextureLoader，我们的代码看起来会像这样：
```js
import { useTexture } from "@react-three/drei"

...

const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useTexture([
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])
```

你也可以用对象方式的写法，这样更方便一些：
```js
const props = useTexture({
  map: 'PavingStones092_1K_Color.jpg',
  displacementMap: 'PavingStones092_1K_Displacement.jpg',
  normalMap: 'PavingStones092_1K_Normal.jpg',
  roughnessMap: 'PavingStones092_1K_Roughness.jpg',
  aoMap: 'PavingStones092_1K_AmbientOcclusion.jpg',
})

return (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial {...props} />
  </mesh>
)
```

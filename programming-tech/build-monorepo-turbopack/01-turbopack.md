
## 影响开发体验的地方是首次编译和后续的增量编译
[Turbopack 官网](https://turbo.build/pack)

如何评价Vercel开源的使用Rust实现的Turbopack?

https://www.zhihu.com/question/562349205/answers/updated

## 为什么选择 Turbopack
传统的 Monorepo 解决方案中，项目构建时如果基于多个应用程序存在依赖构建，耗时是非常可怕的。

Turbopack 是针对 JavaScript 和 TypeScript 优化的增量打包工具

比方说 Monorepo 存在三个依赖应用程序包，A、B、C。此时 A 和 C 包都依赖与 B 包。基于 Lerna 你可以发现一次仅能执行一个任务，当构建时首先运行 lerna run link --parallel 时仅支持单个任务的运行。

而基于 TurboRepo 支持多个任务的并行处理，完美了的解决了 Lerna 构建时类似“单线程”的不足。

由于 Turbopack 只打包开发所需的最少资源，因此启动时间非常快。在具有 3000 个模块的应用上，Turbopack 需要 1.8 秒即可启动，而 Vite 则需要 11.4 秒：

## Turbopack 为什么快？
Turbopack 性能的秘诀有两个：
* 高度优化的机器代码和低层级增量计算引擎，可以缓存到单个函数的级别。它的架构吸取了 Turborepo 和 Google 的 Bazel 等工具的经验教训，它们都专注于使用缓存来避免重复执行相同的工作。

* Rust Turbo 引擎,支持增量计算。以下是它的工作原理。

在 Turbopack 驱动的程序中，可以将某些函数标记为“to be remembered”。当这些函数被调用时，Turbo 引擎会记住它们被调用的内容，以及它们返回的内容。然后它将其保存在内存缓存中。下面是一个简化的示例：

由于 sdk.ts 的结果发生了变化，就需要再次打包，然后需要再次拼接。重要的是，api.ts 并没有改变。 只需从缓存中读取它的结果并将其传递给 concat。 因此，这样就通过不读取并重新打包来节省了时间。

Turbo 引擎当前将其缓存存储在内存中。这意味着缓存将与运行它的进程一样长，这对于 Dev server 来说效果很好。将来，计划将这个缓存持久化——要么保存到文件系统中，要么保存到像 Turborepo 这样的远程缓存中。这意味着 Turbopack 可以记住跨运行和机器完成的工作。

这种方法使 Turbopack 在计算应用的增量更新方面非常快速，优化了 Turbopack 以处理开发中的更新，这意味着 Dev server 将始终快速响应更改。


### 按要求编译
Turbo 引擎有助于在 Dev server 上提供极快的更新，但还有另一个重要指标需要考虑——启动时间。Dev server 开始运行的速度越快，开始工作的速度就越快。有两种方法可以使流程更快：工作更快或做工作更少。为了启动 Dev server，减少工作量的方法就是只编译启动所需的代码。

（1）页面级编译
（2）请求级编译

### 增量计算
通常，有两种方法可以加快进程：减少工作量或并行工作。想要打造最快的打包工具，就要用力拉动这两个杠杆。因此决定为分布式和增量行为创建一个可重用的 Turbo 构建引擎。Turbo 引擎就像函数调用的调度程序一样工作，允许在所有可用内核上并行调用函数。Turbo 引擎还会缓存它调度的所有函数的结果，这意味着它永远不需要执行两次相同的工作。简而言之，它会以最大速度做最少的工作。

其他工具对“做更少的工作”采取不同的方式。比如，Vite 通过在开发模式下使用原生 ESM 将工作量降至最低。在底层，Vite 将 esbuild 用于许多任务。esbuild 是一个非常快的打包器，它不会强迫我们使用原生 ESM。但出于几个原因，决定不采用 esbuild：

esbuild 的代码针对一项任务进行了超优化 - 快速打包，因此没有 HMR（热更新）；
esbuild 是一个非常快的打包工具，但它并没有做太多的缓存。这意味着会做很多重复的工作；
而具有增量计算的 Rust 驱动的打包器在更大的规模上可以比 esbuild 更好地执行。

### 惰性打包
Next.js 的早期版本试图在开发模式下打包整个 Web 应用，这并不是最优的。Next.js 的现代版本仅打包 Dev server 请求的页面。例如，如果转到localhost:3000，它将仅打包 pages/index.jsx，以及它导入的模块。

这种更“惰性”的方法是快速 Dev server 的关键。而 esbuild 没有“惰性”打包的概念——它是全有或全无的。Turbopack 的开发模式会根据收到的请求构建应用导入和导出的最小图，并且只打包必要的最少代码。

此策略使 Turbopack 在首次启动 Dev server 时速度极快。只需计算渲染页面所需的代码，然后在单个块中将其发送到浏览器。在大规模应用中，这最终比原生 ESM 快得多。

这就是构建 Turbopack 的原因。

### Turbopack 的功能
构建 Web 应用的实践非常多样化。仅在 CSS 中，就有 SCSS、Less、CSS Module、PostCSS等。React、Vue 和 Svelte 等框架需要自定义设置。

在构建打包工具时，我们希望它能开箱即用，无需配置，可以通过插件获得一些功能。目前，Turbopack 仍处于 alpha 阶段，在当前状态下，Turbopack 还不能配置，所以插件也还不可用。

下面来看一下 Turbopack 默认配置中哪些功能是开箱即用的以及未来将通过插件配置的功能：
* JavaScript：支持所有 ESNext 功能、Browserslist 和顶层 await；
* TypeScript：开箱即用地支持 TypeScript，包括解析路径和baseUrl；
* Imports：支持 require、import、动态导入等；
* Dev Server：优化的 Dev Server 支持热更新 (HMR) 和快速刷新；
* CSS：支持全局 CSS、CSS Module、postcss-nested 和 @import；
* 静态资源：支持 /public 目录、JSON 导入和通过 ESM 导入资源；
* 环境变量：通过 .env、.env.local 等支持环境变量。

## Turbopack vs Vite
Turbopack 在以下两个关键指标上的表现优于 Vite。

（1）Dev server 启动时间

（2）代码更新
当文件更改时，它需要将更改呈现给浏览器。 它做到的越快，反馈循环就越紧密，发布的速度就越快。

## 使用
快速创建:
```
npx create-turbo@latest
yarn workspace web add monaco-editor
yarn workspace web remove monaco-editor
```

turbo.json ，这个文件主要可以用来设定一些执行指令的 pipeline，而 pipeline 主要的功能就是当你在执行 yarn run xxx 时

dev 有一个 cache 为 false 的设定，就代表著每次执行 dev 这个指令时都不要使用先前的 cache 以确保每次的开发环境都会是最新的环境。

## 在其他包引入packages
假如要让 packages 内的某个文件容给 apps 内的某个项目用，这时候就可以在该项目 package.json 中填上对应包名，并且把版本号设定为 * ，这样就可以在该项目内引用 packages 中的内容

## 参考：
https://cloud.tencent.com/developer/article/1974147

https://juejin.cn/post/7129267782515949575

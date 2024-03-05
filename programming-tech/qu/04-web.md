### 同域下多窗口间localStorage/seccionStorage是否可以共享
- localStorage可以在同域下多窗口间共享数据
- sessionStorage不可以。是浏览器会话级别的存储机制，它只在单个浏览器标签页（tab）或窗口之间共享数据。每当用户打开一个新的标签页或窗口时，会话存储会被重新初始化，每个标签页或窗口都会有自己的独立的sessionStorage。

### BOM对象
Browser Object Model浏览器对象模型，提供了独立于内容与浏览器窗口进行交互的对象

1. Bom的核心对象是window，它表示浏览器的一个实例

1. location
```
hash
host
href
pathname
port
```

1. navigator 对象主要用来获取浏览器的属性，区分浏览器类型。属性较多，且兼容性比较复杂

1. history对象主要用来操作浏览器URL的历史记录，可以通过参数向前，向后，或者向指定URL跳转

### 讲一下 webpack 的 loader 和 plugin

### 讲一下 Babel 的原理，讲一下 AST 抽象语法树

### 讲一下 webpack 的打包流程
Webpack 的打包流程是将前端项目中的多个源文件（包括 JavaScript、CSS、HTML、图片等）打包成一个或多个输出文件的过程。Webpack 的打包流程可以分为以下主要步骤：

1. **入口点（Entry Point）**：Webpack 根据你的配置文件（通常是 `webpack.config.js`）中的入口点配置，确定打包的入口文件或入口模块。入口点是构建过程的起始位置。

2. **依赖解析（Dependency Resolution）**：Webpack 开始从入口点出发，递归解析所有的依赖模块。这包括 JavaScript 模块之间的 `import` 和 `require` 语句，以及其他资源文件（如 CSS、图片等）的依赖关系。

3. **加载器（Loaders）**：在依赖解析阶段，Webpack 使用加载器来转换不同类型的文件，将它们转换成适合打包的模块。加载器通常用于处理非 JavaScript 文件，如将 Sass 文件编译成 CSS 或将 ES6 代码转换成普通 JavaScript。

4. **插件（Plugins）**：Webpack 使用插件来执行各种自定义任务，如生成 HTML 文件、压缩 JavaScript 代码、拷贝静态文件等。插件能够在整个构建过程中实现更多的功能和优化。

5. **生成 Chunk**：Webpack 将模块分割成一个个代码块（Chunk）。这通常包括应用代码、第三方库、运行时代码等。Webpack 支持代码分割，以提高性能和缓存。

6. **输出（Output）**：在这一步，Webpack 根据配置文件中的输出路径和文件名规则，将打包后的文件输出到指定目录中。

7. **优化（Optimization）**：Webpack 4+ 提供了强大的优化功能，包括代码分割、压缩、Tree Shaking、缓存等，以确保生成的文件更小、更高效。

8. **生成文件**：Webpack 根据配置生成打包后的文件。这些文件包括 JavaScript、CSS、HTML 和其他资源文件。

9. **Dev Server 或输出到生产环境**：在开发环境中，通常使用 Webpack Dev Server 来提供热重载和开发工具。在生产环境中，生成的文件通常被部署到服务器或 CDN 上，以便用户访问。

Webpack 的打包流程是高度可定制的，你可以通过配置文件来定义入口点、加载器、插件、优化选项和输出规则，以满足你的项目需求。通过了解Webpack的打包流程，你可以更好地理解它的工作原理，提高前端项目的构建效率和性能。

### webpack 的热更新原理是怎样的？
Webpack 的热更新（Hot Module Replacement，HMR）是一项使开发过程更加高效的功能，它可以在不刷新整个页面的情况下，将代码的变更反映到正在运行的应用程序中。HMR 的原理可以简要概括如下：

1. **监听文件变更**：Webpack 开发服务器会监视项目中的文件，包括源代码、样式表、模板等。

2. **构建新模块**：当文件发生变化时，Webpack 会重新构建相应的模块，并生成新的模块代码。

3. **通知更新**：Webpack 会将构建后的模块代码以 JSON 格式发送到客户端。

4. **客户端更新**：客户端接收到更新通知后，会根据新的模块代码来更新应用程序的运行状态，而无需刷新整个页面。

5. **应用局部更新**：HMR 允许模块级别的更新，只有受影响的模块会被替换，而不是整个应用。这有助于保持应用程序的状态和用户输入。

在实际开发中，HMR 的实现通常需要使用相应的插件和加载器，例如 `webpack-dev-server` 插件和 `HotModuleReplacementPlugin` 插件。这些插件负责设置服务器和客户端的通信，以便实现模块热替换。

总的来说，Webpack 的热更新通过监视文件变更、构建新模块、通知客户端以及客户端更新的方式，使开发者可以更加快速地进行前端开发，提高开发效率。这种能力在现代前端开发中非常有用，特别是对于大型应用程序，可以减少开发者等待构建和刷新页面的时间。

### 讲一下 webpack5 的模块联邦
Webpack 5 的模块联邦（Module Federation）是一个强大的功能，允许将多个独立的Webpack项目（通常是微前端应用）组合在一起，共享模块和代码。这对于构建分布式、模块化的应用程序非常有用，可以减少冗余代码，提高性能，并简化项目的维护。

以下是关于 Webpack 5 模块联邦的一些重要概念和用法：

1. **远程模块**：模块联邦允许将模块从一个远程Webpack项目导入到另一个项目中。这些远程模块可以是独立的、独立部署的项目。

2. **主应用和子应用**：一个主应用可以加载一个或多个子应用，子应用可以是不同的Webpack项目。主应用和子应用之间可以相互通信和共享模块。

3. **共享模块**：模块联邦支持定义和共享模块，这些模块可以在不同的项目之间共享，以减少冗余代码。共享模块可以是第三方库、工具函数或自定义模块。

4. **动态加载**：可以在运行时动态加载远程模块，这使得按需加载模块成为可能，从而提高性能。

5. **配置**：Webpack 5 模块联邦需要在Webpack配置中进行配置。你需要指定要共享的模块、远程应用的入口点以及如何加载远程模块。

以下是一个示例Webpack配置，演示了如何设置模块联邦：

```javascript
// 主应用的Webpack配置
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mainApp',
      remotes: {
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
      },
      shared: ['lodash'],
    }),
  ],
};

// 子应用的Webpack配置
module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      library: { type: 'var', name: 'remoteApp' },
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
      },
      shared: ['lodash'],
    }),
  ],
};
```

在上面的示例中，主应用通过 `ModuleFederationPlugin` 配置了模块联邦，远程导入了 `remoteApp` 子应用中的模块，并共享了名为 `lodash` 的模块。

模块联邦使得构建微前端应用变得更加容易，可以将不同的应用拼接在一起，实现更高效的开发和部署策略。它提供了一种强大的工具，帮助开发者构建复杂的分布式应用程序。

### 在 seo 优化方面，前端要从哪些点去考虑？
标签语义化、服务端渲染、img 标签添加 alt 属性、在 head 中添加 meta 标签、提高搜索引擎的排名。

### 1.window方法，window.onload,ready的加载机制，window获取url参数的方法
1. window.onload是一个事件处理程序，当整个页面及其所有外部资源（如图像和样式表）都已加载完成时触发。可以将函数分配给window.onload属性，以在页面加载完成后执行特定的操作。例如：
```js
window.onload = function() {
  // 在页面加载完成后执行的代码
};
```
2. Query库中的ready事件，它在DOM树构建完毕后触发，而无需等待外部资源（如图像）加载完成。与window.onload不同，ready事件可以在页面的其他资源加载完成之前执行。
```js
$(document).ready(function() {
  // 在DOM准备就绪后执行的代码
});
```

3. 使用window.location.search来获取当前页面URL中的查询参数部分。例如，对于URL https://example.com/?name=John&age=25，可以使用以下代码获取参数值：
```js
var urlParams = new URLSearchParams(window.location.search);
var name = urlParams.get('name'); // "John"
var age = urlParams.get('age'); // "25"
```

### 讲一下浏览器的垃圾回收机制
浏览器的垃圾回收机制是一种用于管理内存的自动化系统，它负责检测和回收不再被程序使用的内存，以便释放资源和避免内存泄漏。浏览器的垃圾回收机制主要针对 JavaScript 的内存管理，以下是其工作原理的关键概念：

1. **标记-清除算法（Mark and Sweep）**：这是最常见的垃圾回收算法之一。它工作方式如下：
   - 首先，垃圾回收器会从根对象（通常是全局对象）开始，标记所有可以从根对象访问到的对象。
   - 然后，它会扫描堆中的所有对象，标记那些已经被访问到的对象。
   - 最后，垃圾回收器会清除那些没有被标记的对象，即未被访问到的对象，释放它们占用的内存。

2. **分代回收**：分代回收是一种优化策略，根据对象的生命周期将内存划分为不同的代。通常，新创建的对象被分配到新生代，较长时间存活的对象被分配到老年代。新生代的垃圾回收更频繁，而老年代的垃圾回收更加耗时。这种策略可以提高性能，因为新生代的对象通常更容易被回收。

3. **引用计数**：虽然主要使用标记-清除算法，但浏览器的垃圾回收机制也包括引用计数。引用计数是一种简单的垃圾回收方法，它跟踪每个对象的引用次数。当引用次数为零时，垃圾回收器会立即回收该对象。然而，引用计数不能有效处理循环引用的情况，因此在现代浏览器中不再被主要使用。

4. **内存泄漏检测**：现代浏览器还内置了内存泄漏检测工具，用于检测页面中的潜在内存泄漏问题。这些工具可以帮助开发者识别和修复导致内存泄漏的问题。

需要注意的是，虽然浏览器的垃圾回收机制能够自动管理内存，但开发者仍然需要注意编写内存友好的代码，避免产生不必要的引用，及时释放不再使用的对象，以减少内存占用并确保良好的性能。此外，了解垃圾回收机制的工作原理对于调试和解决内存问题非常有帮助。

### 讲一下浏览器的渲染流程
浏览器的渲染流程是指当浏览器加载一个网页时，它是如何将网页的 HTML、CSS 和 JavaScript 转换成用户可见的界面的过程。这个过程可以分为多个阶段，通常包括以下主要步骤：

1. **构建DOM树（Document Object Model）**：当浏览器加载HTML文件时，它会解析HTML标记并构建出DOM树，表示页面的结构。DOM树是一个树形结构，由元素节点、文本节点和属性节点组成，它表示了页面的层次结构。

2. **构建CSSOM树（CSS Object Model）**：浏览器加载CSS文件并解析样式规则，然后构建出CSSOM树，表示页面的样式信息。CSSOM树描述了每个元素的计算样式，包括颜色、字体、大小等。

3. **合并DOM和CSSOM树**：浏览器将DOM树和CSSOM树合并成一个渲染树（Render Tree）。渲染树只包括需要呈现在页面上的元素，即已经应用样式的元素。这个过程被称为布局（Layout）或回流（Reflow）。

4. **计算布局**：浏览器计算每个元素在页面中的位置和大小，以确定它们在视口中的确切位置。这个过程会考虑元素的尺寸、边距、边框和定位属性。

5. **绘制（Painting）**：浏览器使用计算出的布局信息，将页面上的每个元素绘制到屏幕上。这个过程被称为绘制或栅格化。

6. **合成（Compositing）**：浏览器将不同图层的绘制结果合成到页面的最终图像中。这包括对透明度、层叠顺序和变换等效果的处理。

7. **渲染到屏幕**：最后，浏览器将最终的图像渲染到用户的屏幕上，显示在浏览器窗口中。

在渲染流程中，浏览器会尽力优化性能，例如通过异步加载资源、使用浏览器缓存、懒加载图片等手段来提高页面加载速度。此外，现代浏览器还支持硬件加速和并行处理，以加速渲染过程。这些优化措施旨在提供更流畅的用户体验。

### 谈谈你对浏览器架构的理解
浏览器是复杂的软件应用，其内部架构包含多个组件和层级，以便执行各种任务，从加载网页到呈现内容、处理用户输入和管理网络请求。以下是对浏览器架构的一般理解：

1. **用户界面（User Interface）**：这是浏览器的可见部分，包括地址栏、导航按钮、标签页、书签栏等。用户界面的目标是与用户互动，接受命令，提供反馈。

2. **浏览器引擎（Browser Engine）**：浏览器引擎负责解析HTML和CSS，构建DOM树和CSSOM树，然后将其渲染为用户可见的界面。最著名的浏览器引擎包括WebKit（用于Chrome和Safari）、Gecko（用于Firefox）、Trident（用于旧版IE）。

3. **渲染引擎（Rendering Engine）**：渲染引擎负责将DOM和CSSOM树渲染为可视化页面。它将文档解析成绘制命令，通过绘图API将内容显示在屏幕上。

4. **网络栈（Networking Stack）**：网络栈负责处理网络请求，包括HTTP请求、WebSocket连接等。它处理数据传输、处理Cookie、安全性等。

5. **JavaScript引擎（JavaScript Engine）**：JavaScript引擎负责解释和执行JavaScript代码。常见的JavaScript引擎包括V8（用于Chrome）、SpiderMonkey（用于Firefox）、JavaScriptCore（用于Safari）。

6. **布局引擎（Layout Engine）**：布局引擎负责计算文档元素的位置和大小，以便进行页面布局。WebKit引擎的WebCore包含了布局引擎。

7. **存储（Storage）**：浏览器存储组件负责处理本地存储，包括Cookie、Web存储、IndexedDB等。

8. **多进程架构**：现代浏览器通常采用多进程架构，将浏览器的不同部分放在独立的进程中，以提高性能和安全性。通常包括浏览器进程、渲染进程、GPU进程、插件进程等。

9. **插件系统**：浏览器允许第三方插件扩展其功能，例如Flash插件、广告拦截器、密码管理器等。

10. **开发者工具**：浏览器通常包括内置的开发者工具，用于调试和分析网页。

11. **安全性和隐私保护**：浏览器包括安全性特性，如Sandboxing、同源策略、跨站点请求伪造（CSRF）保护、HTTPS支持等，以确保用户的安全和隐私。

浏览器的架构是复杂的，其中不同的组件协同工作，以提供快速、可靠、安全的网页浏览体验。浏览器不断发展，采用了现代的Web标准，以满足用户和开发者的需求，同时保持性能和安全性。开发者需要了解浏览器架构的工作原理，以优化网页性能和确保跨浏览器兼容性。

### 大文件分块上传以及断点续传，你会怎么实现
实现大文件分块上传和断点续传通常需要以下步骤：

1. **文件分块**：将大文件分割成小块，每个小块的大小由你决定，通常为几兆字节。可以使用JavaScript的`File` API来读取文件内容并分割。

2. **上传分块**：逐个上传分块到服务器。你可以使用HTTP POST请求来上传每个分块，使用FormData对象将分块数据包装成表单数据。确保每个分块都有一个唯一的标识，以便服务器能够正确地组装它们。

3. **断点续传**：在上传分块时，服务器需要记录已经接收的分块，通常可以使用数据库或文件系统来存储已上传的分块信息。如果上传中断，下次继续上传时可以根据已上传的分块信息来确定从哪个分块开始。

4. **合并分块**：一旦所有分块都上传完毕，服务器将它们合并成完整的文件。你可以根据每个分块的标识来确定它们的顺序，并将它们按顺序合并成一个完整的文件。

5. **清理**：在文件上传完成后，你可以清理服务器上的临时分块和相关信息。

6. **前端进度条**：为了提供用户友好的界面，你可以在前端实现一个上传进度条，以显示文件上传的进度。

7. **错误处理**：在整个过程中需要处理可能出现的错误，例如网络问题、服务器问题、分块损坏等。确保有错误处理机制，可以中断上传并恢复。

8. **安全性**：考虑文件上传的安全性，确保只有授权用户可以上传文件，并验证文件类型和内容。

## 优化
### 图片懒加载和预加载
图片懒加载基本原理：

* 将页面上的图片的 src 属性设置为一个占位图或者一个空字符串，而将实际的图片路径存储在自定义属性（如 data-src）中。
* 使用 JavaScript 监听页面滚动事件，检测图片是否进入可视区域。
* 当图片进入可视区域时，通过 JavaScript 将 data-src 中的路径设置为 src，从而触发图片加载。
```html
<img data-src="image-to-lazy-load.jpg" src="placeholder.jpg" class="lazy-load-img">

<script>
document.addEventListener("DOMContentLoaded", function () {
  let lazyLoadImages = document.querySelectorAll('.lazy-load-img');
  
  function lazyLoad() {
    lazyLoadImages.forEach(function (img) {
      if (isInViewport(img)) {
        img.src = img.getAttribute('data-src');
        img.classList.remove('lazy-load-img');
      }
    });
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
  }

  window.addEventListener('scroll', lazyLoad);
  window.addEventListener('resize', lazyLoad);
  window.addEventListener('orientationchange', lazyLoad);

  // 初始加载
  lazyLoad();
});
</script>
```

图片预加载:
图片预加载是在页面加载时预先加载所有或部分图片，以确保在用户请求时可以立即显示这些图片，提高用户体验。
基本原理：
1. 创建一个 JavaScript 函数，该函数接受图片路径数组作为参数。
2. 在函数内部，使用 new Image() 创建新的图片对象，设置图片的 src 属性为要预加载的图片路径。
3. 监听图片的 load 事件，以确保图片加载完成。
4. 将加载完成的图片对象存储在一个数组中。
5. 当需要显示图片时，可以直接使用预加载的图片对象。
```js
function preloadImages(imagePaths, callback) {
  let loadedImages = [];
  let totalImages = imagePaths.length;

  function imageLoaded() {
    loadedImages.push(this);
    if (loadedImages.length === totalImages) {
      callback(loadedImages);
    }
  }

  for (let i = 0; i < totalImages; i++) {
    const image = new Image();
    image.src = imagePaths[i];
    image.onload = imageLoaded;
  }
}

// 用法
const imagePathsToPreload = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

preloadImages(imagePathsToPreload, function (loadedImages) {
  // 所有图片都已预加载完成，可以在此处使用 loadedImages
});
```

区别：
图片懒加载和图片预加载是两种不同的前端优化技巧，它们的主要区别在于它们的目的和实现方式：

**图片懒加载 (Lazy Loading)**:
1. **目的**：图片懒加载的目的是推迟加载页面上的图片，只有当用户滚动到可见区域时才加载图片，以减少初始页面加载时间。
2. **实现方式**：图片懒加载通过将图片的 `src` 属性设置为一个占位图或空字符串，而将实际的图片路径存储在自定义属性（如 `data-src`）中。然后，使用 JavaScript 监听滚动事件，当图片进入可视区域时，将 `data-src` 中的路径设置为 `src`，从而触发图片加载。

**图片预加载 (Image Preloading)**:
1. **目的**：图片预加载的目的是在页面加载时预先加载所有或部分图片，以确保在用户请求时可以立即显示这些图片，提高用户体验。
2. **实现方式**：图片预加载通过 JavaScript 创建新的图片对象，设置图片的 `src` 属性为要预加载的图片路径，并监听图片的 `load` 事件以确保图片加载完成。加载完成的图片对象存储在一个数组中。当需要显示图片时，可以直接使用预加载的图片对象。

总的来说，图片懒加载侧重于减少初始页面加载时间，特别适用于页面上包含大量图片的情况，以提高加载速度。图片预加载侧重于提前加载图片，以确保用户在请求图片时可以立即看到它们，提高用户体验。你可以根据项目需求和性能优化目标来选择使用其中一种或两种技巧。在某些情况下，两者也可以结合使用，以充分发挥它们的优势。

### 如何实现列表虚拟节点
在上面的示例中，我展示了一个基本的原理，如何实现一个简单的虚拟列表。下面是这个简单虚拟列表的工作原理：

1. **创建容器**: 我们创建一个容器 `div`，它具有固定的高度，并启用垂直滚动。这个容器将包含我们的虚拟列表。

2. **计算可见区域**: 当容器滚动时，我们捕获滚动事件，并计算可见区域的范围。我们跟踪容器的滚动位置（`scrollTop`），以及每个列表项的高度。

3. **计算可见列表项**: 根据可见区域的范围，我们计算出哪些列表项在可见范围内。这是通过将滚动位置除以每个列表项的高度来实现的。这给出了起始索引（`startIndex`）和结束索引（`endIndex`）。

4. **渲染可见列表项**: 我们只渲染位于可见范围内的列表项。这些列表项被包装在绝对定位的 `div` 中，其位置由其索引和列表项高度来计算。这样，只有可见的列表项被渲染到屏幕上，其余的列表项在视觉上是不可见的。

这个简单示例演示了虚拟化的基本原理，通过仅渲染可见的列表项，可以在处理大型列表时提高性能。在实际应用中，虚拟化库通常提供了更多的功能和性能优化，以满足更复杂的需求。这包括处理不同高度的列表项、缓存、键盘导航、滚动优化等。

>在这个示例中，我们创建了一个VirtualList组件，它会根据滚动位置来计算可见的列表项，并只渲染这些可见的列表项。

```js
import React, { Component } from 'react';

class VirtualList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleItems: [], // 存储可见的列表项
      startIndex: 0, // 可见列表项的起始索引
      endIndex: 10, // 可见列表项的结束索引
      itemHeight: 50, // 每个列表项的高度
    };
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.calculateVisibleItems();
    // 监听滚动事件
    this.containerRef.current.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // 移除滚动事件监听器
    this.containerRef.current.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.calculateVisibleItems();
  };

  calculateVisibleItems() {
    const container = this.containerRef.current;
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    const startIndex = Math.floor(scrollTop / this.state.itemHeight);
    const endIndex = Math.min(
      Math.ceil((scrollTop + containerHeight) / this.state.itemHeight),
      this.props.items.length
    );

    const visibleItems = this.props.items.slice(startIndex, endIndex);

    this.setState({
      startIndex,
      endIndex,
      visibleItems,
    });
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        style={{ height: '400px', overflowY: 'auto' }}
      >
        <div
          style={{
            height: this.props.items.length * this.state.itemHeight + 'px',
            position: 'relative',
          }}
        >
          {this.state.visibleItems.map((item, index) => (
            <div
              key={index}
              style={{
                height: this.state.itemHeight + 'px',
                position: 'absolute',
                top: (this.state.startIndex + index) * this.state.itemHeight + 'px',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default VirtualList;
```
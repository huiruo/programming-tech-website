## Chrome 浏览器使用什么引擎？
Chrome 浏览器使用的是 Blink 引擎。Blink 引擎是一个由 Google 开发的、基于 WebKit 引擎的分支。Google 于 2013 年宣布，将停止对 WebKit 引擎的开发，并开始在 Blink 引擎上进行开发。

Blink 引擎具有高效的渲染性能和丰富的功能支持，特别是在处理现代 Web 应用程序和移动端网页时表现出色。Blink 引擎在处理 JavaScript 代码时非常快速，这也是 Chrome 浏览器能够快速运行 JavaScript 代码的主要原因之一。

除了 Chrome 浏览器之外，Blink 引擎还被许多其他浏览器所采用，例如 Opera 浏览器、Microsoft Edge 浏览器等。Blink 引擎的开源代码托管在 GitHub 上，任何人都可以自由地查看、使用和贡献代码。

## Safari 
Webkit 引擎最初是苹果公司为其 Safari 浏览器开发的，而后谷歌公司将 WebKit 引擎的部分代码复制了一份并进行了修改，最终开发出了自己的 Blink 引擎。目前，Chrome 浏览器已经完全使用了 Blink 引擎

## 差别
### V8 引擎
其中最显著的差异是它们的 JavaScript 引擎不同。Safari 使用 JavaScriptCore 引擎，而 Chrome 使用 V8 引擎。V8 引擎的性能优于 JavaScriptCore 引擎，这也是 Chrome 浏览器能够快速运行 JavaScript 代码的重要原因之一。

Safari 和 Chrome 在用户界面、扩展支持、调试工具等方面也存在一些差异。例如，Safari 浏览器的调试工具是基于 WebKit 开发的，而 Chrome 浏览器的调试工具则是使用开发者工具协议（DevTools Protocol）实现的，两者的使用方法和特性都略有不同

### JavaScriptCore 引擎
Safari 使用的是 JavaScriptCore 引擎。JavaScriptCore 引擎是 WebKit 引擎中的一部分，是一款高性能的 JavaScript 引擎，它在处理 JavaScript 代码时表现出色，能够快速地解释和执行 JavaScript 代码。

JavaScriptCore 引擎采用了许多先进的编译技术，包括即时编译（JIT）等，可以在执行 JavaScript 代码时进行动态优化，从而提高性能。
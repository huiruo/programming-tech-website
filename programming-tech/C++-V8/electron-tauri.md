## Electron 主进程和渲染线程
在 Electron 应用中，主进程是 Electron 应用的入口点，它是由 Node.js 的 electron 模块启动的一个 Node.js 进程。主进程负责管理应用的生命周期、处理系统事件、创建和管理渲染进程等任务。

渲染进程是指 Electron 应用中的浏览器窗口所使用的进程，每个渲染进程都运行在自己的沙箱环境中，负责渲染窗口的界面和处理与界面相关的任务。每个渲染进程都有一个独立的 JavaScript 上下文，它们之间可以通过 IPC 通信来传递数据和消息。

主进程和渲染进程之间可以通过 IPC（进程间通信）来进行通信。Electron 提供了 ipcMain 和 ipcRenderer 两个模块分别用于在主进程和渲染进程之间建立 IPC 通信管道。通过 IPC，主进程和渲染进程之间可以传递消息、调用方法、共享数据等。

需要注意的是，由于 Electron 应用中的渲染进程运行在沙箱环境中，它们不能直接访问 Node.js 模块和原生模块，必须通过 remote 模块或自定义的 IPC 协议来访问主进程中的方法和数据。在主进程中可以通过 BrowserWindow 对象的 webContents 属性来获取渲染进程的 webContents 对象，从而建立 IPC 通信管道。

## 在 Electron 中创建多线程的基本步骤如下：
在主进程中使用 webContents 对象创建一个新的渲染进程，即一个新的 BrowserWindow 对象。
在渲染进程中使用 Node.js 的 worker_threads 模块创建一个新的 Worker 对象。

在主进程和渲染进程之间建立 IPC 通信管道，使用 webContents.send 方法将消息发送给渲染进程，使用 worker.postMessage 方法将消息发送给 Worker 线程。

在渲染进程中监听 message 事件，并在事件回调中使用 worker.postMessage 方法将消息发送给 Worker 线程。在 Worker 线程中监听 message 事件，并在事件回调中处理消息。

在渲染进程中使用 remote 模块调用主进程中的方法，将数据传递给主进程进行处理。在主进程中使用 ipcMain 模块监听渲染进程发送的消息，处理数据并返回结果。

## Tauri
## App 后端应该是 Tauri 缺陷之一（但或者是最大的优势，这取决于你）
在 Electron app 中，你用 Javascript 编写代码，因为 Electron 使用 Nodejs 的 runtime。而 Tauri 的后端是基于 Rust 实现的，如果开发 app 后端的你精通 Rust ，你会乐此不疲，但是如果你不得不从头学习 Rust

## web的渲染
Electron 底层使用 Chromium，所以你在 Windows、linux、macos 上看到的前端效果都是一样的

而Tauri 使用的系统自带的 webview：windows 上 Edge webview2，linux 和 macos 上的 webkitGTK。

Safari（基于 Webkit）一直落所有的 web 浏览器一步所以，就会存在一些 bug，就是你在 chrome 上不能看到，能够在 Safari 用户上看到。

在 Tauri 上，你只能引入 polyfills。所以此项的胜者是 Electron。

Tauri 应用时碰到的一个问题就css 打包不会携带 -webkit 前缀，导致css 全是 bug。

## 自动更新
Electron 和 Tauri 都有内置的自动更新器，在 Electron 中，使用electron-updater;但是 Tauri 更加简单
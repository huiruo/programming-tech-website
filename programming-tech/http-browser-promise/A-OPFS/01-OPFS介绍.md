## 新的Origin Private File System API (OPFS) 提供了一个快速、特定于源的虚拟文件系统
```
Origin Private File System (OPFS)
是一个提供了快速、安全的本地文件系统访问能力的 Web API。它允许Web应用以原生的方式读取和写入本地文件，而无需将文件直接暴露给Web环境。OPFS通过在浏览器中运行一个本地代理和使用特定的文件系统路径来实现文件的安全访问。
```

```js
const opfsRoot = await navigator.storage.getDirectory();

// 使用 OPFS 可以快速创建、读取、写入和删除文件。例如：
// 创建文件
const file = await opfsRoot.getFileHandle('image.psd', { create: true });
 
// 获取读写句柄
const handle = await file.createSyncAccessHandle();
 
// 写入内容
handle.write(buffer);
 
// 读取内容
handle.read(buffer);
 
// 删除文件
await file.remove();
```
为了实现绝对快的同步操作，可以利用Web Workers获取 FileSystemSyncAccessHandle。

这个本地高性能文件系统在浏览器中实现Photoshop所需的高要求文件工作流程非常关键。它能够提供快速而可靠的文件读写能力，使得Photoshop能够更高效地处理大型文件。这种优化的文件系统为用户带来更流畅的图像编辑和处理体验。

### docs
什么是 OPFS?

https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system

https://web.dev/articles/origin-private-file-system

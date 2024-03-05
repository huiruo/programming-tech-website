WebAssembly是重新在JavaScript中实现Photoshop计算密集型图形处理的关键因素之一。为了将现有的 C/C++ 代码库移植到 JavaScript 中，Adobe使用了Emscripten编译器生成WebAssembly模块代码。

在此过程中，WebAssembly具备了几个至关重要的能力：
* SIMD：使用SIMD向量指令可以加速像素操作和滤波。

* 异常处理：Photoshop的代码库中广泛使用C++异常。

* 流式实例化：由于Photoshop的WASM模块大小超过80MB，因此需要进行流式编译。

* 调试：Chrome浏览器在DevTools中提供的WebAssembly调试支持是非常有用的

* 线程：Photoshop使用工作线程进行并行执行任务，例如处理图像块：
```js
// 线程函数
void* tileProcessor(void* data) {
 
    // 处理图像块数据
    return NULL;
}
 
 
 
// 启动工作线程
pthread_t thread1, thread2;
 
pthread_create(&thread1, NULL, tileProcessor, NULL);
 
pthread_create(&thread2, NULL, tileProcessor, NULL);
 
 
 
// 等待线程结束
pthread_join(thread1, NULL);
 
pthread_join(thread2, NULL);
```

## 流式编译和缓存大型WebAssembly模块
Photoshop的代码库需要多个大型的WebAssembly模块，其中一些大小超过80MB。V8和Chrome中的流式编译支持高效处理这些庞大的模块。

此外，当第一次从 Service Worker 请求 WebAssembly 模块时，V8会生成并存储一个优化版本以供缓存使用，这对于 Photoshop 庞大的代码尺寸至关重要。

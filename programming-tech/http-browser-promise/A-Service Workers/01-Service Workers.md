Service Workers 可以让 Web 应用在用户首次访问后将其代码和资源等缓存到本地，以便在后续加载时可以更快地呈现。尽管 Photoshop 目前还不支持完全离线使用，但它已经利用了 Service Workers 来缓存其 WebAssembly 模块、脚本和其他资源，以提高加载速度。

Chrome DevTools Application 面板 > Cache storage 展示了 Photoshop 预缓存的不同类型资源，包括在Web上进行代码拆分后本地缓存的许多JavaScript代码块。这些被本地缓存的JavaScript代码块使得后续的加载非常快速。这种缓存机制对于加载性能有着巨大的影响。在第一次访问之后，后续的加载通常非常快速。

[ps-缓存](../../assets/img-others/ps-tech1.png)


Adobe 使用了 `Workbox`` 库，以更轻松地将 Service Worker 缓存集成到构建过程中。

当资源从Service Worker缓存中返回时，V8引擎使用一些优化策略：
* 安装期间缓存的资源会被立即进行编译，并立即进行代码缓存，以实现一致且快速的性能表现。
* 通过Cache API 进行缓存的资源，在第二次加载时会经过优化的缓存处理，比普通缓存更快速。
* V8能够根据资源的缓存重要性进行更积极的编译优化。

这些优化措施使得 Photoshop 庞大的缓存 WebAssembly 模块能够获得更高的性能。
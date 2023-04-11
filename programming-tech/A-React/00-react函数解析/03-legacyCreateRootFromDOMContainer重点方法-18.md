## legacyCreateRootFromDOMContainer
1. 将root赋值给container._reactRootContainer,取出 root 中的_internalRoot 作为 fiberRoot。
```js
var _root = createContainer(container, LegacyRoot, null, // hydrationCallbacks
  false, // isStrictMode
  false, // concurrentUpdatesByDefaultOverride,
  '', // identifierPrefix
  noopOnRecoverableError);

// 添加属性 此时 maybeRoot 才会有值
container._reactRootContainer = _root;
```

2. 调用 updateContainer(children,fiberRoot,parentComponent,callBack)。
```
开始渲染工作
```

### 源码
```js
function legacyCreateRootFromDOMContainer(container, initialChildren, parentComponent, callback, isHydrationContainer) {
  if (isHydrationContainer) {
    console.log('-->1-a:初始化渲染')
    if (typeof callback === 'function') {
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(root);
        originalCallback.call(instance);
      };
    }

    var root = createHydrationContainer(initialChildren, callback, container, LegacyRoot, null, false, false, '', noopOnRecoverableError);

    container._reactRootContainer = root;
    markContainerAsRoot(root.current, container);
    var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
    flushSync();
    return root;
  } else {
    console.log('-->0-a:初始化渲染')
    // First clear any existing content.
    var rootSibling;

    while (rootSibling = container.lastChild) {
      container.removeChild(rootSibling);
    }

    if (typeof callback === 'function') {
      var _originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(_root);

        _originalCallback.call(instance);
      };
    }

    var _root = createContainer(container, LegacyRoot, null, // hydrationCallbacks
      false, // isStrictMode
      false, // concurrentUpdatesByDefaultOverride,
      '', // identifierPrefix
      noopOnRecoverableError);

    // 添加属性 此时 maybeRoot 才会有值
    container._reactRootContainer = _root;
    // 标记
    markContainerAsRoot(_root.current, container);
    // container
    var _rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;

    listenToAllSupportedEvents(_rootContainerElement); // Initial mount should not be batched.

    console.log('-->0-a,初始化渲染不执行批量更新',)
    flushSync(function () {
      updateContainer(initialChildren, _root, parentComponent, callback);
    });
    return _root;
  }
}
```
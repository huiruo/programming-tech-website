在 Create React App (CRA) 中，useEffect 函数的执行两次是一个常见的现象。这通常是由于 CRA 使用了 React Strict Mode 的特性造成的。

React Strict Mode 是一种开发模式，旨在帮助开发者发现应用程序中潜在的问题。在 Strict Mode 下，React 会对某些操作进行额外的检查和警告。其中之一是在开发过程中对 useEffect 函数的调用进行了双重渲染。

当应用程序运行在 Strict Mode 下时，React 会在初始渲染和重新渲染阶段分别运行两次 useEffect。这是为了检测可能导致副作用问题的代码，并在开发过程中提前发现并修复它们。

因此，你观察到 useEffect 函数执行两次的情况是因为你的应用程序正在运行在 React Strict Mode 下。

请注意，这种双重渲染只发生在开发模式下，而不会影响生产环境中的代码。在生产环境中，useEffect 函数只会执行一次。

如果你不想在开发过程中观察到 useEffect 的双重渲染，你可以在组件的根元素上删除 React.StrictMode 组件包装。但请注意，这样做可能会导致潜在的问题在生产环境中未被发现。

希望这解答了你的疑问！如果你还有其他问题，请随时提问。
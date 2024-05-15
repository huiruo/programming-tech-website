1. 使用 TypeScript 官方提供的 Playground 工具。它不仅可以帮助您将 TypeScript 转换成 ES6 JavaScript，还提供了实时编辑和代码执行功能。您只需要在左侧的编辑器中输入 TypeScript 代码，然后单击右侧的“JS”按钮，就可以将 TypeScript 代码转换成 ES6 JavaScript 代码了

[test](www.typescriptlang.org/play)

2. 使用在线转换工具，例如 TypeScript 编辑器，并自动将其转换成 ES6 JavaScript 代码。
[test](www.typescriptlang.org/play#code/)

3. 在本地使用 TypeScript 的编译器 tsc，可以将 TypeScript 代码编译成 JavaScript 代码。您需要在终端中执行以下命令：
```
tsc --target es6 example.ts
```
这会将 example.ts 文件编译成 ES6 JavaScript 文件 example.js。
## 在nestjs 中 使用 typescript 在线编译代码 `console.log('tsTranspile', ts); `为undefined 怎没解决？
```ts
import ts from 'typescript'

export function tsTranspile(input: string) {
  console.log('tsTranspile', ts);

  return ts.transpile(input, {
    lib: ['dom', 'esnext'],
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
    composite: false,
    declaration: true,
    declarationMap: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    inlineSources: false,
    sourceMap: true,
    allowJs: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    strictPropertyInitialization: false,
    noImplicitReturns: true,
    preserveWatchOutput: true,
    skipDefaultLibCheck: true,
    skipLibCheck: true,
    strict: true,
  })
}
```

### 在 TypeScript 中，导入方式-方法1
```
import ts from 'typescript' 和 import * as ts from 'typescript' 有着不同的语义，尤其是在与 CommonJS 模块的互操作时。
```

这种区别导致了你在导入 TypeScript 模块时遇到 undefined 的问题。

```
import * as ts from 'typescript':

这种方式是 TypeScript 建议的导入 CommonJS 模块的方法。
它将整个模块作为一个对象导入，所以你可以访问到模块的所有导出成员。

在使用 import * as ts from 'typescript' 时，ts 是一个对象，包含 typescript 模块的所有导出内容。
```

### 方法2
```
import ts from 'typescript':

这种方式是 ES6 模块的默认导入语法。
但是 typescript 是一个 CommonJS 模块，它并没有使用 export default，因此默认导入语法不会正常工作，导致 ts 变为 undefined。
```

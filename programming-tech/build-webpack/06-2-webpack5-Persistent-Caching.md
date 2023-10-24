---
title: webpack5-Persistent-Caching
sidebar_position: 1
---

## 持久化缓存的示例
https://webpack.docschina.org/configuration/cache/

```js
// ./webpack.cache.config.js
...
module.exports = {
  ...
  cache: {

    type: 'filesystem', // 使用文件缓存

    cacheLocation: path.resolve(__dirname, '.appcache'),

    buildDependencies: {

      config: [__filename], // 是将哪些文件 or 目录作为 buildDependencies 如果文件发生改变，则缓存失效

    },

  },
  ...
}
```

可以看到，初次构建完整花费了 3282ms，而在不修改代码进行再次构建的情况下，只花费了不到原先时间的 1/10。在修改代码文件的新情况下也只花费了 628ms，多花费的时间体现在构建被修改的文件的编译上，这就实现了上一课时所寻求的生产环境下的增量构建。

## Cache 基本配置
在 Webpack 4 中，cache 只是单个属性的配置，所对应的赋值为 true 或 false，用来代表是否启用缓存，或者赋值为对象来表示在构建中使用的缓存对象。而在 Webpack 5 中，cache 配置除了原本的 true 和 false 外，还增加了许多子配置项，例如：
* cache.type：缓存类型。值为 'memory'或‘filesystem’，分别代表基于内存的临时缓存，以及基于文件系统的持久化缓存。在选择 filesystem 的情况下，下面介绍的其他属性生效。
* cache.cacheDirectory：缓存目录。默认目录为 node_modules/.cache/webpack。
* cache.name：缓存名称。同时也是 cacheDirectory 中的子目录命名，默认值为 Webpack 的 ${config.name}-${config.mode}。
* cache.cacheLocation：缓存真正的存放地址。默认使用的是上述两个属性的组合：path.resolve(cache.cacheDirectory, cache.name)。该属性在赋值情况下将忽略上面的 cacheDirectory 和 name 属性。


## 单个模块的缓存失效
Webpack 5 会跟踪每个模块的依赖项：fileDependencies、contextDependencies、missingDependencies。当模块本身或其依赖项发生变更时，Webpack 能找到所有受影响的模块，并重新进行构建处理。

这里需要注意的是，对于 node_modules 中的第三方依赖包中的模块，出于性能考虑，Webpack 不会跟踪具体模块文件的内容和修改时间，而是依据依赖包里package.json 的 name 和 version 字段来判断模块是否发生变更。因此，单纯修改 node_modules 中的模块内容，在构建时不会触发缓存的失效。

## 全局的缓存失效
当模块代码没有发生变化，但是构建处理过程本身发生变化时（例如升级了 Webpack 版本、修改了配置文件、改变了环境变量等），也可能对构建后的产物代码产生影响。因此在这种情况下不能复用之前缓存的数据，而需要让全局缓存失效，重新构建并生成新的缓存。在 Webpack 5 中共提供了 3 种不同维度的全局缓存失效配置。

* buildDependencies
第一种配置是cache.buildDependencies，用于指定可能对构建过程产生影响的依赖项。
```
它的默认选项是{defaultWebpack: ["webpack/lib"]}。这一选项的含义是，当 node_modules 中的 Webpack 或 Webpack 的依赖项（例如 watchpack 等）发生变化时，当前的构建缓存即失效。

配置文件中的 buildDependencies 还支持增加另一种选项 {config: [__filename]}，它的作用是当配置文件内容或配置文件依赖的模块文件发生变化时，当前的构建缓存即失效。
```
* version
第二种配置是 cache.version。当配置文件和代码都没有发生变化，但是构建的外部依赖（如环境变量）发生变化时，预期的构建产物代码也可能不同。这时就可以使用 version 配置来防止在外部依赖不同的情况下混用了相同的缓存。例如，可以传入 cache: {version: process.env.NODE_ENV}，达到当不同环境切换时彼此不共用缓存的效果。

* name
缓存的名称除了作为默认的缓存目录下的子目录名称外，也起到区分缓存数据的作用。例如，可以传入 cache: {name: process.env.NODE_ENV}。这里有两点需要补充说明：
```
name 的特殊性：与 version 或 buildDependencies 等配置不同，name 在默认情况下是作为缓存的子目录名称存在的，因此可以利用 name保留多套缓存。在 name 切换时，若已存在同名称的缓存，则可以复用之前的缓存。与之相比，当其他全局配置发生变化时，会直接将之前的缓存失效，即使切换回之前已缓存过的设置，也会当作无缓存处理。

当 cacheLocation 配置存在时，将忽略 name 的缓存目录功能，上述多套缓存复用的功能也将失效。
```




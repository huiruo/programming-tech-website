
```
1、查看一下当前源
yarn config get registry
https://registry.yarnpkg.com
2、切换为淘宝源

yarn config set registry https://registry.npm.taobao.org

3、或者切换为自带的
yarn config set registry https://registry.yarnpkg.com
```

```
npm config set registry http://registry.npm.taobao.org/

npm config set registry https://registry.npmjs.org/
```

## 遇到依赖问题
一、首先要以管理员模式打开cmd清除你的npm缓存 : npm cache clean -f

二、清除完缓存后，安装最新版本的Node helper： npm install -g n 

注意：如果出现npm ERR! notsup Unsupported platform for n@2.1.8: wanted {"os":"!win32","arch":"any"} (current: {"os":"win32","arch":"x64"})
然后执行以下    npm install -g n --force


## npm
npm i --save @nestjs/serve-static
npm i -g cnpm
npm i -g yarn
npm i -g umi
```
1.npm install
会下载dependencies和devDependencies中的模块，当使用npm install –production或者注明NODE_ENV变量值为production时，只会下载dependencies中的模块。

npm install 单个模块：安装到node_modules目录中，但不会保存在package.json 中。之后运行npm install命令时，不会自动安装该模块。

2.npm install --save

安装到node_modules目录中，保存在package.json中dependencies字段下，安装生产环境依赖的模块，即项目运行时的模块，例如react，react-dom,jQuery等类库或者框架。运行npm install，或者npm install --production或者注明NODE_ENV变量值为production时时，会将这些模块自动安装到node_modules中。

2.npm install --save-dev

安装到node_modules目录中，保存在package.json中devDependencies字段下，安装开发环境依赖的模块，即项目开发时的模块，例如babel（转码器，可以将ES6代码转为ES5代码）等一些工具，只需在开发环境是用到。运行npm install，会将这些模块自动安装到node_modules中，但运行npm install --production或者注明NODE_ENV变量值为production时时，不会将这些模块自动安装到node_modules中。
```

## yarn 卸载 安装等
```
yarn安装依赖

yarn add 包名          // 局部安装
yarn global add 包名   // 全局安装
yarn 卸载依赖

yarn remove 包名         // 局部卸载
yarn global remove 包名  // 全局卸载（如果安装时安到了全局，那么卸载就要对应卸载全局的）
```

```
yarn remove react-router
yarn remove react-router-dom
yarn remove @types/react-router-dom

yarn remove @types/react-datepicker

yarn add react-router
yarn add react-router-dom
yarn add @types/react-router-dom

yarn add @types/lodash
```

## 2).生产环境
```
yarn add 包名          // 局部安装
这将安装您的dependencies中的一个或多个包。

yarn add <packageName> --dev 依赖会记录在 package.json 的 devDependencies 下 生产环境

yarn add webpack --dev # yarn 简写 -D

npm install webpack --save-dev # npm

```

## yarn 清除缓存
```
yarn cache clean
```


## 遇到依赖问题
Command: node-pre-gyp install --fallback-to-build
```
npm install -g node-gyp
```

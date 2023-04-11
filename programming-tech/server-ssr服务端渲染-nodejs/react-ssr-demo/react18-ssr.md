##### 2、配置webpck.config.js文件
```js
const path = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
};
```

##### 3、配置编译命令

```json
"scripts": {"build": "webpack"}
```

#### 五、水合（hydrateRoot）

+ 水合是指其他物质溶于水发生化学反应
+ 此处水合是指后端数据达到前端后，js绑定事件，才能够响应用户的操作或者DOM的更新。
+ 工作流程（将事件比作水）
  - 组件在服务器拉取数据，并在服务端首次渲染。
  - 脱水，对组件进行脱水，变成HTML字符串，脱去交互事件，成为风干标本快照。
  - 注水，发送到客户端后，重新注入数据（交互的事件），重新变成可交互组件。

此过程类似于银耳，长成后晒干，然后加入水再泡发。


##### 3、项目代码

```js
import React from "react";
import App from "./page/App/index.jsx";
import { hydrateRoot } from "react-dom/client";

const root = document.getElementById("root");
const element = <App />
hydrateRoot(root, element);
```

+ service.js文件

```js
const express = require("express");
const register = require("@babel/register");
register({
  ignore: [/node_modules/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
});
const static = require('serve-static');
const webpack = require("webpack");
const render = require("./oldRender");
const webpackConfig = require("./webpack.config");

webpack(webpackConfig, (error, status) => {
  const statusJson = status.toJson({ assets: true });
  const assets = statusJson.assets.reduce((item, { name }) => {
    item[name] = `/${name}`;
    return item;
  }, {});
  console.log(assets, 'assets')
  const app = express();
  app.get("/", (req, res) => {
    render(req, res, assets);
  });
  app.use(static('build'));
  app.listen(8100, () => {
    console.log("运行在8100端口");
  });
});

```

+ render函数代码

```js
import React from "react";
import App from "./src/page/App";
import { renderToString } from "react-dom/server";

function render(req, res, assets) {
  const html = renderToString(<App />);
  res.statusCode = "200";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ssr</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script src="${assets["main.js"]}"></script>
    </body>
    </html>`
  );
}

module.exports = render;
```

**注意： 由于render函数中即使用了commonjs，又使用了es的代码，所以，servicejs文件中使用了@babel/register插件进行转换，将es转换成commonjs进行执行。**

#### 七、react18的ssr

##### 1、特性

+ 选择性水合，可以在局部进行水合。
+ 像流水一样，打造一个从服务端到客户端的持续不断的渲染管线。而不是renderToString那样一次性渲染。

+ 服务端渲染把简单的res.send改为```res.socket```这样就把一次渲染转变为持续性行为。
+ 打破了以前串行的限制，优化前端的加载速度和可交互所需等待时间。
+ 服务器端的流式HTML使用 ```renderToPipeableStream``` 
+ 客户端的水合使用 hydrateRoot ，需要调用接口组件使用```<Suspense/>```包裹。

+ 需要请求的组件会先返回一个```<template></template>```占位，然后再替换。

##### 2、新版ssr代码：（加上react-router@6版本）

+ service.js文件不变，render函数做出如下修改：

```js
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import AppPage from "./src/page/AppPage/index.jsx";
import { StaticRouter } from "react-router-dom/server";

function newRender(req, res, assets) {
  const { pipe } = renderToPipeableStream(
    <StaticRouter location={req.url}>
      <AppPage />
    </StaticRouter>,
    {
      bootstrapScripts: [assets["main.js"]],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ssr</title>
      </head>
      <body>
        <div id="root">`);
        pipe(res);
        res.write(`</div>
    </body>
    </html>`);
      },
    }
  );
}

module.exports = newRender;
```

+ 客户端index.js修改如下：

```js
import React from "react";
import AppPage from "./src/page/AppPage/index.jsx";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");
const element = (
  <BrowserRouter>
    <AppPage />
  </BrowserRouter>
);
hydrateRoot(root, element);
```

+ AppPage文件如下

```jsx
import React, { Suspense } from "react";
import NavList from "../NavList/index.jsx";
import routerConfig from "../../route/index.js";
import { useRoutes } from "react-router-dom";

export default function AppPage() {
  return (
    <div>
      <NavList />
      <Suspense fallback={<div>加载中。。。</div>}>
        {useRoutes(routerConfig)}
      </Suspense>
    </div>
  );
}
```

+ routerConfig文件如下

```js
import React from "react";
import Header from "../page/Header/index.jsx";
import Footer from "../page/Footer/index.jsx";
import User from "../page/User/index.jsx";
const routerConfig = [
  {
    path: "/",
    element: <Header />,
    index: true,
  },
  {
    path: "/footer",
    element: <Footer />,
  },
  {
    path: "/user",
    element: <User />,
  },
];

export default routerConfig;
```

+ NavList组件如下：

```js
import React, { startTransition } from "react";
import { useNavigate } from "react-router-dom";

export default function NavList() {
  const navigate = useNavigate();
  function handleHistory(url) {
    startTransition(() => {
      navigate(url);
    });
  }
  return (
    <ul>
      <li onClick={() => handleHistory("/")}>主页</li>
      <li onClick={() => handleHistory("/footer")}>底部</li>
      <li onClick={() => handleHistory("/user")}>用户页</li>
    </ul>
  );
}

```

**注意： 此处没有使用Link，原因是由于如果跳转过于频繁，Suspense中内容还没有渲染结束，会导致报错。需要使用startTransition来降低优先级。**

#### 八、useId

+ 客户端和服务端保持一致的id

#### 九、项目搭建附录

##### 1、安装插件

```bash
npm install @babel/core @babel/preset-env  @babel/preset-react babel-loader express react-router-dom webpack webpack-cli @babel/plugin-transform-modules-commonjs @babel/register cross-env nodemon react react-dom @babel/plugin-transform-runtime --save
```

##### 2、webpack.config.js

```js
const path = require("path");

module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: "./index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
};
```


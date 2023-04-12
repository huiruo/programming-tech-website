---
title: monorepo
sidebar_position: 2
---

在一般的开发模式中，通常都是一个项目用一个仓库进行管理，假如今天要设计一个内容管理系统的产品，一般来说会提供以下两种服务。

后台管理系统。
前台页面(H5)。
这时候按照以往的开发方式，我们会创立两个仓库分别去管理这两个网站，这种项目架构的设计方式称之为：Multi-repo。

反之，当我们把这两个网站都用一个 仓库 进行管理，这种做法就是 Monorepo。


## 概念
monorepo:monolithic repository是一种项目架构，简单的来说：一个仓库内包含多个开发项目（模块，包）

在 Monorepo 项目中你可以同时管理多个逻辑共存的应用程序，比如桌面应用程序和 Web 应用程序

对于monorepo的优点以及发展历史可以参考精读《Monorepo 的优势》。总结一下：
* 各模块独立方便管理（对于element来说，修改表单只需要修改packages下的form目录）结构清晰（模块独立之后，结构自然清晰）
* 缺点就是仓库代码体积可能比较大（一个仓库包含多个项目，项目多了，体积自然会大）

## Monorepo 的优势
* 管理一些共用的组件，甚至是共用的 utils，这样就不用很麻烦的在两个项目上进行 ctr c + v，通常在 Monorepo 上会用以下的项目架构进行设计。

* 抽离多个重复配置文件: 将多个应用程序抽离到一个代码仓库中管理，无疑针对于繁琐且重复的配置文件与环境，我们可以仅仅贡献一份配置文件，然后利用该配置来构建所有的包。 
```
apps
  |- 后台网站
  |- 前台网站
node_modules
packages
  |- components
  |- utils
```
在 apps 的文件中，我们会放置真正会被执行的项目，假如日后这个项目是有机会要被 build 成 docker image 的话，这时候就可以根据 apps 文件中的项目产出相对应的 docker image，以上述的例子来看就是会产生出 后台网站 以及 前台网站 这两个 image。

* 轻松的拉取所有最新的代码: 此时由于 Monorepo 的解决方案，解决了多个远程仓库的问题。在拉去代码时，通常我们仅仅需要一个简单的拉取请求即会拉取到所有最新的所有代码内容。 

* 更加简单的 NPM 发布: 上边我们谈到过，基于多个依赖包之间版本管理的问题。基于 Monorepo 的解决方案我们可以利用一些比如 Lerna、Yarn Workspaces  等工具更加自动化的处理依赖包之间的构建和发布。 

* 更容易的依赖管理: 我们可以提升多个项目中相同的依赖在项目的根依赖中进行管理，这意味这这会大大的缩小项目依赖在硬盘上占据的空间。 

* 更好的逻辑复用方案: 基于 Monorepo 的解决方案，我们在独立出不同应用之间逻辑的同时可以基于包之间可以更加清晰的在模块之间复用其他模块。量，尽管可以使用解决重文件问题），性能也会降低吉特 LFS）。

## Package Manager
在 packages 的文件中，我们就可以放置各种需要被共用的组件或者是 utils，在这边开发的共用内容就可以同时被 apps 文件内的项目使用，这样的架构设计也可以让代码写起来相当干净。


在 Monorepo 的世界中一个 仓库 底下会有很多个项目，每个项目都会有自己的 package，假如没有一个好的 package manager 来管理这些 package 的话，最后就会让整个 仓库 很难被控制，因此接下来要花一点篇幅来稍微阐述一下 package manager 的用法。

以前端来说比较著名的 package manager 有以下几个：
```
npm
Yarn
pnpm
Rush
```

通常 package manager 只负责用来处理依赖的安装，然而在 Monorepo 的架构中，我们通常都会有好几个项目在同一个文件中，这时候就必须要使用 package manager 的一个重要观念：workspaces。

workspaces 简单来说就是可以方便让你一键安装所有的依赖至 workspaces 所管理的目录内，或者是方便你安装依赖在 workspaces 所管理的目录。

## 使用
workspaces要配置packages/*，使用yarn install的时候，yarn会将package的所有包设置软连接到node_modules，这样就使用了各个模块的互相通信。通常会设置一个公共模块，一些公共方法放入此包，其他各个包独立
```
{
  "private": "true",
  "name": "monorepo-stu",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ]
}
```
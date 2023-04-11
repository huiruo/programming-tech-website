## 前言
```
对于维护过多个package的同学来说，都会遇到一个选择：

这些package是放在一个仓库里维护还是放在多个仓库里单独维护，数量较少的时候，多个仓库维护不会有太大问题，但是当package数量逐渐增多时，一些问题逐渐暴露出来：

package之间相互依赖，开发人员需要在本地手动执行npm link，维护版本号的更替；

issue难以统一追踪，管理，因为其分散在独立的repo里；

每一个package都包含独立的node_modules，而且大部分都包含babel,webpack等开发时依赖，安装耗时冗余并且占用过多空间。
```

## Monorepo vs Multirepo
```
Monorepo 的全称是 monolithic repository，即单体式仓库

Multirepo (multiple repository)，这里的“单”和“多”是指每个仓库中所管理的模块数量。
```

## a.
```
Multirepo 是比较传统的做法，即每一个模块都单独用一个仓库来进行管理，典型案例有 webpack，优缺点总结如下

优点：
各模块管理自由度较高，可自行选择构建工具，依赖管理，单元测试等配套设施
各模块仓库体积一般不会太大

缺点：
issue 管理混乱，在实际使用中会发现 core repo 中经常会出现对一些针对 module 提出的问题，需要做 issue 迁移或关联
changlog 无法关联，无法很好的自动关联各个 module 与 core repo 之间的变动联系
版本更新繁琐，如果 core repo 的版本发生了变化，需要对所有的 module 进行依赖 core repo 的更新
测试复杂，对多个相关联 module 测试繁琐
```

## b.
```
Monorep 是把所有相关的 module 都放在一个仓库里进行管理，每个 module 独立发布，典型案例有 babel，优缺点总结如下：

优点：
管理简便，issue 和 PR 都放在一个仓库中进行维护
changelog 维护简便，所有changelog 都基于同一份 commit 列表
版本更新简便，core repo 以及各模块版本发生变更后可以很简便的同步更新其余所有对其有依赖的 module

缺点：
仓库体积增长迅速，随着 module 的增多，仓库的体积会变得十分庞大
自由度较低，高度的统一导致各个模块的自由度较低，且对统一的配套工具（构建，测试）等要求较高，要能适配各个 module 的要求
```

---
title: TypeORM和Prisma
sidebar_position: 1
---

TypeORM和Prisma
## Prisma
/prizma/

Prisma 的主要目的是使应用程序开发人员在与数据库打交道时能够更加高效

只需维护一份schema.prisma文件，每次数据库变更执行一个指令，就会完成数据库的更新，并且生成一组migration文件，包括本次的变更后的数据库版本，及变更之处。

```
独特的Schema定义方式、

比TypeORM更加严谨全面的TS类型定义（尤其是在级联关系中）、

更容易上手和更贴近原生SQL的各种操作符等


Prisma 通过提供一个干净（clean）和类型安全（type-safe）的 API 来提交数据库查询，同时返回一个普通 JavaScript 对象（plain old JavaScript object），来使得开发者能够更容易地进行数据库查询

提供VS Code编辑器扩展插件、语法高亮、智能自动补全

Prisma 是 TypeScript 生态中唯一一个 彻底 的类型安全 ORM
```

## typeOrm
亮点在基于装饰器语法声明表结构、事务、级联等，以及很棒的TS支持
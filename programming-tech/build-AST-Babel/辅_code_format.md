---
title: code format
sidebar_position: 102
---

## 如何使 vscode 生效
.prettierrc.js
```text
module.exports = {
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  useTabs: false, // 启用tab取代空格符缩进，默认为false
  semi: true, // 行尾是否使用分号，默认为true
  singleQuote: true, // 字符串是否使用单引号，默认为false，设true，即单引号
  quoteProps: 'as-needed', // 给对象里的属性名是否要加上引号，默认为as-needed，即根据需要决定，如果不加引号会报错则加，否则不加
  trailingComma: 'es5', // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  jsxSingleQuote: true, // 在jsx里是否使用单引号，true 表示使用单引号
  trailingComma: 'es5', // 每个键值对后面是否一定有尾随逗号，默认es5，保持默认即可
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
}

// 这样配置完后，如果保存还是不能格式化，可能是vscode的默认formatter不是prettier。
// 这时候可以按CTRL + SHIFT + P,输入format然后选择Format Document，
// 点击弹出框的按钮configure,然后选择pretter.
```

## 如果想要配置 eslint 格式化
```
在VSCODE的User/setting.json文件中有如下配置
"editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
 },
表示保存文件这个行为触发的是eslint的规则
再看执行命令Format Document触发的规则，我们先右键选择Format Document With...来查看默认用的是哪个格式化工具，如图所示，可以看到默认用的是Prettier，到这里就很清晰了，Prettier的配置如果和eslint的配置不一样，那么执行Format Document就肯定和执行

再看执行命令Format Document触发的规则，我们先右键选择Format Document With...来查看默认用的是哪个格式化工具,Prettier的配置如果和eslint的配置不一样

```

```text
1.3 创建 .prettierignore 文件内容如下：
build
coverage
```

## vscode 中的 prettier 检查如何设置才能即时生效

使用 ctrl+shift+p(cmd+shift+p), 执行 reload window

```
yarn add prettier eslint-config-prettier --dev

yarn add -D prettier
```

## 安装插件

```
Prettier
eslint
```

## setting 配置

```
"editor.formatOnSave": true,
```

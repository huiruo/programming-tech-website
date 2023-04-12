---
title: eslint-Prettier配置
sidebar_position: 99
---

## 方案选择 eslint,但是 prettier也得了解
ESLint 主要解决了两类问题，但其实 ESLint 主要解决的是代码质量问题。另外一类代码风格问题

二者冲突
```
方法就是在 .eslintrc 里面将 prettier 设为最后一个 extends
// .eslintrc    
{      
    "extends": ["prettier"] // prettier 一定要是最后一个，才能确保覆盖    
}
```

eslint 本身是没有格式化的。是因为配置了插件，vscdoe 里面本身 prettier 也是有配置的，这个就会和外面的产生冲突

# eslint 解决
```
1.代码质量问题：使用方式有可能有问题(problematic patterns)
2.代码风格问题：风格不符合一定规则 (doesn’t adhere to certain style guidelines)
```

## VSCode 中的相关参数继续配置
https://www.cnblogs.com/jiaoshou/p/12218642.html
```json
"[typescriptreact]": {
  "editor.defaultFormatter": "vscode.typescript-language-features"
},
// ESlint 提供一些修复方案。我们在保存代码时，VSCode 就会帮我们自动修复
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
"eslint.codeAction.showDocumentation": {
  "enable": true
},
"eslint.format.enable":true,
/*
eslint.validate 这个参数是老版本的定义校验的类型，逐步会被eslint.probe的替代
*/
"eslint.validate": [
   "javascript",
   "javascriptreact",
   "typescript"
   {
       "language": "vue",   // 检测vue文件
       "autoFix": true   // 为vue文件开启保存自动修复的功能
   },
   {
	   "language": "html",
	   "autoFix": true
   },
],
/*
 eslint.probe 这个规定 ESlint 插件需要校验的语言类型添 */
"eslint.probe":[
   "javascript",
   "typescript", 
   "typescriptreact", 
   "html", 
   "vue"
]
```

# Prettier 解决什么问题
 ESLint 主要解决的是代码质量问题。Prettier 解决另外一类代码风格问题,prettier 是一个代码格式化插件,它并不关心你的语法是否正确，只关心你的代码格式，比如是否使用单引号，语句结尾是否使用分号等等。
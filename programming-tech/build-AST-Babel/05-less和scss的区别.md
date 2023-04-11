---
title: less和scss的区别
sidebar_position: 5
---

## less 配置
```
{
  test: /.less$/,
  use: ["style-loader", "css-loader", "less-loader"],
},
```

## 二者不同
1. 编译环境不一样
Sass是在服务端处理的，以前是Ruby，现在是Dart-Sass或Node-Sass，而Less是需要引入less.js来处理Less代码输出CSS到浏览器，也可以在开发服务器将Less语法编译成css文件，输出CSS文件到生产包目录，有npm less, Less.app、SimpleLess、CodeKit.app这样的工具，也有在线编译地址。

2. 变量符不一样，Less是@，而Scss是$。
```css
Less-变量定义
@color: #00c; /* 蓝色 */
#footer {
  border: 1px solid @color; /* 蓝色边框 */
}
scss-变量定义
$color: #00c; /* 蓝色 */

#footer {
  border: 1px solid $color; /* 蓝色边框 */
}
```

3.输出设置，Less没有输出设置，Sass提供4中输出选项：nested, compact, compressed 和 expanded。
输出样式的风格可以有四种选择，默认为nested

nested：嵌套缩进的css代码
expanded：展开的多行css代码
compact：简洁格式的css代码
compressed：压缩后的css代码

4.Sass支持条件语句，可以使用if{}else{},for{}循环等等。而Less不支持。
4.1 if-else if-else示例：
```css
@mixin txt($weight) { 
  color: white; 
  @if $weight == bold { 
    font-weight: bold;
  } 
  @else if $weight == light { 
    font-weight: 100;
  } 
  @else { 
    font-weight: normal;
  } 
}

.txt1 { 
  @include txt(bold); 
}

编译结果：
.txt1 {
  color: white;
  font-weight: bold; 
}
```

5. 引用外部CSS文件
scss@import引用的外部文件如果不想编译时多生成同名的.css文件，命名必须以_开头, 文件名如果以下划线_开头的话，Sass会认为该文件是一个引用文件，不会将其编译为同名css文件.
```css
// 源代码：
@import "_test1.scss";
@import "_test2.scss";
@import "_test3.scss";
// 编译后：
h1 {
  font-size: 17px;
}
 
h2 {
  font-size: 17px;
}
 
h3 {
  font-size: 17px;
}
```

---
title: AST
sidebar_position: 1
---

AST在日常业务中也许很难涉及到，但当你不止于想做一个工程师，而想做工程师的工程师，

写出vue、react之类的大型框架，或类似webpack、vue-cli前端自动化的工具，或者有批量修改源码的工程需求，那你必须懂得AST。AST的能力十分强大，且能帮你真正吃透javascript的语言精髓。

在javascript世界中，你可以认为抽象语法树(AST)是最底层。再往下，就是关于转换和编译的“黑魔法”领域了。

## 拆解Javascript

通过抽象语法树解析，我们可以像童年时拆解玩具一样，透视Javascript这台机器的运转，并且重新按着你的意愿来组装。
```js
function add(a, b) {
    return a + b
}
```


```json
{
  "type": "Program",
  "start": 0,
  "end": 39,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 39,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 12,
        "name": "add"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 13,
          "end": 14,
          "name": "a"
        },
        {
          "type": "Identifier",
          "start": 16,
          "end": 17,
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 19,
        "end": 39,
        "body": [
          {
            "type": "ReturnStatement",
            "start": 25,
            "end": 37,
            "argument": {
              "type": "BinaryExpression",
              "start": 32,
              "end": 37,
              "left": {
                "type": "Identifier",
                "start": 32,
                "end": 33,
                "name": "a"
              },
              "operator": "+",
              "right": {
                "type": "Identifier",
                "start": 36,
                "end": 37,
                "name": "b"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```


第一步：
一个id，就是它的名字，即add
两个params，就是它的参数，即[a, b]
一块body，也就是大括号内的一堆东西

1.add没办法继续拆下去了，它是一个最基础Identifier（标志）对象，用来作为函数的唯一标志，就像人的姓名一样。
{
    name: 'add'
    type: 'identifier'
    ...
}

2.params继续拆下去，其实是两个Identifier组成的数组。之后也没办法拆下去了。
[
    {
        name: 'a'
        type: 'identifier'
        ...
    },
    {
        name: 'b'
        type: 'identifier'
        ...
    }
]

3.body其实是一个BlockStatement（块状域）对象，用来表示是{return a + b}

打开Blockstatement，里面藏着一个ReturnStatement（Return域）对象，用来表示return a + b

### 继续打开ReturnStatement

里面是一个BinaryExpression(二项式)对象，用来表示a + b

继续打开BinaryExpression，它成了三部分，left，operator，right

operator 即+,left 里面装的，是Identifier对象 a right 里面装的，是Identifer对象 b

就这样，我们把一个简单的add函数拆解完毕，用图表示就是

![](../assets/img-build/图1-把函数拆成AST.png)

那么，上面我们提到的Identifier、Blockstatement、ReturnStatement、BinaryExpression， 这一个个小部件的说明书去哪查？

## AST抽象语法树，树形结构来表示编程语句,对计算机来说更加友好的表现形式

抽象语法树(Abstract Syntax Tree)，是一种标准的树结构。

可以理解为可以将一串代码解析成一个树形结构，这个树形结构上面每个节点代表一种语法结构。

一个 AST 可以由单一的节点或是成百上千个节点构成。它们组合在一起可以描述用于静态分析的程序语法。

单层AST节点示例：
```js
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
 
//type是节点的类型，比如"Program"、"FunctionDeclaration"、"ExpressionStatement"等，类型
//有很多种，种节点类型会有一些附加的属性用于进一步描述该节点类型。
//节点类型种类参见：https://blog.csdn.net/weixin_30576827/article/details/94938016
```

这里列一个必备网站用来查看 js 被转换为抽象语法树后的样子:

https://astexplorer.net/

每个js引擎都有自己的AST语法解析器，比如chrome是v8引擎，node也是v8引擎
AST语法树每一层都拥有相同的结构，这样的每一层结构也被叫做 节点（Node）。

## JS Parser解析器
能够将JavaScript源码`转化为抽象语法树(AST)的工具叫做JS Parser解析器。`

常见的AST parser
- Espree，基于esprima，用于eslint
- Acorn，号称是相对于esprima性能更优，体积更小
- Babylon，出自acorn，用于babel
- Babel-eslint，babel团队维护，用于配合使用ESLint

几个重要的包：
- 1.babylon 将js代码转化为ast语法树
```
Babylon 是一个解析器，它可以将 JavaScript 字符串转换为抽象语法树（AST）
```

- 2.转换 babel-traverse 
```
babel-traverse 模块允许你浏览、分析和修改抽象语法树（AST）。
```

- 3.生成 babel-generator 
最后，babel-generator 模块用来将转换后的抽象语法树（AST）转换为 JavaScript 字符串。

### JS Parser的解析过程包括两部分:

* 1.词法分析(Lexical Analysis)：将整个代码字符串分割成最小语法单元数组
```
语法单元是被解析语法当中具备实际意义的最小单元，简单的来理解就是自然语言中的词语。
```
* 2.语法分析(Syntax Analysis)：在分词基础上建立分析语法单元之间的关系

### JS Parser的解析：词法分析(Lexical Analysis)
Javascript 代码中的语法单元主要包括以下这么几种：
- 关键字：例如 var、let、const等

- 标识符：没有被引号括起来的连续字符，可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些内置常量

- 运算符： +、-、 *、/ 等

- 数字：像十六进制，十进制，八进制以及科学表达式等

- 字符串：因为对计算机而言，字符串的内容会参与计算或显示

- 空格：连续的空格，换行，缩进等

- 注释：行注释或块注释都是一个不可拆分的最小语法单元

- 其他：大括号、小括号、分号、冒号等

### JS Parser的解析:语法分析(Syntax Analysis)
组合分词的结果，确定词语之间的关系，确定词语最终的表达含义，生成抽象语法树。

以赋值语句为例，使用esprima来解析：
```js
var a = 1;
```

`1.词法分析结果如下`，可以看到，分词的结果是一个数组，每一个元素都是一个最小的语法单元：
```json
[{
		"type": "Keyword",
		"value": "var"
	},
	{
		"type": "Identifier",
		"value": "a"
	},
	{
		"type": "Punctuator",
		"value": "="
	},
	{
		"type": "Numeric",
		"value": "1"
	},
	{
		"type": "Punctuator",
		"value": ";"
	}
]
```

`2.语法分析结果如下`，把分词的结果按照相互的关系组成一个树形结构：
```json
{
	"type": "Program",
	"body": [{
		"type": "VariableDeclaration",
		"declarations": [{
			"type": "VariableDeclarator",
			"id": {
				"type": "Identifier",
				"name": "a"
			},
			"init": {
				"type": "Literal",
				"value": 1,
				"raw": "1"
			}
		}],
		"kind": "var"
	}],
	"sourceType": "script"
}
```

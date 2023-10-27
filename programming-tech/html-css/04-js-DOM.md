---
title: js-DOM
sidebar_position: 3
---

## DOM 对象的一些常用方法

### 基础
DOM（文档对象模型）是 JavaScript 中用于操作和处理网页内容的一种编程接口。它提供了一种结构化的方式来表示和操作网页文档，使开发者可以通过 JavaScript 代码来访问和修改网页的元素、属性和内容。以下是一些 DOM 中常见的术语和概念的中文解释：

1. 文档（Document）： 文档是整个网页的表示，包括 HTML 内容、CSS 样式和 JavaScript 代码。文档对象模型（DOM）允许您访问和操纵文档中的元素和数据。

2. 元素（Element）： 元素是网页文档中的构建块，例如段落、标题、图像、链接等。通过 DOM，您可以访问和操作这些元素，例如更改它们的内容、样式或属性。

3. 节点（Node）： 节点是 DOM 中的基本单位，可以是元素、属性、文本或其他类型的数据。DOM 中的元素都是节点，但节点不一定是元素。节点可以用来构建 DOM 树的结构。

4. DOM 树（DOM Tree）： DOM 树是整个文档的分层表示，由节点组成的层次结构。根节点是文档本身，它包含了所有其他节点，如 HTML 元素、文本节点、属性等。通过遍历 DOM 树，您可以访问文档中的不同部分。

5. 属性（Attribute）： 属性是元素的附加信息，以键-值对的形式存储。通过 DOM，您可以读取和修改元素的属性，如 class、id、src 等。

6. 事件（Event）： 事件是用户或浏览器触发的交互动作，如点击、鼠标移动、键盘输入等。通过 DOM 事件处理，您可以在特定事件发生时执行 JavaScript 代码。

### element和node的区别
* Element 主要用于表示元素节点，例如 HTML 中的 `<div>、<p>、<a>` 等。它具有与元素节点相关的特定属性和方法，如 tagName、getAttribute、setAttribute 等。

* Node 则是 DOM 中的通用节点对象，用于表示 DOM 树中的各种节点，包括元素节点、文本节点、注释节点、属性节点等。它具有通用的属性和方法，用于在 DOM 树中导航和操作节点，如 nodeName、nodeType、parentNode、childNodes 等。 

Element 示例:
>在这个示例中，divElement 是一个 Element 对象，代表了`<div>`元素，具有与元素相关的属性和方法。

```html
<div id="myDiv" class="highlight" data-custom="example">This is a div element.</div>

<script>
  var divElement = document.getElementById("myDiv"); // 获取<div>元素
  var className = divElement.className; // 获取元素的 class 属性
  var customData = divElement.getAttribute("data-custom"); // 获取自定义属性值
</script>
```

Node 示例：
* Node 是 DOM 树中的通用基本对象，表示 DOM 树中的节点。几乎所有 DOM 元素都是 Node 的子类。
* Node 有一些重要的属性和方法，如 nodeName、nodeType、childNodes 等，用于在 DOM 树中导航和操作节点。
* Node 包括元素节点、文本节点、注释节点、属性节点等，因此它们是 DOM 树的通用构建块。

>在这个示例中，divNode、textNode 和 emNode 都是 Node 对象，代表了不同类型的 DOM 节点。


```html
<!-- 以下是一个具有不同类型节点的 HTML 片段 -->
<div id="myDiv">Hello, <em>world</em>!</div>

<script>
  var divNode = document.getElementById("myDiv"); // 获取<div>元素节点
  var textNode = divNode.firstChild; // 获取文本节点，包含 "Hello, "
  var emNode = divNode.getElementsByTagName("em")[0]; // 获取<em>元素节点
</script>
```

### createElement(Tag)：创建一个 HTML 标签对象

下面配合:getElementById(ID)：获得指定 id 的对象

配合：body.appendChild(oTag)：向 HTML 中插入元素对象

```js
// For example, to create a new paragraph element:
var newParagraph = document.createElement("p");

// You can also set attributes for the newly created element, if needed.
newElement.setAttribute("attributeName", "attributeValue");

// For example, setting the class attribute for the paragraph:
newParagraph.setAttribute("class", "my-paragraph");

// You can also set the content of the element using text or HTML:
newParagraph.textContent = "This is a new paragraph.";
// or
newParagraph.innerHTML = "<strong>This is a bold paragraph.</strong>";

// Append the newly created element to an existing element in the DOM
var parentElement = document.getElementById("parentElementId");
parentElement.appendChild(newElement);
```

### querySelector方法，推荐
querySelector的参数是css选择器，任何选择器都可以作为它的参数，这样就使得它非常方便灵活：

比如获取class=‘test’的标签下的第一个子元素，可以这样写querySelector('.test  > * ')，也可以指定子元素的类型querySelector('.test  > span ')，或者是：classquerySelector('.test  > #f_div')

还可以使用querySelectorAll方法，这样会获取所有满足条件的元素，而不只是获取第一个元素。
```html
<div class="first">
    <span>张三</span>
</div>
<div id="second">
    <div id=f_div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>
<script>
    //通过类选择器获取节点
    doucument.querySelector('.first');
    //通过id选择器获取节点
    doucument.querySelector('#second');
    //通过伪类选择器获取子节点
    document.querySelector('.first>span');
    //确认selectAll批量获取节点
    document.querySelectorAll('#second>div');
</script>
```
推荐使用querySelector方法，因为它更加灵活，使用作为css选择器进行选择非常方便。当然querySelector方法不只可以获取元素的子节点，它可以获取任何节点。querySelector方法可以兼容到IE8。

## 1. document 对象属性

```js
document.doctype // 可以知道文档声明，如果没有return null;这里是<!DOCTYPE html>
document.doctype.name // 知道文档声明的名字.
document.head // 很明显选取head节点.就是<head></head>这段
document.body // 选取body节点.

cookie 设置或返回与当前文档有关的所有 cookie。
domain 返回当前文档的域名。
lastModified 返回文档被最后修改的日期和时间。
```

### 2. document.location

```js
document.location.href // 获取当前地址
document.location.assign(http://www.baidu.com) // 分配一个地址

// 另外如果href是获取当前地址，如果给他赋值，把一个地址给他，也能达到assign的效果；

document.location="http://www.baidu.com"
// 或者
document.location.href="http://www.baidu.com"
```

## 1.Element 的几个必要重要的属性

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>index</title>
  </head>
  <body>
    <p id="p1" class="p">测试</p>
    <p id="p2" class="p">测试</p>
    <p id="p3" class="p">测试</p>
    <script>
      var a = document.getElementById("p1"); // 获取上面那个例子的p1元素.
      console.log("1:", a.id); // 获取该元素的id... "p1" (貌似就是通过p1找到的他- -)
      console.log("2:", a.nodeName); // 获取到节点的名字(就是标签名字) 这里是"p"
      console.log("3:", a.className); // 获取节点的class名字，这里因为关键字的原因，只能用className;

      // 另外还有一些
      console.log("4:", a.child); // 获取子元素  这里没有
      console.log("5:", a.lastchild); // 最后一个子元素.
      console.log("6:", a.firstchild); // 第一个子元素.
      console.log("7:", a.nextSibling); // 下一个兄弟元素.
      console.log("8:", a.previousSibing); // 上一个兄弟元素.
      /*
    1: p1
    2: P
    3: p
    4: undefined
    5: undefined
    6: undefined
    7: #text
    8: undefined
    */
    </script>
  </body>
</html>
```

### 1.创建和添加元素 Element

- createElement
- appendChild
- append()
- innerHTML

* append()
  > 可以同时传入多个节点或字符串，没有返回值；append 还是试用期的方法，有兼容问题，（但我用了暂时火狐，谷歌，iE 都能使用）。

### 2.appendChild()

1. 只能传一个节点，且不直接支持传字符串需要`appendChild(document.createTextElement('字符串'))`代替
2. 返回追加的 Node 节点；

3. 若`appendChild()`的参数是页面存在的一个元素，则执行后原来的元素会被移除；
   例如：`document.getElement("a").appendChild(document.getElementByIdx("b"))`，执行后，b 元素会先被移除，然后再添加到 a 中。

性能:

- innerHTML 比 appendChild 要方便，特别是创建的节点属性多，同时还包含文本的时候；
- 但执行速度的比较上，使用 appendChild 比 innerHTML 要快，特别是内容包括 html 标记时，appendChild 明显要快于 innerHTML，这可能是因为 innerHTML 在铺到页面之前还要对内容进行解析才能铺到页面上，当包含 html 标记过多时， innerHTML 速度会明显变慢。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>创建元素</title>
  </head>
  <script>
    window.onload = function () {
      var a = document.createElement("div");
      a.className = "p1";
      a.innerHTML = "<span>测试下</span>";
      //添加到文档中
      document.body.appendChild(a); //这下子元素就写进去了
      //如果还要添加 可以照着上面来，我们现在就添加一个元素进去
      var b = document.createElement("div");
      b.innerHTML = "<p>测试第二弹</p>";
      //这次我们添加在上一个元素前面
      document.body.insertBefore(b, a); //把b插在a前面- -
      //这时候不想要b了，想替换掉，可以这么做!
      var c = document.createElement("div");
      c.innerHTML = "我就是来替换的";
      document.body.replaceChild(c, b); //（new,old）
    };
  </script>
  <body></body>
</html>
```

### 3.innerText 和 innerHTML

- innerHTML

  - 获取元素的内容：element.innerHTML;
  - 给元素设置内容：element.innerHTML =htmlString;

- innerTEXT
  打印标签之间的纯文本信息，显示标签，标签无效，低版本的火狐浏览器不支持。
  - 获取元素的内容：element.innerText;
  - 给元素设置内容：element.innerText = string;

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <p id="demo">my first demo</p>
  </body>
  <script>
    document.getElementById("demo").innerHTML = "<b>hello world</b>";
    document.body.innerHTML = "<b>hello world</b>";

    document.getElementById("demo").innerText = "<h1>My First JavaScript</h1>";
    document.body.innerTEXT;
  </script>
</html>
```

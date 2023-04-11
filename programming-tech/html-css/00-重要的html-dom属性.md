---
title: 重要的html-dom属性
sidebar_position: 3
---

# DOM对象的一些常用方法

createElement(Tag)：创建一个 HTML 标签对象
getElementById(ID)：获得指定 id 的对象
getElementsByName(Name)：获得之前 Name 的对象
body.appendChild(oTag)：向 HTML 中插入元素对象

## 1. document对象属性
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

## 1.Element的几个必要重要的属性
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Z-one</title>
</head>
<body>
    <p id="p1" class="p">测试</p>
    <p id="p2" class="p">测试</p>
    <p id="p3" class="p">测试</p>
  <script>
    var a=document.getElementById("p1") // 获取上面那个例子的p1元素.
    console.log('1:',a.id)  // 获取该元素的id... "p1" (貌似就是通过p1找到的他- -)
    console.log('2:',a.nodeName) // 获取到节点的名字(就是标签名字) 这里是"p"
    console.log('3:',a.className) // 获取节点的class名字，这里因为关键字的原因，只能用className;

    // 另外还有一些
    console.log('4:',a.child) // 获取子元素  这里没有
    console.log('5:',a.lastchild) // 最后一个子元素.
    console.log('6:',a.firstchild) // 第一个子元素.
    console.log('7:',a.nextSibling) // 下一个兄弟元素.
    console.log('8:',a.previousSibing) // 上一个兄弟元素.
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

### 2.创建和添加元素 Element
* createElement
* appendChild
* append()
* innerHTML
--------------------------
+ append()
可以同时传入多个节点或字符串，没有返回值；
据说 append 还是试用期的方法，有兼容问题，（但我用了暂时火狐，谷歌，iE都能使用）。

+ appendChild() 
```
1.只能传一个节点，且不直接支持传字符串【需要 appendChild(document.createTextElement('字符串'))代替】
2.返回追加的 Node 节点；

3.若 appendChild() 的参数是页面存在的一个元素，则执行后原来的元素会被移除；
例如：document.getElement("a").appendChild(document.getElementByIdx("b"))，执行后，b 元素会先被移除，然后再添加到 a 中。
```

性能:
```
+ innerHTML 比 appendChild 要方便，特别是创建的节点属性多，同时还包含文本的时候；
+ 但执行速度的比较上，使用 appendChild 比 innerHTML 要快，特别是内容包括 html 标记时，appendChild 明显要快于  innerHTML，这可能是因为 innerHTML 在铺到页面之前还要对内容进行解析才能铺到页面上，当包含 html 标记过多时， innerHTML速度会明显变慢。
```


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>创建元素</title>
</head>
<script>
    window.onload=function(){
        var a=document.createElement("div");
        a.className="p1"
        a.innerHTML=("<span>测试下</span>");
        //添加到文档中
        document.body.appendChild(a);//这下子元素就写进去了
        //如果还要添加 可以照着上面来，我们现在就添加一个元素进去
        var b=document.createElement("div");
        b.innerHTML="<p>测试第二弹</p>";
        //这次我们添加在上一个元素前面
        document.body.insertBefore(b,a);//把b插在a前面- -
        //这时候不想要b了，想替换掉，可以这么做!
        var c=document.createElement("div");
        c.innerHTML="我就是来替换的";
        document.body.replaceChild(c,b);//（new,old）
    }
</script>
<body>

</body>
</html>
```

### 3.innerText 和 innerHTML
* innerHTML
  * 获取元素的内容：element.innerHTML;
  * 给元素设置内容：element.innerHTML =htmlString;

* innerTEXT
打印标签之间的纯文本信息，显示标签，标签无效，低版本的火狐浏览器不支持。
  * 获取元素的内容：element.innerText;
  * 给元素设置内容：element.innerText = string;
```html
<!doctype html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <p id="demo">my first demo</p>
</body>
<script>
    document.getElementById("demo").innerHTML="<b>hello world</b>"
    document.body.innerHTML="<b>hello world</b>"

    document.getElementById("demo").innerText="<h1>My First JavaScript</h1>";
    document.body.innerTEXT
</script>
</html>
```

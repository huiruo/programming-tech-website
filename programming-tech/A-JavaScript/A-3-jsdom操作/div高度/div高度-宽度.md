## 基础
```js
const el = document.getElementById("mContentId");
// 获取距离顶部的距离:网页被卷去的高
const scrollTop = el.scrollTop;
// 获取可视区的高度
const clientHeight = el.clientHeight;
// 获取滚动条的总高度:网页正文全文高
const scrollHeight = el.scrollHeight

          if (clientHeight + scrollTop - scrollHeight >= 0) {
            this.showMore = false;
            this.unRead = 0;
            console.log("手动滚动---->1.到达底部");
            if (this.atMessage.length > 0) {
              // this.cleanAtMessage();
            }
          } else {
            console.log("手动滚动---->2.没到达底部");
          }
```

```
offsetHeight为模块的高度+边框的大小。
IE、Opera 认为 offsetHeight = clientHeight + 滚动条 + 边框。
NS、FF 认为 offsetHeight 是网页内容实际高度，可以小于 clientHeight。


1、各浏览器下 scrollTop的差异 
IE6/7/8： 
对于没有doctype声明的页面里可以使用  document.body.scrollTop 来获取scrollTop高度 ； 
对于有doctype声明的页面则可以使用 document.documentElement.scrollTop； 
Safari: 
safari 比较特别，有自己获取scrollTop的函数 ： window.pageYOffset ； 
Firefox: 
火狐等等相对标准些的浏览器就省心多了，直接用 document.documentElement.scrollTop ； 
2、获取scrollTop值 
完美的获取scrollTop 赋值短语 ： 
var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
```



```html
<!DOCTYPE html>
<html>
    <head>
        <title>demo</title>
        <meta charset="utf-8">
        <style type="text/css">
            #demo {
                width: 100px;
                height: 200px;
                background: yellow;
                margin: 10px;
                padding: 10px;
                border: 2px solid blue;
            }
        </style>
    </head>
    <body>
        <div id="demo">hello</div>
        <script type="text/javascript">
            var div = document.getElementById('demo');
            console.log(div.offsetHeight); // 224
            console.log(div.clientHeight); // 220
        </script>
    </body>
</html>
```

```
可以看出
offsetHeight = content + border + padding = 200 + 2 * 2 + 10 * 2 = 224
clientHeight = content + padding = 200 + 2 * 10 = 220
两个属性的差距于是就显而易见了。同样返回元素的高度，offsetHeight的值包括元素内容+内边距+边框，而clientHeight的值等于元素内容+内边距。区别就在于有没有边框~
但是，问题来了，我们想获取元素本身的高度呢？于是——


alert($(document.body).outerHeight(true));//浏览器当前窗口文档body的总高度 包括border padding margin

```


## 判断div是否在视窗
公式：
元素距离顶部高度（elOffsetTop） >= dom滚动高度（docScrollTop）
并且元素距离顶部高度（elOffsetTop） < （dom滚动高度 + 视窗高度）

```
          const el = document.getElementById("mContentId");
          // 获取可视区的高度
          const clientHeight = el.clientHeight;
          const elOffsetTop = document.getElementById("meId" + index).offsetTop

          if(elOffsetTop<(clientHeight+scrollTop)){
          console.log("===============>显示了")
          }


```
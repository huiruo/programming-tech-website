
## 获取dom节点:通过标签的属性值获取后代节点 

1.getElementById         id    如果存在多个id相同的元素，只会返回第一个
2.getElementsByTagName   标签名  返回所有符合条件的元素的集合
3.getElementsByName       name 返回所有符合条件的元素的集合
4.getElementsByClassName  class  返回所有符合条件的元素的集合

### 例子：
```html
<body>
    <p id='Jan' class='test'>1</p>
    <p id='Jan' class='test'>2</p>
    <p id='Mar'>3</p>
</body>
<script type="text/javascript">
    var j=document.getElementById('Jan');
    console.log(j);
</script>
```

##  child属性
每个dom元素都是一个对象，在dom元素对象中有四个专门用于获取子元素的属性：
属性名 作用  其他
childNodes  获取所有子节点     不推荐使用，如果有空格，会作为文本节点获取到
child       获取所有子节点     推荐使用
firstChild  获取首个子节点     推荐使用
lastChild   获取最后一个子节点  推荐使用


## querySelector方法，强烈推荐！
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
总体来说，我比较推荐使用querySelector方法，因为它更加灵活，使用作为css选择器进行选择非常方便。当然querySelector方法不只可以获取元素的子节点，它可以获取任何节点。querySelector方法可以兼容到IE8，基本能满足前端开发兼容性的需要。
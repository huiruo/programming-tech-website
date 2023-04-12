
## 实战：使用 innerHTML 动态添加vue dom
```
        <div
          v-for="(item, index) in elDomArr"
          :key="index"
          id="audioContainer"
        ></div>

js:
    openCallBck() {
      if (this.elDomArr.length) {
        console.log("openCallBck_不存在_添加元素");
        this.elDomArr = ["1"];
        const body = document.getElementById("audioContainer");
        const audioHtml = `<div><audio id="refAudio"><source src="" /></audio></div>`;
        document.getElementById("audioContainer").innerHTML = audioHtml;
      }
    },
```

## 关于innerHTML: 是将之前的dom元素区内容全部删除后重新添加该内容
```
* 可以通过 document.getElementById("aa").innerHTML 来获取id为aa的对象的内嵌内容；
* 也可以对某对象插入内容，如 document.getElementById("abc").innerHTML="这是被插入的内容";
```

## 扩展：appendChild(Node)
一般是在指定元素节点的最后一个子节点之后添加节点，但如果Node是页面中的DOM对象，那么就不是添加节点了，就是直接Move节点。
```
var node=document.createElement("LI");
var textnode=document.createTextNode("Water");
node.appendChild(textnode);


var a=document.createElement("a");
a.href="#";
a.onclick=function(){"这里面的代码爱怎么写就怎么写"};
document.body.appendChild(a);
```

## 扩展：js一些原生方法
```
document.getElementsByTagName()返回带有指定标签名的对象集合。

document.getElementById()返回对拥有指定 id 的第一个对象的引用。

document.createElement()通过指定名称创建一个元素
```

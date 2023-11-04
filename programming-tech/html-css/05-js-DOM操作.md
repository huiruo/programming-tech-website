## 实战：使用 innerHTML 动态添加 vue dom
>innerHTML: 是将之前的 dom 元素区内容全部删除后重新添加该内容
```
* 可以通过 document.getElementById("aa").innerHTML 来获取id为aa的对象的内嵌内容；
* 也可以对某对象插入内容，如 document.getElementById("abc").innerHTML="这是被插入的内容";
```

```html
<div v-for="(item, index) in elDomArr" :key="index" id="audioContainer"></div>
```

```js
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

## 判断 div 是否在视窗
公式：
```
元素距离顶部高度（elOffsetTop） >= dom 滚动高度（docScrollTop）

并且元素距离顶部高度（elOffsetTop） < （dom 滚动高度 + 视窗高度）
```

```js
const el = document.getElementById("mContentId");
// 获取可视区的高度
const clientHeight = el.clientHeight;
const elOffsetTop = document.getElementById("meId" + index).offsetTop;

if (elOffsetTop < clientHeight + scrollTop) {
  console.log("===============>显示了");
}
```

## 是否滚动到底部
```js
const el = document.getElementById("mContentId");
// 获取距离顶部的距离:网页被卷去的高
const scrollTop = el.scrollTop;
// 获取可视区的高度
const clientHeight = el.clientHeight;
// 获取滚动条的总高度:网页正文全文高
const scrollHeight = el.scrollHeight;

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
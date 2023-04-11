

```html
<div
v-if="item.momentTitle !== ''"
class="text-content"
:id="'textId' + index"
>
<span class="text">{{ decodeURI(item.momentTitle) }}</span>
<span @click="extensionText(item, index, $event)" class="extension">展开</span>
</div>
```

```js
  methods: {
    extensionText(item, index, e) {
      const dom = document.getElementById("textId" + index);
      // console.log("dom", dom.firstChild);
      const styleFlag = dom.firstChild.style.display;
      if (styleFlag) {
        // console.log("非空");
        if (styleFlag === "-webkit-box") {
          // console.log("非空2");
          dom.firstChild.style.display = "inline";
          e.currentTarget.innerHTML = "收起";
        } else {
          // console.log("空2");
          dom.firstChild.style.display = "-webkit-box";
          e.currentTarget.innerHTML = "展开";
        }
      } else {
        // console.log("空");
        e.currentTarget.innerHTML = "收起";
        dom.firstChild.style.display = "inline";
      }
    }
}
```

```css
// 滚动条 end
.text-content {
.extension {
  cursor: pointer;
  font-size: 12px;
  color: #308dff;
}
.text {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  color: #ffffff;
}
}
```
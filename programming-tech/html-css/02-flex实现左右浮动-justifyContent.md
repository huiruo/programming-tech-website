---
title: flex实现左右浮动-justifyContent
sidebar_position: 7
---

## 左边一个div，右边一个div，父元素只需要:
display:flex;
justify-content:space-between

 ```html
 .cell-bottom {
   display: flex;
   justify-content: space-between;
 }

 <div class="cellBottom">
     <div>{{ cell.price }}</div>
     <div class="cell-bottom">aa</div>
 </div>
 ```

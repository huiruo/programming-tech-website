---
title: ie浏览器兼容性
sidebar_position: 12
---

## 盒模型差异
* IE盒模型： border-box：指定盒模型为 IE模型（怪异模式），设置 border、padding 不会影响元素 width 与 height 的尺寸，
即 border 与 padding 由元素已设空间转变。
* W3C盒模型： content,padding,border、margin

## 判断是否ie
```js
function IEVersion() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
      if(isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          var fIEVersion = parseFloat(RegExp["$1"]);
          if(fIEVersion == 7) {
              return 7;
          } else if(fIEVersion == 8) {
              return 8;
          } else if(fIEVersion == 9) {
              return 9;
          } else if(fIEVersion == 10) {
              return 10;
          } else {
              return 6;//IE版本<=7
          }   
      } else if(isEdge) {
          return 'edge';//edge
      } else if(isIE11) {
          return 11; //IE11  
      }else{
          return -1;//不是ie浏览器
      }
  }
```


## IE6双边距
行内属性设置了块级属性（display: block;）后，会产生双倍边距。
解决方案是在添加一个 display: inline; 或者 display: table;


双倍margin
浮动元素设置了margin在IE6下会产生双倍margin。
只要给浮动元素设置 display: inline;就可以了。或者说使用IE6的hack：_margin；

双倍float
解决方案：在float的标签样式控制中加入display:inline;转化为行内属性

.divBox{
  float:left;
  width:100px;
  margin:0 0 0 100px;		     //这种情况之下IE会产生200px的距离
  display:inline; 				 //使浮动忽略
}

## js兼容方案篇

indexof()
IE8以下不兼容indexof()方法, 添加indexof的原型方法即可；
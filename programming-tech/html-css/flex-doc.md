

## 关于flex 1
https://www.51cto.com/article/683878.html

flex：是 flex-grow、flex-shrink、flex-basis的缩写，默认值为0 1 auto
```css
/* 
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto */
.item { 
    /* 相当于  flex: 1 1 0% */ 
    flex: 1; 
    /* 相当于 */
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;

    /* 两个值的情况 */
    /* 上面对应的值是 1 1 0，也就是 flex-grow: 1，flex-shrink:1, flex-basic: 0。 */
    .item { 
      flex: 1 1; 
    } 

    /* 一个长度值
如果 flex 值是一个长度值，这会作用于flex-basis。flex-grow和flex-shrink默认为1 */
  .item { 
      flex: 100px; 
      /* flex: 1 1 100px */ 
  } 
}
```
## flex-grow 属性
flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

注意：flex-grow会影响宽度或高度，具体取决于flex-direction属性。

在不使用flex-grow的情况下，flex 项目的宽度将默认为其初始宽度。但是，使用flex-grow: 1时，flex 项目会平均剩余可用的空间。

### A索取剩余空间：设置flex-grow:1，B不索取
https://blog.csdn.net/weixin_38241212/article/details/108468241
```css
.inner {
    flex-basis: 100px; /*相当于设置width*/
    height: 100px;
    background: teal;
    flex-grow: 1; /*索取剩余空间*/
}
.inner1 {
    flex-basis: 200px; /*相当于设置width*/
    height: 100px;
    background: skyblue;
}
```


### A、B都索取剩余空间，A设置flex-grow:1，B设置flex-grow:2
```css
  .inner {
      flex-basis: 100px; /*相当于设置width*/
      height: 100px;
      background: teal;
      flex-grow: 1; /*索取剩余空间*/
  }
  .inner1 {
      flex-basis: 200px; /*相当于设置width*/
      height: 100px;
      background: skyblue;
      flex-grow: 2; /*索取剩余空间*/
  }
```


## flex-shrink 属性
flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

考虑情况：当子元素超出父元素时，子元素如何缩小自己的宽度

## flex-basis 属性
flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间(main size)。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

flex-basis可以设为跟width或height属性一样的值(比如350px，默认值为 auto)，则项目将占据固定空间。

## flex 属性
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。这也说 flex 项目会根据其内容大小增长

flex 项目的大小取决于内容。因此，内容越多的flex项目就会越大。
```css
.item { 
    /* 默认值，相当于 flex：1 1 auto */ 
    flex: auto; 
}
```

flex 项目绝对大小
相反，当flex-basis属性设置为0时，所有flex项目大小会保持一致。
```css
.item { 
    /* 相当于  flex: 1 1 0% */ 
    flex: 1; 
}
```
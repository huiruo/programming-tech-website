## 总结
Flexbox 可以使您在水平方向（行）或垂直方向（列）上排列元素。

CSS Grid 则可以同时在垂直和水平方向上对元素进行对齐。

通过 grid-template-rows 和 grid-template-columns 属性，可以分别确定网格行和列的大小。

## grid-template-columns
grid-template-columns 属性用于指定网格中列的数量和宽度，通过定义网格容器的列来指定轨道（track）的大小和线名（line names）。


## grid-template-rows 属性与之相反
它用于指定网格中行的数量和高度，通过定义网格容器的行来指定轨道（track）的大小和线名（line names）。

正如您在下面的图片中所看到的，grid-template-rows 将元素从设备屏幕的顶部排列到底部。

而 grid-template-columns 则将元素从设备屏幕的左侧排列到右侧。

![alt text](imgs/grid1.png)


除了直接书写像素作为行高列宽外，还可以使用函数

## repeat() 函数
可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。
```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  2行，而且行高都为 50px  */
  grid-template-rows: repeat(2, 50px);
}
```

### auto-fill 关键字
表示自动填充，容器一行（或者一列）空挡足够就往里面塞元素。
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);/* 表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素 */
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

### fr 关键字
长度单位，表示按比例分配。fr 单位代表网格容器中可用空间的一等份。
```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr 200px;/*第三列宽是固定为200px，前两列1:2分配*/
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

## minmax() 函数：接收两个参数，宽度的最小值和最大值
```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(300px, 2fr);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

## grid-row-gap 属性、grid-column-gap 属性以及 grid-gap 属性
设置行列间间隔
* grid-row-gap: 10px表示行间距是 10px
* grid-column-gap: 20px表示列间距是 20px。
* grid-gap: 10px 20px实现的效果是一样


## 在CSS网格中对齐和调整
align-items 和 justify-content 并适用于 Flexbox和Grid。你也可以使用它们来在水平和垂直方向上定位元素。

## 对于 grid 布局来说，控制方向的属性是 grid-auto-flow，默认是 row。


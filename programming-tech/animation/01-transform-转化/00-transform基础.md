## transform：转换
定义和用法：transform 属性向元素应用 2D 或 3D 转换。该属性允许我们对元素进行旋转、缩放、移动或倾斜

* translate()
* rotate()
* scale()
* skew()
* matrix()

* translate() 方法
通过 translate() 方法，元素从其当前位置移动，根据给定的 left（x 坐标） 和 top（y 坐标） 位置参数：
```css
/*值 translate(50px,100px) 把元素从左侧移动 50 像素，从顶端移动 100 像素。*/
div
{
    transform: translate(50px,100px);
}
```
* 通过 rotate() 方法，元素顺时针旋转给定的角度。允许负值，元素将逆时针旋转。
```css
/*值 rotate(30deg) 把元素顺时针旋转 30 度。*/
div
{
    transform: rotate(30deg);
}
```
* 通过 scale() 方法，元素的尺寸会增加或减少，根据给定的宽度（X 轴）和高度（Y 轴）参数：
```css
/*值 scale(2,4) 把宽度转换为原始尺寸的 2 倍，把高度转换为原始高度的 4 倍。*/
div
{
    transform: scale(2,4);
}
```
* 通过 skew() 方法，元素翻转给定的角度，根据给定的水平线（X 轴）和垂直线（Y 轴）参数：
* matrix() 方法把所有 2D 转换方法组合在一起。
matrix() 方法需要六个参数，包含数学函数，允许您：旋转、缩放、移动以及倾斜元素。

### 方法1：translate():
元素从其当前位置移动，根据给定的 left（x 坐标） 和 top（y 坐标） 位置参数
```css
/* 有两个div，它们的css样式如下： */
.before {
  width: 70px;
  height: 70px;
  background-color: #8fbc8f;
}

.after {
  width: 70px;
  height: 70px;
  background-color: #ffe4c4;
  -webkit-transform: translate(50px, 30px);
  -moz-transform: translate(50px, 30px);
  -ms-transform: translate(50px, 30px);
  -o-transform: translate(50px, 30px);
  transform: translate(50px, 30px);
}
```


### 方法2：rotate():    
```css
/* 元素顺时针旋转给定的角度。允许负值，元素将逆时针旋转。
有两个div，它们的css样式如下 */
.before {
  width: 70px;
  height: 70px;
  background-color: #8fbc8f;
}

.after {
  width: 70px;
  height: 70px;
  background-color: #ffe4c4;
  -webkit-transform: rotate(20deg);
  -moz-transform: rotate(20deg);
  -ms-transform: rotate(20deg);
  -o-transform: rotate(20deg);
  transform: rotate(20deg);
}
```

### 方法3.scale()
元素的尺寸会增加或减少，根据给定的宽度（X 轴）和高度（Y 轴）参数        
```css
.before {
  width: 70px;
  height: 70px;
  background-color: #8fbc8f;
}

.after {
  width: 70px;
  height: 70px;
  background-color: #ffe4c4;
  -webkit-transform: scale(1.5, 0.8);
  /*宽度变为原来的1.5倍，高度变为原来的0.8倍*/
  -moz-transform: scale(1.5, 0.8);
  -ms-transform: scale(1.5, 0.8);
  -o-transform: scale(1.5, 0.8);
  transform: scale(1.5, 0.8);
}
```

### 方法4.skew()
元素翻转给定的角度，根据给定的水平线（X 轴）和垂直线（Y 轴）参数   
```css
.before {
  width: 70px;
  height: 70px;
  background-color: #8fbc8f;
}

.after {
  width: 70px;
  height: 70px;
  background-color: #ffe4c4;
  -webkit-transform: skew(20deg, 20deg);
  /*围绕 X 轴把元素翻转20度，围绕 Y 轴翻转20度*/
  -moz-transform: skew(20deg, 20deg);
  -ms-transform: skew(20deg, 20deg);
  -o-transform: skew(20deg, 20deg);
  transform: skew(20deg, 20deg);
}
```

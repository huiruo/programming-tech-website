
实例：
&__coupon_center {
width: 42px;
height: 50px;
// background-image: url('~@/assets/image/icon_wdqb.png') !important;
background: url('~@/assets/image/icon_wdqb.png') no-repeat !important;
background-size: 42px 42px !important;
}
使用简写属性时，属性值的顺序为：
```text
background-color 背景颜色
background-image 背景图片 url( )
background-repeat 背景图片平铺
repeat 背景图像将向垂直和水平方向重复。这是默认
repeat-x 只有水平位置会重复背景图像
repeat-y 只有垂直位置会重复背景图像
no-repeat background-image不会重复
background-attachment 背景图片固定
scroll 背景图片随页面的其余部分滚动。这是默认
fixed 背景图像是固定的
background-position 背景图片定位
x% y% 第一个值是水平位置，第二个值是垂直。左上角是0％0％。右下角是100％100％。如果仅指定了一个值，其他值将是50％，默认值为：0％0％ |。
这两个值也可以是left,rigth和center。
xpos ypos 第一个值是水平位置，第二个值是垂直。左上角是0。单位可以是像素（0px0px）或任何其他。如果仅指定了一个值，其他值将是50％。你可以混合使用％和positions |
```
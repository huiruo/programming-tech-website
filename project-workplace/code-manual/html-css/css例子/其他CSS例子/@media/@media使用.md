

# 基础实例：
```html
/*如果文档宽度小于 300 像素则修改背景颜色(background-color):*/
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<style>
body {
    background-color:lightgreen;
}

@media screen and (max-width: 300px) {
    body {
        background-color:lightblue;
    }
}
</style>
</head>
<body>
<p>重置浏览器查看大小。当浏览器窗口的宽度小于 300 像素时，背景颜色会变成淡蓝，否则是淡绿色。<input type="button" onclick="resize_window()" value="查看效果"></p>
<SCRIPT>
<!--
function resize_window() {
        window.open ('http://www.w3cschool.cc/try/demo_source/trycss3_media_example1.htm','newwindow','height=299,width=299,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
}
//写成一行
-->
</SCRIPT>

</body>
</html>
```

# CSS 语法
@media mediatype and|not|only (media feature) {
    CSS-Code;
}
媒体类型:
all 用于所有设备
screen  用于电脑屏幕，平板电脑，智能手机等。
print   用于打印机和打印预览
媒体功能：
height  定义输出设备中的页面可见区域高度。
max-height  定义输出设备中的页面最大可见区域高度。
min-height  定义输出设备中的页面最小可见区域高度。

width   定义输出设备中的页面可见区域宽度。
max-width   定义输出设备中的页面最大可见区域宽度。
min-width   定义输出设备中的页面最小可见区域宽度。
max-device-width    定义输出设备的屏幕最大可见宽度。


# 写法：小于960px
```css
/*当页面小于960px的时候执行它下面的CSS.*/
@media screen and (max-width: 960px){
    body{
        background: #000;
    }
}
```
screen:告知设备在打印页面时使用衬线字体,在屏幕上显示时用无衬线字体。但是目前我发现很多网站都会直接省略screen,因为你的网站可能不需要考虑用户去打印时，你可以直接这样写：
```css
@media (max-width: 960px){
    body{
        background: #000;
    }
}
```

# 等于960px尺寸的代码
```css
@media screen and (max-device-width:960px){
    body{
        background:red;
    }
}
```

# 大于960px的代码
```css
@media screen and (min-width:960px){
    body{
        background:orange;
    }
}
```

# 当前笔记本：
console.log(document.body.clientWidth);
VM410:1 1263
PC端响应式媒体断点:
通过上面的电脑屏蔽及尺寸的例表上我们得到了几个宽度
1024  1280  1366  1440  1680  1920  
```css
用min-width时，小的放上面大的在下面，同理如果是用max-width那么就是大的在上面，小的在下面
@media (min-width: 1024px){
body{font-size: 18px}
} /*>=1024的设备*/

@media (min-width: 1100px) {
body{font-size: 20px}
} /*>=1024的设备*/
@media (min-width: 1280px) {
body{font-size: 22px;}
} 

@media (min-width: 1366px) {

body{font-size: 24px;}
}  

@media (min-width: 1440px) {
body{font-size: 25px !important;}
} 

@media (min-width: 1680px) {
body{font-size: 28px;}
} 
@media (min-width: 1920px) {
body{font-size: 33px;}
} 
```
## img标签实现和背景图一样的显示效果——object-fit和object-position

有一个不是正方形的图片，可能是宽度大于高度的，也可能是高度大于宽度的，而你又并不想用背景图的方式来做，要实现用img标签来让此图片显示出一个正方形的且不变形的效果

- 首先还是从背景图的做法说起，遇到类似的问题，我们大部分人首先想到的是，能用背景图片做的话，就直接用背景图片来做了，至少我是这么想的

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>背景图的做法</title>
    <style>
        .bg-img1 {
            width: 200px;
            height: 200px;
            background: url("images/img1.jpg") center;
            background-size: contain;
        }
        .bg-img2 {
            width: 200px;
            height: 200px;
            background: url("images/img2.jpg") center;
            background-size: cover;
        }
    </style>
</head>
<body>
    <h3>背景图的做法</h3>
    <div class="bg-img1"></div>
    <br>
    <div class="bg-img2"></div>

</body>
</html>
```

- ## img标签显示正方形效果的做法

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>img标签的做法</title>
    <style>
        .img-1 {
            width: 200px;
            height: 200px;
            object-fit: cover;
        }
        .img-2 {
            width: 200px;
            height: 200px;
            object-fit: cover;
        }
    </style>
</head>
<body>
<h3>img标签的做法</h3>
<img src="images/img1.jpg" class="img-1">
<br>
<img src="images/img2.jpg" class="img-2">
</body>
</html>
```

-   **那么object-fit属性还有哪些值呢？**
  　　object-fit: fill; 
  　　object-fit: contain; 
  　　object-fit: cover; 
  　　object-fit: none; 
  　　object-fit: scale-down; 

  **fill:** 中文释义“填充”。默认值。替换内容拉伸填满整个contentbox,不保证保持原有的比例。
  **contain:** 中文释义“包含”。保持原有尺寸比例。保证替换内容尺寸一定可以在容器里面放得下。因此，此参数可能会在容器内留下空白。
  **cover:** 中文释义“覆盖”。保持原有尺寸比例。保证替换内容尺寸一定大于容器尺寸，宽度和高度至少有一个和容器一致。因此，此参数可能会让替换内容（如图片）部分区域不可见（上面讲解的例子就是如此）。
  **none:** 中文释义“无”。保持原有尺寸比例。同时保持替换内容原始尺寸大小。
  **scale-down:** 中文释义“降低”。就好像依次设置了none或contain, 最终呈现的是尺寸比较小的那个。  

## 方法一（推荐）、是将 potition:absolute 元素的 left 和 right 同时设置为 0，并且设置 margin:0 auto 。

## 方法二、将 potition:absolute 元素 的 left 设置为 50%，margin-left 设置为负的父元素的宽度的一半，也就是 -width/2 ，这个的缺点是要知道父元素的确切宽度。

## 方法三、在 potition:absolute 元素外部套一层 div，对这个 div 设置绝对定位，然后再设置里面的元素 margin:0 auto。
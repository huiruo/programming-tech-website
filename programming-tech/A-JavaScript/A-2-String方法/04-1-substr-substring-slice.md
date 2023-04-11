## substr 已经不建议使用：
substr 从起始索引号提取字符串中指定数目的字符。

 substring方法与substr方法的不同之处在于，substring方法的第二个参数表示的是结束位置，而不是截取的长度。

```js
console.log('substr1:', str.substr(3))
// 输出lo world！
console.log('substr1_test:', str.substr(1))
// substr1_test: ello world!
console.log('substr2', str.substr(3, 7))
// lo worl
```

## substring
```js
const str = "Hello world!"

console.log('substring 1:', str.substring(3)) // lo world!
//因为indexEnd为默认，所以从下标3开始截取，后面的全部截取
console.log('substring 2:', str.substring(3, 7)) // lo w
// indexStart为3，所以从三开始取，取到'l'
// indexEnd为7，所以取到第六位（注意：是第六位），'w'
// 所以输出为'lo w'
```

```js
const str3 = "Hello world!"
console.log('slice 1:', str3.slice(3)) // lo world!!
console.log('slice 2:', str3.slice(3, 7)) // lo w
console.log('str3:', str3)
```

截取后几位
```js
const str = "Hello world!"
//因为indexEnd为默认，所以从下标3开始截取，后面的全部截取
console.log('substring 2:', str.substring(3, 7)) // lo w
```
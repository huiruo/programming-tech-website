

search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。
如果没有找到任何匹配的子串，则返回 -1。
```js
const asset= "LDUSDT"
const isInclude = asset.search(new RegExp(`LD`))
if (isInclude !== -1) {
  console.log('是理财', asset, '-', isInclude)
} else {
  console.log('不是是理财', asset, '-', isInclude)
}
```
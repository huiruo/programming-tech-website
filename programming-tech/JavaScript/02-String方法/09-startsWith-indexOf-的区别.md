## jumpUrl.startsWith('http')  和 jumpUrl.indexOf('http') > -1 的区别

### startsWith，专门用于检查一个字符串是否以指定的前缀开头。
如果 jumpUrl 以 'http' 开头，它将返回 true；否则，返回 false。

```js
const jumpUrl = '/pages/group/index/index?url=https%3A%2F%2Fprintchaintest.xx.com%2Factivity-center-front%2F%23%2Fdraw%2Findex'
if (jumpUrl.startsWith('http')) {
  console.log('jumpUrl 以 "http" 开头');
} else {
  console.log('jumpUrl 不以 "http" 开头');
}
```

### jumpUrl.indexOf('http') > -1:
* indexOf 方法来检查字符串中是否包含子字符串 'http'。
* 如果 jumpUrl 中包含 'http'，indexOf 返回 'http' 在字符串中的位置索引，如果找不到则返回 -1。
* 通过检查索引是否大于 -1，可以确定是否存在 'http'。
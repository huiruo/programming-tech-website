## 字符串分割

```js
const str = "data-of-list-cell";
function toCamel(str) {
  //字符串分割
  let temp = str.split("-");
  //每一个的首字母转换
  for (let i = 1; i < temp.length; i++) {
    temp[i] = temp[i][0].toUpperCase() + temp[i].slice(1);
  }
  return temp.join("");
}
```

## 去掉首尾空格

### trim() 方法

用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。

```js
let str = `  hello world haha   hhhhhha  `;
console.log("trim:", str.trim());
```

### 正则实现

```
这个正则表达式 `/^\s*|\s*$/g` 包含两部分，它用于匹配字符串中的空白字符。

1. `^\s*`：这部分匹配字符串开头的零个或多个空白字符。
   - `^` 表示字符串的开头。
   - `\s*` 表示零个或多个空白字符，其中 `\s` 是匹配空白字符的元字符（包括空格、制表符、换行符等），`*` 表示零个或多个匹配。

2. `|\s*$`：这部分使用 `|` 表示或的关系，它匹配字符串结尾的零个或多个空白字符。
   - `\s*` 表示零个或多个空白字符，同样 `\s` 匹配空白字符，`*` 表示零个或多个匹配。
   - `$` 表示字符串的结尾。

最后，`g` 是全局标志，表示正则表达式将匹配字符串中的所有匹配项，而不仅仅是第一个匹配项。

这个正则表达式可以用于去除字符串的开头和结尾的空白字符。例如，如果你有一个字符串 `"   Hello, World!   "`，使用这个正则表达式进行替换，可以得到 `"Hello, World!"`，去除了开头和结尾的空白字符。
```

```js
function _trim(targetStr) {
  let reg = /^\s*|\s*$/g;
  return targetStr.replace(reg, "");
}

console.log(`实现2${_trim(str)}`);
```

### 使用循环

```js
/**
用js去掉首尾部空格
let testStr = `  hello world,ruo  `;
时间复杂度：最坏：o(n),和收尾空格数相关
 */
let testStr = `  hello world,ruo  `;

function fn(str) {
  const strArr = str.split("");
  const blankW = ` `;
  let sumsTest = 0;

  for (let i = 0; i < strArr.length; i++) {
    sumsTest = sumsTest + 1;

    const element = strArr[i];
    if (element !== blankW) {
      console.log("h:", element, i);
      // 定位了前面字符,去掉了前面的空格
      strArr.splice(0, i);
      // console.log('去掉之后strArr', strArr, strArr.length)

      /*
       * 反向循环去掉后面空格
       * */
      let whileLength = strArr.length;
      while (whileLength !== 0) {
        // console.log('反向循环：', strArr[whileLength - 1], 'index:', whileLength - 1)
        let forWileElement = strArr[whileLength - 1];
        if (forWileElement !== blankW) {
          strArr.splice(whileLength, strArr.length - whileLength);
          break;
        }

        whileLength = whileLength - 1;
        sumsTest = sumsTest + 1;
      }

      console.log(`n为：${str.length}计算次数:', ${sumsTest}`);
      console.log("分割线========》");
      break;
    }
  }

  return strArr.join("");
}

let testStr2 = `  hello world haha   hhhhhh  `;
let testStr3 = `                         hh          hhhh                                    `;
let testStr4 = `                         h                                    `;
let testStr5 = `                                                                 `;
console.log("target:", fn(testStr));
console.log("target:", fn(testStr2));
console.log("target:", fn(testStr3));
console.log("target:", fn(testStr4));
console.log("target:", fn(testStr5));
```

## 提取 URL 参数

写一个提取 URL 参数的 js 方法，例如：
要求：只识别 queryParam，排除 hash 的干扰

写一个提取 url 参数的 js 方法，要求：只识别 queryParam，排除 hash 的干扰
输出结果?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4

let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4"

```
正则表达式 `(\?.+)` 用于匹配包含问号 `?` 后面的任何字符的文本。下面是具体的解释：

- `(` 和 `)`：括号用于创建一个捕获组，将匹配的部分捕获到一个结果中，以供后续引用。
- `\?`：这部分匹配一个问号字符 `?`。需要注意的是，问号在正则表达式中是一个特殊字符，表示零次或一次重复，因此需要使用反斜杠 `\` 进行转义，以匹配字面的问号。
- `.+`：这部分匹配一个或多个任意字符。其中 `.` 匹配任何字符（除了换行符），而 `+` 表示匹配一个或多个前面的表达式。

综合起来，正则表达式 `(\?.+)` 匹配包含问号后面的任意字符的文本，并将这部分文本捕获到捕获组中。例如，如果你有一个字符串 `https://example.com/path?query=123`，使用这个正则表达式，将匹配 `?query=123` 部分并捕获到捕获组中。
```

```js
// (\?.+) 匹配 ? 后面的任意字符，且至少匹配一个字符，使用括号捕获这个部分，以便后面能够提取查询参数。
const url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4";
const regex = /(\?.+)/;
const match = url.match(regex);
console.log("match", match[1]);
```

```js
/*
[?&] 表示匹配?或&字符，这是URL中查询参数的分隔符。
[^?&]+ 表示匹配一个或多个非?和&字符，也就是匹配参数名和参数值。
= 表示匹配=字符，表示参数名和参数值的分隔符。
[^?&]+ 表示再次匹配一个或多个非?和&字符，表示参数值。
*/
let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4";
function getParamFromURL2(url, key) {
  const list = new Map();
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  if (arr) {
    console.log("arr", arr);
    arr.forEach((item) => {
      let splitArr = item.substring(1).split("=");
      let key = decodeURIComponent(splitArr[0]);
      let val = decodeURIComponent(splitArr[1]);
      list.set(key, val);
    });
  }
  // 有一个问题：map会重复
  console.log("list:", list);
  return list.get(key);
}

console.log(getParamFromURL2(url, "a"));

// 有一个问题：map会重复,用symbol,但是带来读取问题
let url = "https://alibaba.com?a=1&b=2&c=3#/abc/def?a=2&b=3&c=4";
function getParamFromURL2(url, key) {
  const list = new Map();
  const testObj = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  if (arr) {
    console.log("arr", arr);
    arr.forEach((item) => {
      let splitArr = item.substring(1).split("=");
      let key = decodeURIComponent(splitArr[0]);
      let val = decodeURIComponent(splitArr[1]);
      list.set(key, val);
      let objKey = Symbol(key);
      testObj[objKey] = val;
    });
  }
  console.log("list:", list);
  console.log("testObj:", testObj);
  console.log("obj:", Object.getOwnPropertyNames(testObj));
  console.log("obj:", Object.getOwnPropertySymbols(testObj));
  return list.get(key);
}

console.log(getParamFromURL2(url, "a"));
```

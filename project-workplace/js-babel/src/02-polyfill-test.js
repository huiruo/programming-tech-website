/*
通过配合使用@babel/preset-env之后，我们可以来看看编译之后生成了什么？

// polyfill/.babelrc
{
  "presets": [
    [
      "@babel/preset-env", {
        "useBuiltIns": "usage", 	// 其他两个选项 'entry/false'
        "corejs": 3 							// 如果需要使用includes，需要安装corejs@3版本
      }
    ]
  ]
}
*/
const sym = Symbol();

const promise = Promise.resolve();

const arr = ["arr", "yeah!"];
const check = arr.includes("yeah!");

console.log(arr[Symbol.iterator]());
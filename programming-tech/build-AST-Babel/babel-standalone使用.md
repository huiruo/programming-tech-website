---
title: babel-standalone使用
sidebar_position: 6
---

通常，我们使用官方或是第三方脚手架or打包工具（Webpack、Browserify、Gulp），通过配置化引入babel-loader，在编译阶段就完成了直接翻译，所以，这个库是否多余？

其实不然，这个工具还是有其使用场景的
1. 调试React源码；
2. 在线实时javascript编辑器网站（如 JSFiddle, JS Bin, REPL on the Babel ）；
3. 直接嵌入到应用中，例如：V8 javascript 引擎；

babel-standalone.js是为非NodeJS环境而生的babel库，可以直接在html中，通过
`<script src='...'></script>`方式被引入，它包含了所有babel标准的plugins和presets

## 调试react
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<style>
  .btn {
    margin-right: 10px;
    border: 0px;
    color: white;
    background-color: rgb(99, 99, 242);
  }
</style>

<body>
  <script src="./react.development18.js"></script>
  <script src="./react-dom.development18.js"></script>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React

    function Test() {
      const [num1, setNum1] = useState(0);
      const [num2, setNum2] = useState(10);
      const onClickText = () => {
        console.log("update==:start");
        setNum1(num1 + 1);
        console.log("update==:num1:", num1);
        setNum2(num2 + 1);
        console.log("update==:num2,", num2);
      }

      const asyncUpdate = () => {
        setTimeout(() => {
          console.log("update==:async update start");
          setNum1(num1 + 1);
          console.log("update==:async update num1:", num1);
          setNum2(num2 + 1);
          console.log("update==:async update num2:", num2);
        }, 0);
      };

      const flushSyncUpdate = () => {
        setTimeout(() => {
          console.log("update==:async update start");
          ReactDOM.flushSync(() => {
            setNum1(num1 + 1);
            console.log("update==:async update num1:", num1);
          });
          ReactDOM.flushSync(() => {
            setNum2(num2 + 1);
            console.log("update==:async update num2:", num2);
          });
        }, 0);
      };

      React.useEffect(() => {
        console.log('useEffect-->1');
      }, [])

      React.useLayoutEffect(() => {
        console.log('useLayoutEffect-->2');
      }, [])

      console.log("update==:-----------------------------");

      return (
        <div>
          <p>num1 = {num1}</p>
          <p>num2 = {num2}</p>
          <button onClick={onClickText}>update</button>
          <button onClick={asyncUpdate}>asyncUpdate</button>
          <button onClick={flushSyncUpdate}>flushSyncUpdate</button>
        </div>
      )
    }

    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(<Test />);
  </script>
  </script>
</body>

</html>
```

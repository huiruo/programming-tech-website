---
title: 使用-promise模拟请求
sidebar_position: 4
---

```js
function requestWork(val) {
  console.log(val)
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      const res = {
        code: 200,
        message: 'ok',
        data: {}
      }

      const { code, message } = res

      if (code === 200) {
        console.log('Request success', res);
        resolve(res)
      } else {
        console.log('Request failed');
        reject(message)
      }
    }, 2000);
  }).catch((error) => {
    console.log(error)
  });
}

requestWork('Use normal function request')

const requestWorkUseAsync = async () => {
  const res = await requestWork('requestWorkUseAsync')
  console.log('requestWorkUseAsync return', res)
}

requestWorkUseAsync()
```

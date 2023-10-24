## axios如何取消请求
1. 创建一个 CancelToken 的实例,它有一个 executor 函数,可以通过调用 executor 参数中的 cancel 函数来取消请求。
2. 在 axios 请求配置中指定 cancelToken 属性,将 CancelToken 实例传递进去。
3. 当我们需要取消请求时,调用 CancelToken 实例的 cancel() 方法即可取消对应的请求。
4. axios 检测到配置的 cancelToken 被取消,就会取消掉这个请求,并在错误回调中返回一个 Cancel 错误。

axios 内部会监听 cancelToken 实例的 cancel 信号,一旦触发就会跳出队列,取消对应请求的执行。
示例代码:
```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user', {
  cancelToken: source.token
}).catch(function(thrown) {
  if(axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

// 取消请求
source.cancel('Operation canceled by the user.');
```

### 在 React 中的实现：
```js
// axiosInstance.js
import axios from 'axios';

const instance = axios.create();

export default instance;
```

```js
// YourComponent.js
import React, { useState } from 'react';
import axiosInstance from './axiosInstance';

function YourComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const source = axiosInstance.CancelToken.source();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/some-endpoint', {
        cancelToken: source.token
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      if (axiosInstance.isCancel(error)) {
        console.log('请求被取消：', error.message);
      } else {
        // 处理其他错误
      }
      setLoading(false);
    }
  };

  const cancelRequest = () => {
    source.cancel('请求被用户取消');
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>{data}</p>}
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={cancelRequest}>取消请求</button>
    </div>
  );
}

export default YourComponent;
```

### 原理
Axios 取消请求的原理是基于底层网络请求库（如 XMLHttpRequest 或 Fetch）提供的中止机制。当调用取消令牌的 cancel 方法时，Axios 会触发中止底层的网络请求，从而终止正在进行的请求过程。

1. 创建 CancelToken 对象： 在发起请求之前，可以通过 axios.CancelToken.source() 方法创建一个 CancelToken 对象，并获取其中的 token。这个 token 是一个用于标识该请求的令牌。
2. 关联 CancelToken： 将创建的 CancelToken 对象中的 token 关联到请求的配置中，通过 cancelToken 参数。这告诉 Axios 在取消令牌触发时要取消这个请求。
3. 取消请求： 当想要取消请求时，调用 CancelToken 对象中的 cancel 方法，并提供一个取消的原因。这会触发 Axios 内部的逻辑，导致底层的网络请求被中止。
4. 捕获取消错误： 如果请求在取消前已经发出，Axios 会抛出一个名为 Cancel 的错误。可以使用 axios.isCancel(error) 来检查是否是取消错误。在 .catch 部分处理这个取消错误。

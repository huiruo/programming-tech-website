## 1.拿旧值
```js
const [testData, setTestData] = useState(1)

/** oldVal 为之前的值,return 为设置的新值 */
setTestData((oldVal) => {
  return oldVal + 1
})
```

## 2.拿最新值
useRef 可以的

- useRef.current则更像是相对于render函数的一个全局变量，每次他会保持render的最新状态。
- useState值的更新会触发组件重新渲染，而useRef的current不会出发重渲染。

### 封装成函数
```js
import { useState, useRef, useEffect } from 'react';

export function useCallbackState(state: any) {
  const cbRef = useRef();
  const [data, setData] = useState(state);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [
    data,
    function (val: any, callback: any) {
      cbRef.current = callback;
      setData(val);
    },
  ];
}
```
使用:
```js
import { useCallbackState } from '@/utils/callbackState';
import { Input } from 'antd';
const {Search} =Input;

const Index: React.FC = () => {
  const [searchParam, setSearchParam] = useCallbackState();

  const onSearch = (params: any) => {
    setSearchParam({ ...searchParam, title: params }, function (data: any) {
        //在回调函数里 会得到更新后的值
        console.log(data);
    });
  };
  return (
   <Search
    allowClear
    enterButton="搜索"
    onSearch={onSearch}
  />);
}
export default Index;
```

需要随时获取最新值的地方用 ref ，其他地方用 state
```js
function useStateWithRef(initialState) {
const [state, rawSetState] = useState(initialState)
const ref = useRef(state)
const setState = useCallback((value) => {
  ref.current = value
  rawSetState(value)
  }, [])
  return [state, setState, ref]
}

const [state, setState, stateRef] = useStateWithRef(1)
```

## useEffect模拟生命周期
* 第二个参数传递一个空数组, 模拟 componentDidMount

* 第二个参数传递依赖项，模拟 componentDidUpdate

* 第二个参数传递一个空数组，并且里面通过return的形式去调用一个方法，模拟 componentWillUnmount

* React.useMemo
```js
useMemo(() => ()=>{
  console.log('组件dom节点没有渲染之前调用一次');
}, []);

const renderDom = useMemo(() => ()=>{
  console.log('组件dom节点没有渲染之前根据依赖参数props调用');
}, [props])
```
* React.useCallback
```js
const handleClick = React.useCallback(() =>{
  console.log('监听事件通过钩子函数包裹，优化性能');
},[]);
```

```js
// 1. componentDidMount 和 componentWillUnmount
// 通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里
useEffect(()=>{
    console.log('componentDidMount')
    return () => {
        console.log('will unmount');
    }
}, [])

// 2. componentDidUpdate 1
useEffect(()=>{
  document.title = `You clicked ${count} times`;
  return()=>{
    // componentWillUnmount 执行的内容       
  }
}, [count])

// 3. componentDidUpdate 2
useEffect(() => console.log('mounted or updated'));

// shouldComponentUpdate, 只有 Parent 组件中的 count state 更新了，Child 才会重新渲染，否则不会。
/*
* React.memo 包裹一个组件来对它的 props 进行浅比较,但这不是一个 hooks，因为它的写法和 hooks 不同,其实React.memo 等效于 PureComponent，但它只比较 props。
* */ 
function Parent() {
  	const [count,setCount] = useState(0);
  	const child = useMemo(()=> <Child count={count} />, [count]);

  	return <>{count}</>
}

function Child(props) {
    return <div>Count:{props.count}</div>
}
```
---
title: api-useMemo
sidebar_position: 55
---

# useMemo
对于useMemo(callback, [depA])，memoizedState保存[callback(), depA]

* mount 时：在 memorizedState 上放了一个数组，第一个元素是传入的回调函数，第二个是传入的 deps。
* update 时：更新的时候把之前的那个 memorizedState 取出来，和新传入的 deps 做下对比，如果没变，那就返回之前的回调函数，否则返回新传入的函数。


会在组件第一次渲染的时候执行，之后会在其依赖的变量发生改变时再次执行。
可以把它理解成vue里面的computed，是一种数据的缓存，而这个缓存依赖后面的第二个参数数组，如果这个数组里面传入的数据不变，那么这个useMemo返回的数据是之前里面return的数据。
返回对象： 使用 useMemo 对对象属性包一层。

两个参数：
第一个参数是个函数，返回的对象指向同一个引用，不会创建新对象；
第二个参数是个数组，只有数组中的变量改变时，第一个参数的函数才会返回一个新的对象。
```js
// count 作为依赖值传递进去，此时仅当 count 变化时才会重新执行 getNum 。
function Example() {
    const [count, setCount] = useState(1);
    const [val, setValue] = useState('');
 
    const getNum = useMemo(() => {
        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    }, [count])

    return <div>
        <h4>总和：{getNum()}</h4>
        <div>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <input value={val} onChange={event => setValue(event.target.value)}/>
        </div>
    </div>;
}
```

## useMemo和useCallback相同点和区别
useMemo和useCallback都会在组件第一次渲染的时候执行，之后会在其依赖的变量发生改变时再次执行；

并且这两个hooks都返回缓存的值，useMemo返回缓存的变量，useCallback返回缓存的函数。
相同点：
* useCallback 和 useMemo 参数相同，第一个参数是函数，第二个参数是依赖项的数组。
* useMemo、useCallback 都是使参数（函数）不会因为其他不相关的参数变化而重新渲染。
* 与 useEffect 类似，[] 内可以放入你改变数值就重新渲染参数（函数）的对象。如果 [] 为空就是只渲染一次，之后都不会渲染

主要区别是:
* React.useMemo 将调用 fn 函数并返回其结果，而 React.useCallback 将返回 fn 函数而不调用它。

## useCallback和useMemo是不是值得大量使用？
我的意见是看 rerender 次数，是不是高频渲染简单组件，是的话一定加上，对于其他场景：

高频复杂组件：说明你设计的有问题，应该解耦一些逻辑，变成简单组件
低频复杂组件：随意
低频简单组件：随意

首先题主已经很明确了，useCallback，useMemo以及React.memo都是为了性能优化而存在的。这一点是正确的。稍微详细展开来讲，React.memo（和之前class API中提供的ShouldComponentUpdate基本一致）主要是为了在父组件渲染时防止对没有状态变化的子组件进行不必要的渲染，可以参考官方文档中的此例。

useMemo则是为了缓存在渲染过程中比较繁重的计算过程，官方文档的例子中也用了computeExpensiveValue这个命名来隐喻这个用法。

useCallback稍微有点特殊，虽说这就是一个useMemo的语法糖，但是一般js上创建一个函数需要的时间并不至于要缓存的程度，那为什么要专门给缓存函数的创建做一个语法糖呢？这就跟React.memo有关系了。

React.memo的默认第二参数是浅对比（shallow compare）上次渲染的props和这次渲染的props，如果你的组件的props中包含一个回调函数，并且这个函数是在父组件渲染的过程中创建的（见下例），那么每次父组件（下例中的MyComponent）渲染时，React是认为你的子组件（下例中的Button）props是有变化的，不管你是否对这个子组件用了React.memo，都无法阻止重复渲染。这时就只能用useCallback来缓存这个回调函数，才会让React（或者说js）认为这个prop和上次是相同的。
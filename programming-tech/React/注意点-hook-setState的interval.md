---
title: 注意点-hook-setState的interval
sidebar_position: 15
---

## 参考：
https://juejin.cn/post/6846687599625519111

## 闭包带来的坑,不能读取到最新的值
因为每次 render 都有一份新的状态，因此上述代码中的 setTimeout 使用产生了一个闭包，捕获了每次 render 后的 state，也就导致了输出了 0、1、2。如果你希望输出的内容是最新的 state 的话，可以通过 useRef 来保存 state。前文讲过 ref 在组件中只存在一份，无论何时使用它的引用都不会产生变化，因此可以来解决闭包引发的问题。

## 实例：
`setCount(count + 1)`
* 将会导致count 一直是2,
* 需要使用 setCount(val => val + 1) 解决赋值问题
* 如果要在 interval获取最新值，必须使用useRef
```js
const hasServiceNumberDefault = { isHasServiceNumber: false, msg: '' }
const smsDefault = 'Message not received yet...'
let intervalId: any = 0
let maxRequestTimes = 20

export const CountrySelect = ({ service }: CountrySelectProps) => {
  const countRef = useRef(0);
  const [count, setCount] = useState(0);

  const resetSmsRequest = () => {
    if (intervalId) {
      setIsClickGetMsg(false)
      setCount(0)
      countRef.current = 0
      clearInterval(intervalId)
    }
  }


  const onGetMsg = () => {
    if (!hasServiceNumber.isHasServiceNumber) {
      toast.info('请选择国家获取号码信息')
      return
    }

    if (!serviceNumber?.Number) {
      toast.info('暂无号码')
      return
    }

    getMsg(serviceNumber.Number, serviceNumber.SecurityId)
  }

  const getMsg = async (number: string, sid: string) => {
    try {
        // ...
    } catch (error) {
      console.error('NetWork Error', error)
      toast('NetWork Error', {
        type: 'error',
      })
    }
  }

  const startInterval = () => {
    let id = setInterval(() => {
      if (countRef.current < maxRequestTimes) {
        onGetMsg()
        setCount(val => {
          countRef.current = val;
          return (val + 1)
        })
      } else {
        console.log('close req')
        clearInterval(intervalId)
      }
    }, 14000);

    intervalId = id
  }

  const handleGetMsg = () => {
    setIsClickGetMsg(true)
    onGetMsg()
    if (countRef.current) {
      countRef.current = 0
      setCount(0)
    }

    if (intervalId) {
      clearInterval(intervalId)
      startInterval()
    } else {
      startInterval()
    }
  }

  useEffect(() => {
    if (service) {
      setIsHasServiceNumber(hasServiceNumberDefault)
      setServiceNumber({} as serviceNumberType)
      setCountries([])
      setSms(smsDefault)
      setCountryCode('')
      fetchCountryCodes(service)
      resetSmsRequest()
    }
  }, [service])

  return (
    <Box mt="20px">
      {count}
    </Box>
  )
}
```

## 原因
当定时器setInterval每一次执行时，都是从此作用域链(挂载时形成)寻找count值，因为挂载期间count的初始值始终为0，所以定时器每一次执行开始前count都为0，执行结束后count都为1。
尽管由于定时器的存在，组件始终会一直重新渲染，但定时器的回调函数是挂载期间定义的，所以它的闭包永远是对挂载时Counter作用域的引用，故count 永远不会超过 1。

并且 Function Component 每次 render 都是重新执行 Function (产生新的局部变量，闭包)，第一次创建的闭包和第二次创建的闭包没有任何关系。
所以，当程序运行起来是，setInterval 内的闭包引用到的一直是最初的 count，而 useState 得到的是最新的 count。这是两处代码打印出来结果不一致的根本原因。

```
组件被调用时，会执行 useState 方法。从 react 源码上看，React 内部维护了一个 hook 的链表，链表表头存在 currentlyRenderingFiber.memoizedState，节点通过 next 链接。
```

借助 useRef，每次都把最新的值赋予 countRef.current = count;，闭包内原本获取 count 的位置，改成 countRef.current。这时候闭包引用的是一个 Object，当它被真正运行起来时就是通过对象的引用而不是一个基础数据类型的值。

* 方案一
```js
useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量    }, 1000);
    return () => clearInterval(id);
  }, []);
```

* 方案二：给useEffect添加count依赖
```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 这个 effect 依赖于 `count` state    }, 1000);
    return () => clearInterval(id);
  }, [count]); // 🔴 Bug: `count` 没有被指定为依赖
  return <h1>{count}</h1>;
}
```

由于给useEffect添加了第二个依赖参数count，每一次定时器的执行改变了count值后，组件都会重新渲染，且effect都会重新执行，所以新的作用域链会生成(见上图右侧)，此后的每一次重新渲染，访问的都是新Counter作用域中的新count值，即：1、2、3...

* 方案3
万不得已的情况下，如果你想要类似 class 中的 this 的功能，你可以 使用一个 ref 来保存一个可变的变量。然后你就可以对它进行读写了
useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内持续存在。
```js
function Counter() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  useEffect(() => {
    countRef.current += 1; // *
  })

  useEffect(() => {
    const id = setInterval(() => {
      console.log(countRef.current)
      setCount(countRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <div>count: {count}</div>
    </div>
  )
}
```

* 方案五：局部变量法
```js
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let counterMutable = count;
    const id = setInterval(() => {
      counterMutable++
      setCount(counterMutable)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <div>count: {count}</div>
    </div>
  )
}
```

组件挂载时，在effect中保存外部作用域的count值，setInterval回调中的setCount在每一次执行前都会把counterMutable加1，并用counterMutable去更新count，这保证了count的值会一直正常递增。
setCount的作用之一是重新渲染组件，即重新执行函数组件，重新执行函数后的新count值都会在新counter作用域中（见上图右侧），不会改变原来counter作用域中count的值，但定时器却只会使用挂载时的作用域链中的值。
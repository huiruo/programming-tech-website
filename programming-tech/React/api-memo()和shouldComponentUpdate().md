---
title: api-memo()和shouldComponentUpdate()
sidebar_position: 51
---

# React.memo()和shouldComponentUpdate()
React.memo(type, compare)是一个高阶组件，接收两个参数，第一个参数是需要优化的组件，第二个是非必填的自定义的compare函数，如果不传则会使用默认的compare函数。通过compare比较新旧props是否“相同”，选择是重新渲染组件还是跳过渲染组件的操作并直接复用最近一次渲染的结果。

组件默认情况下其只会对 props 做浅层对比，遇到层级比较深的复杂对象时，表示力不从心了。对于特定的业务场景，可能需要类似 shouldComponentUpdate 这样的 API，这时通过 memo 的第二个参数来实现：

`注意：`
* shouldComponentUpdate return true 就会render
```js
// 在render函数调用前判断：如果前后state中Number不变，通过return false阻止render调用
shouldComponentUpdate(nextProps,nextState){
    if(nextState.Number == this.state.Number){
      return false
    }
}
```

* memo 返回 true 时，不会触发render
```js
import React from "react";

function Child({seconds}){
    console.log('I am rendering');
    return (
        <div>I am update every {seconds} seconds</div>
    )
};

function isEqual(prevProps, nextProps) {
    if(prevProps.seconds===nextProps.seconds){
        // isEqual 返回 true 时，不会触发 render
        return true
    }else {
        // false render
        return false
    }

}

export default React.memo(Child,isEqual)
```

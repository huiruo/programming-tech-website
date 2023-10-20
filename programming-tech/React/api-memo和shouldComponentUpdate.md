---
title: api-memo和shouldComponentUpdate
sidebar_position: 51
---

## React.memo()和shouldComponentUpdate()
React.memo(type, compare)是一个高阶组件，接收两个参数，第一个参数是需要优化的组件，第二个是非必填的自定义的compare函数，如果不传则会使用默认的compare函数。通过compare比较新旧props是否“相同”，选择是重新渲染组件还是跳过渲染组件的操作并直接复用最近一次渲染的结果。

组件默认情况下其只会对 props 做浅层对比，遇到层级比较深的复杂对象时失效。对于特定的业务场景，可能需要类似 shouldComponentUpdate 这样的 API，这时通过 memo 的第二个参数来实现：

### 注意：shouldComponentUpdate return true 就会render
在render函数调用前判断：如果前后state中Number不变，通过return false阻止render调用
```js
shouldComponentUpdate(nextProps,nextState){
    if(nextState.Number == this.state.Number){
      return false
    }
}
```

### memo返回true时，不会触发render
React.memo，React将跳过渲染组件的操作并直接复用最近一次渲染的结果。

注意，React.memo 仅检查 props 的变更，React.memo包裹的组件其实现中拥有useState或useContext的 hook，当context/state变化时，它仍会重新渲染。

### memo源码
传入两个参数，第一个是 React 组件，第二个是一个比较函数，函数参数是旧的 props 和新的 props，返回值如果为 false 表示重新渲染该组件。
```js
function memo(type, compare) {
{
    if (!isValidElementType(type)) {
    error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
}

var elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
};

{
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
    enumerable: false,
    configurable: true,
    get: function () {
        return ownName;
    },
    set: function (name) {
        ownName = name; // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.memo((props) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.

        if (!type.name && !type.displayName) {
        type.displayName = name;
        }
    }
    });
}

return elementType;
}
```

初次渲染:updateMemoComponent或者 updateSimpleMemoComponent 进行处理

updateMemoComponent和updateSimpleMemoComponent内部根据`compare`或者`shallowEqual`对比 props, 来确定memo包裹的组件是否命中 bailoutOnAlreadyFinishedWork.

### 在beginWork中, 通过updateMemoComponent对`REACT_MEMO_TYPE`类型的元素 进行处理
* 如果compare === null 并且 isSimpleFunctionComponent===true(即sampleMemoComponent) <br/>
则修改fiber.tag === SimpleMemoComponent,在更新阶段使用 updateSimpleMemoComponent 更新

* 如果不满足上面的条件, 则使用createFiberFromTypeAndProps创建子fiber,继续向下调和子树
```js
function updateMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
if (current === null) {
    var type = Component.type;

    if (isSimpleFunctionComponent(type) && Component.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
    Component.defaultProps === undefined) {
    var resolvedType = type;

    {
        resolvedType = resolveFunctionForHotReloading(type);
    } // If this is a plain function component without default props,
    // and with only the default shallow comparison, we upgrade it
    // to a SimpleMemoComponent to allow fast path updates.


    workInProgress.tag = SimpleMemoComponent;
    workInProgress.type = resolvedType;

    {
        validateFunctionComponentInDev(workInProgress, type);
    }

    return updateSimpleMemoComponent(current, workInProgress, resolvedType, nextProps, renderLanes);
    }

    {
    var innerPropTypes = type.propTypes;

    if (innerPropTypes) {
        // Inner memo component props aren't currently validated in createElement.
        // We could move it there, but we'd still need this for lazy code path.
        checkPropTypes(innerPropTypes, nextProps, // Resolved props
        'prop', getComponentNameFromType(type));
    }
    }

    console.log('%c=updateMemoComponent调用createFiberFromTypeAndProps-->return', 'color:yellow', { child });
    var child = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
    child.ref = workInProgress.ref;
    child.return = workInProgress;
    workInProgress.child = child;
    return child;
}

{
    var _type = Component.type;
    var _innerPropTypes = _type.propTypes;

    if (_innerPropTypes) {
    // Inner memo component props aren't currently validated in createElement.
    // We could move it there, but we'd still need this for lazy code path.
    checkPropTypes(_innerPropTypes, nextProps, // Resolved props
        'prop', getComponentNameFromType(_type));
    }
}

var currentChild = current.child; // This is always exactly one child

var hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes);

if (!hasScheduledUpdateOrContext) {
    // This will be the props with resolved defaultProps,
    // unlike current.memoizedProps which will be the unresolved ones.
    var prevProps = currentChild.memoizedProps; // Default to shallow comparison

    var compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;

    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
} // React DevTools reads this flag.


workInProgress.flags |= PerformedWork;
var newChild = createWorkInProgress(currentChild, nextProps);
newChild.ref = workInProgress.ref;
newChild.return = workInProgress;
workInProgress.child = newChild;
return newChild;
}
```

### 例子
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

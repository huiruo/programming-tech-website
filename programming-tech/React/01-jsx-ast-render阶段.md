---
title: jsx-ast-render阶段
sidebar_position: 1
---

## 调用流程图
基于18
```mermaid
flowchart TD
A1("ReactDOM.createRoot(document.getElementById('root'))")--1FiberRoot创建-->A2("return new ReactDOMRoot(root)")-->1FiberRoot-->A6("root=createContainer(container")-->A7("return createFiberRoot(containerInfo")--1FiberRoot初始化相关只调用一次-->A8("root=new FiberRootNode(containerInfo")

A7--2root.current=uninitializedFiber-->A11("uninitializedFiber=createHostRootFiber(tag,isStrictMode)")-->A12("return createFiber(HostRoot")

A1--2开启render-->A3("root.render(<组件>)")-->A4("ReactDOMRoot.prototype.render")
A4--开始渲染,注意非批量-->A5("updateContainer(children, root")
```

## 接上面updateContainer
fiber 协调过程,构建fiber树的阶段可中断
### 流程图
```mermaid
flowchart TD
A1("updateContainer(children, root")-->A2("root=scheduleUpdateOnFiber(current$1,lane")--> A3("ensureRootIsScheduled(root,eventTime)")

A3--"ensureRootIsScheduled(root,currentTime)函数中"-->ifB{{"更新方式?newCallbackPriority ===SyncLane"}}

D1("scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null,root))")
D2("newCallbackNode=scheduleCallback$1(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null,root))")

ifB--true异步更新legacy模式-->D1
ifB--初次渲染默认false,同步更新concurrent模式-->D2

D2-->D3("scheduleCallback$1")-->D4("performConcurrentWorkOnRoot(root, didTimeout){<br> exitStatus = renderRootSync(root,lanes)}")

D4--1-->D5("renderRootSync(root,lanes)")

D4--"2.exitStatus!==RootInProgress"-->C1("finishConcurrentRender(root,exitStatus)render阶段结束,commit阶段前")

D5(workLoopSync开始循环-beginWork开始)-->A0Aif
A0Aif{{workInProgress!=null?}}--不为null-->E1
A0Aif--为null-->endW(结束当前循环)

subgraph render1[构建fiber树/协调阶段:render是一个深度优先遍历的过程核心函数beginWork和completeUnitOfWork]

  E1(performUnitOfWork:深度遍历)

  E1--1.遍历到的节点执行beginWork创建子fiber节点-->E2(beginWork$1处理完返回next)

  E1--2.若当前节点不存在子节点:next=null-->E6B(completeUnitOfWork)
  
  E2--current=null初始化:tag进入不同case-->E6A(case:HostComponent为例)-->E6A1(updateHostComponent$1)-->E6A2(reconcileChildren-diff算法)--current!=null-->E6A3(reconcileChildFibers)

	%% subgraph beginWork2[beginWork第二阶段]
	E6A2--current==null-->z1("mountChildFibers:beginWork第二阶段")-->z2(ChildReconciler)--case-->z3(placeSingleChild)
	%% end

  E2-.current!=null更新流程.->E51(attemptEarlyBailoutIfNoScheduledUpdate)-->E52(bailoutOnAlreadyFinishedWork)-->E53(cloneChildFibers)

  E6B-->E6B1[为传入的节点执行completeWork:执行不同tag]--case:HostComponent并且current!=null-->E6B2(update流程:updateHostComponent)-->E6A1A(prepareUpdate:对比props)-->E6A1B(diffProperties)-->E6A1C(markUpdate:赋值更新的flags也叫update)

  E6B1--case:HostComponent-current=null-->E6B3(为fiber创建dom:createInstance)
  E6B3--case:HostComponent-current=null-->E6B4(add child dom:appendAllChildren)
  E6B3-->E6B3A(createElement)-->E6B3B(document.createElement)

  E53-->createWorkInProgress
  E53-.tag类型进入不同case.->E6A

	%% subgraph render2[构建FiberNode]
	E6A3-.根据子节点类型创建fiber节点.->o1(reconcileSingleElement) -->o2(createFiberFromElement) --> o3(createFiberFromTypeAndProps) --fiber.type也是在这里赋值--> o4(createFiber)--> o5(return new FiberNode)
	%% end
end
```

### beginWork前置工作和beginWork进行中
* performConcurrentWorkOnRoot(root, didTimeout)-->renderRootSync<br/>
beginWork前置工作
```js
function renderRootSync(root, lanes) {
  // 省略
    do {
    try {
      console.log('%c=render阶段准备:', 'color:red', 'renderRootSync()调用workLoopSync()-root:', { root });
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);
  // 省略
}

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

* performUnitOfWork-->`beginWork$1`开启beginWork
* `mountChildFibers`与`reconcileChildFibers`这两个方法的逻辑基本一致。唯一的区别是：reconcileChildFibers 会为生成的 Fiber 节点带上effectTag属性，而 mountChildFibers 不会。
```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    // 对于 mount 的组件
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    // 对于 update 的组件
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}
```

### render阶段completeUnitOfWork

### render阶段结束,commit阶段前:此时fiber树生成
```js
function performConcurrentWorkOnRoot(root, didTimeout) {
  // 上面的render阶段流程
  var exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);

  // 省略
  // 这里将会开启commit阶段的前置工作
  finishConcurrentRender(root, exitStatus, lanes)
  // 省略
}
```

## 构建AST
### jsx语法的html结构通过babel将结构解析转换为ast语法树结构
* react 18中：使用 babel将jsx代码转换为root.render()调用,此时得到转化后的Ast树结构
* react17中 使用 babel将jsx代码转换为React.createElement()调用,此时得到转化后的Ast树结构

### 简单实例1:babel将jsx代码转换为React.createElement()调用
测试：https://www.babeljs.cn/repl
```jsx
// jsx
const element = <h1 style = {{"color": "red"}}>123
    <div>test</div>
</h1>

// babel 编译过后生成的代码
const element = /*#__PURE__*/React.createElement("h1", {
  style: {
    "color": "red"
  }
}, "123", /*#__PURE__*/React.createElement("div", null, "test"));
```

### 简单实例2:直接用转化后的代码去调用React.createElement
渲染代码：example-code\例-1-jsx-ast-r17.html
```html
<script>
const container = document.getElementById('root');
const element = React.createElement(
    'div',
    { className: 'red' },
    'Click Me'
)
console.log('createElement 转化后ast树的结构:', element)
ReactDOM.render(element, container)
/*
{
    $$typeof: Symbol(react.element)
    key: null
    props:
    children: "Click Me"
    className: "red"
    [[Prototype]]: Object
    ref: null
    type: "div"
    _owner: null
    _store: {validated: false}\
}
*/
</script>
```

### 简单实例3：使用babel
渲染代码：example-code\例4-在html-使用babel转义jsx.html
```html
<script type="text/babel">
  function Test() {
    return (
      <div className="red">Click Me</div>
    )
  }

  ReactDOM.render(<Test />, document.getElementById('root'))
</script>
```

## 完整测试例子
例子基于react18,先看babel 的执行函数
```js
function transform(code, options) {
  console.log('=Babel-transform-参数:', { code })
  const babel_transform = Babel.transform(code, processOptions(options));
  console.log('=Babel-返回:', babel_transform)
  return babel_transform
}
```

### 测试代码
```html
<script type="text/babel">
  console.log('=Babel:', Babel)
  function Test() {
    console.log('test-render')
    const [data, setData] = React.useState('改变我')
    const [showDiv, setShowDiv] = React.useState(false)

    const onClickText = () => {
      console.log('=useState=onClick');
      setData('努力哦')
      setShowDiv(!showDiv)
    }

    const onClickText2 = () => {
      console.log('=useState=onClick:', data);
    }

    React.useEffect(() => {
      console.log('=副作用-useEffect-->运行');
    }, [])

    React.useLayoutEffect(() => {
      console.log('=副作用-useLayoutEffect-->运行');
    }, [])

    return (
      <div id='div1' className='c1'>
        <button onClick={onClickText} className="btn">Hello world,Click me</button>
        <span>{data}</span>
        {showDiv && <div>被你发现了</div>}
        <div id='div2' className='c2'>
          <p>测试子节点</p>
        </div>
      </div>
    )
  }

  const root = ReactDOM.createRoot(document.getElementById('root'))
  console.log("=app=root:", root)
  root.render(<Test />);
</script>
```

### mockData-babel返回.json
[mockData-babel返回code函数](https://github.com/huiruo/programming-tech-website/blob/main/programming-tech/Vue/02-mockData-compile%E8%B0%83%E7%94%A8baseParse%E8%BF%94%E5%9B%9East.json)
```json
{
"metadata":"",
"options":"",
"ignored":"",
"code":"",
"ast":"",
"map":""
}
```

### code函数
每个节点都调用createElement(),并且嵌套结构都是和html节点一样
```js
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

console.log('=Babel:', Babel);
function Test() {
  console.log('test-render');

  var _React$useState = React.useState('改变我'),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    data = _React$useState2[0],
    setData = _React$useState2[1];

  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    showDiv = _React$useState4[0],
    setShowDiv = _React$useState4[1];

  var onClickText = function onClickText() {
    console.log('=useState=onClick');
    setData('努力哦');
    setShowDiv(!showDiv);
  };

  var onClickText2 = function onClickText2() {
    console.log('=useState=onClick:', data);
  };

  React.useEffect(function () {
    console.log('=副作用-useEffect-->运行');
  }, []);

  React.useLayoutEffect(function () {
    console.log('=副作用-useLayoutEffect-->运行');
  }, []);

  return React.createElement(
    'div',
    { id: 'div1', className: 'c1' },
    React.createElement(
      'button',
      { onClick: onClickText, className: 'btn' },
      'Hello world,Click me'
    ),
    React.createElement(
      'span',
      null,
      data
    ),
    showDiv && React.createElement(
      'div',
      null,
      '\u88AB\u4F60\u53D1\u73B0\u4E86'
    ),
    React.createElement(
      'div',
      { id: 'div2', className: 'c2' },
      React.createElement(
        'p',
        null,
        '\u6D4B\u8BD5\u5B50\u8282\u70B9'
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
console.log("=app=root:", root);
root.render(React.createElement(Test, null));
```

### createElement()
```js
function createElement(type, config, children) {
  // console.log('=development调用createElement构建Ast树:', { type, config, children })
  console.log('%c=development调用createElement-1:type', 'color:blueviolet', type, { config, children })
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  const reactElementRes = ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  console.log('=development调用createElement-2:返回:', reactElementRes)
  return reactElementRes
}
```

## 流程2：入口-此时还不是fiber树,没有开启render阶段
```js
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(<Test />);
</script>
```

createRoot-->ReactDOMRoot
```js
function createRoot(container, options) {
  return new ReactDOMRoot(root);
}

ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function (children) {
    console.log('%c ==一切开始3:', 'color:red', 'ReactDOMRoot.prototype.render调用updateContainer()开启render阶段==', children);
    var root = this._internalRoot;
}
```

## 17版本入口函数和18不一样
在18中直接调用以下函数，是不用走下面的流程的,18直接流程图的流程构建fiber和更新
```js
ReactDOM.createRoot(domRoot).render(Ast)
```

以下是17或则在18中调用ReactDOM.render(ast,domRoot)的流程

### 17版本legacyRenderSubtreeIntoContainer()
根据 container 是否存在 root 区分初始化/更新，创建或获取 fiberRoot;

Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用,
因此legacyRenderSubtreeIntoContainer 中打印的children实际上是通过React.createElement()处理过的

17中的React.createElement做的事情就是生成react的ast树
将参数读取转换为ast树的一些所需参数字段,最终返回ast树的结构
```js
function createElement(type, config, children) {
    //根据上面的示例代码，type=div,config= {className:'red'},children='Click Me'
  var propName; // Reserved names are extracted
  var props = {};// 我们常用的props 目前组件
  var key = null;//该组件的唯一key
  var ref = null;// 我们的ref
  var self = null;
  var source = null;

  // ...
  ...
  // ...

	// 当发现arguments的参数大于1的时候。说明是有多个兄弟子元素的，如果等于1的话说明只有一个元素
  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
      // 直接将props的children设为当前children
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
	// 有多个兄弟元素的话，将兄弟节点放置在一个数组里面，赋值给props的children
    props.children = childArray;
  } // Resolve default props

  // ...
  ...
  // ...

	// ReactElement 返回回来的是我们最终的ast树的结构
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
```


```js
// 从 container 取出 _reactRootContainer 作为 react 的一个根:
var maybeRoot = container._reactRootContainer;
```

检查 root 是否存在，如果存在就是 Update，如果不存在就是初始化。
* 1.若root不存在：<br/>调用 legacyCreateRootFromDOMContainer初始化 root。
将 root 赋值给 container._reactRootContainer,取出 root 中的_internalRoot 作为 fiberRoot。

* 2.若 root 存在, 从 root 中取出 fiberRoot:
```js
root = maybeRoot;
```
调用 updateContainer(children,fiberRoot,parentComponent,callBack)

注意：这里 callBack 会通过 getPublicRootInstance() 递归找到 fiberRoot 上第一个非 HTMlElement 结点,并将 callback 绑定在它上边。

```js
function render(element, container, callback) {
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback); 
}

/*
可以见到初始化阶段:legacyCreateRootFromDOMContainer 不批量调用 updateContainer

update阶段：直接调用 updateContainer
*/
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  if (!maybeRoot) {
    console.log('开始调用-->0-a0:初始化渲染')
    // Initial mount
    root = legacyCreateRootFromDOMContainer(container, children, parentComponent, callback, forceHydrate);
  } else {
    root = maybeRoot;

    if (typeof callback === 'function') {
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(root);
        originalCallback.call(instance);
      };
    } // Update

    console.log('更新流程-->1-a1:即更新')
    updateContainer(children, root, parentComponent, callback);
  }

  return getPublicRootInstance(root);
}

// 第一次渲染
legacyCreateRootFromDOMContainer(){
      
  console.log('-->0-a,初始化渲染不执行批量更新,而是执行flushSync',)
  flushSync(function () {
    updateContainer(initialChildren, _root, parentComponent, callback);
  });
}
```

### React.createElement 旧api
https://cloud.tencent.com/developer/article/2135083

react17 之后我们可以不再依赖 React.createElement 这个 api 了，但是实际场景中以及很多开源包中可能会有很多通过 React.createElement 手动创建元素的场景:

React.createElement 其接收三个或以上参数：

* type：要创建的 React 元素类型，可以是标签名称字符串，如 'div' 或者 'span' 等；也可以是 React组件 类型(class组件或者函数组件)；或者是 React fragment 类型。
* config：写在标签上的属性的集合，js 对象格式，若标签上未添加任何属性则为 null。
* children：从第三个参数开始后的参数为当前创建的React元素的子节点，每个参数的类型，若是当前元素节点的 textContent 则为字符串类型；否则为新的 React.createElement 创建的元素。


### 17版本-createFiberRoot 创建fiberRoot对象
最终创建了 fiberRoot 和 rootFiber：
```mermaid
flowchart LR
A1(createContainer)-->A2(createFiberRoot)-->E12(createHostRootFiber)
A2-->FiberRootNode
```

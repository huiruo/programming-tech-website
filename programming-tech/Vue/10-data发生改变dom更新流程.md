---
title: data发生改变dom更新流程
sidebar_position: -2
---

## data更新流程图
```mermaid
flowchart TD
A1(data改变)-->b1("set(target,key,value,receiver)")--触发副作用-->b4("trigger(target,'set',key, value,oldValue)")-->b5("triggerEffects(dep)")-->b6("triggerEffect(effect)")

A1-->b2("get(target,key,receiver")--收集依赖-->b3("track(target,'get',key)")

b3-->b7("trackEffects(dep, eventInfo)")
```

```mermaid
flowchart TD
A1("set(target, key, value, receiver)")--hadKey=true-->A2("trigger(target,'set',key,value,oldValue)")-->A4
A1--hadKey=true-->A3("trigger(target,'set',key,value,oldValue)")-->A4

A4("trigger(target,type,key,newValue,..")--deps.length=1比如对象-->B1("triggerEffects(deps[0], eventInfo)")

A4--不等于1比如add数组-->B2("triggerEffects(createDep(effects),eventInfo)")

B1-->B12("triggerEffects(createDep(effects),eventInfo)")
B2-->B13("triggerEffects(deps[0], eventInfo)")

B12--遍历dep中的effect逐一triggerEffect来执行副作用-->B3("triggerEffect(effect,debuggerEventExtraInfo)")
B13--遍历dep中的effect逐一triggerEffect来执行副作用-->B3("triggerEffect(effect,debuggerEventExtraInfo)")

%% B3("effect.scheduler()正式执行副作用")--调度执行-->C1
B3("effect.scheduler()正式执行副作用")--调度执行-->C3

%% C1("queueJob(job)")-->C2("queueFlush()")-->C3("flushJobs(seen)重点")--循环queue-->C4("callWithErrorHandling(job,null,14),job就是effect.run()")--开始走渲染流程-->Z1

C3("flushJobs(seen)重点")--循环queue-->C4("callWithErrorHandling(job,null,14),job就是effect.run()")--开始走渲染流程-->Z1

%% 渲染流程
Z1("componentUpdateFn()")--1创建vnode-->V3("renderComponentRoot(instance)返回vnode")-->V4

V4("render.call(proxyToUse,..)调用ast生成的render生成vnode")-->C41("执行ast render函数也会触发依赖收集")

Z1--2创建好vnode:nextTree-->D1("调用patch(prevTree,nextTree)进行渲染")--case:shapeFlag&1-->D12("processElement")--A更新dom元素-->D2("重点patchElement(n1,n2,parentComponent,parentSuspense,")--"if(dynamicChildren)"-->E1("patchBlockChildren(n1.dynamicChildren,dynamicChildren,el)")-->E2("patch(oldVNode,newVNode,container,null,parentComponent")

D12--B初始化逻辑-->D3("mountElement(n2, container")

%%("mountElement(n2, container")

Z1--3渲染完毕最后-->Z2("处理生命周期函数")
```

更新的时候以处理文本节点为例子
```mermaid
flowchart TD
E1("patchBlockChildren(n1.dynamicChildren,dynamicChildren,el)")-->A1("patch(oldVNode,newVNode,container,null,parentComponent")--"以文本节点为例:case Text"-->A2("processText(n1,n2,container,anchor)")--"n2.children!==n1.children"-->A3("hostSetText(el,n2.children)")-->A4("setText:(node, text) => {node.nodeValue = text;}页面文本改变了")
```

## 流程解析
有一个需要注意点： 初始化的时候instance.data
```js
console.log('start响应式=>a:applyOptions-调用reactive,重点，响应式赋值给实例的data', 'color:magenta')

instance.data = reactive(data);
```
### 第1步:所以副作用set的修改的也是instance.data的值,这样就生成的新的instance
下面debugger可以看到instance数据结构
```js
	debugger
	const nextTree = renderComponentRoot(instance);
	{
		endMeasure(instance, `render`);
	}
	// 获取组件上次渲染的 VNode
	const prevTree = instance.subTree;
	instance.subTree = nextTree;
```

但是我目前还不知道多个组件它是怎么处理instance.data的，得测试一下

### 第2步：执行renderComponentRoot,也就是render函数生成最新的vnode
```js
console.log('$ceffect.run==>调用renderComponentRoot，获取组件最新的 VNode,render会读取组件的响应式数据，这会触发依赖收集', 'color:chartreuse')

const nextTree = renderComponentRoot(instance);
```

### 第3步：执行patch 走diff流程
```js
const componentUpdateFn = () => {
	// 省略...
	console.log('$ceffect.run==>调用renderComponentRoot，获取组件最新的 VNode,render会读取组件的响应式数据，这会触发依赖收集', 'color:chartreuse')
	const nextTree = renderComponentRoot(instance);
	{
		endMeasure(instance, `render`);
	}
	// 获取组件上次渲染的 VNode
	const prevTree = instance.subTree;
	instance.subTree = nextTree;
	{
		startMeasure(instance, `patch`);
	}
	console.log('effect.run==>:componentUpdateFn之updateComponent调用patch 函数进行组件的更新')
	patch(prevTree, nextTree,
		// parent may have changed if it's in a teleport
		hostParentNode(prevTree.el),
		// anchor may have changed if it's in a fragment
		getNextHostNode(prevTree), instance, parentSuspense, isSVG);
	// 省略...
```
---
title: 基础-无状态组件和HOC-容器组件-展示组件
sidebar_position: 15
---

## 1.受控组件
### 1-1.受控组件
有state;受控组件的特性在于元素的内容通过组件的状态state进行控制

双向数据绑定就是受控组件,受控组件更新state的流程：
* 可以通过初始state中设置表单的默认值
* 每当表单的值发生变化时，调用onChange事件处理器
* 事件处理器通过事件对象e拿到改变后的状态，并更新组件的state
* 一旦通过setState方法更新state，就会触发视图的重新渲染，完成表单组件的更新

### 1-2.非受控组件
不需要设置它的state属性，而通过ref来操作真实的DOM

<br />

## A.根据组件的意图划分组件:
* 容器组件
* 展示组件
### A-1.容器组件:
1. 通过有状态组件实现，将数据传给展示组件
2. 没有html,容器组件用来包含展示其它组件或其它容器组件
```
负责应用逻辑处理
eg：
发送网络请求，处理返回数据，将处理过的数据传递给展示组件
也提供修改数据源的方法，通过展示组件的props传递给展示组件
当展示组件的状态变更引起源数据变化时，展示组件通过调用容器组件提供的方法同步这些变化
```

### A-2.展示组件数据来源：props;--->通过无状态组件实现
```
有html,负责展示UI，也就是组件如何渲染，具有很强的内聚性。
只关心得到数据后如何渲染

数据来源：props作用：描述如何展现
数据修改：从props调用回调函数
```

<br />

## B.无状态组件：无state,有html
1.无状态组件主要用来定义模板，接收来自父组件props传递过来的数据，使用{props.xxx}的表达式把props塞到模板里面。

无状态组件应该保持模板的纯粹性，以便于组件复用。创建无状态组件如下：
```js
const Header = (props) = (
    <div>{props.xxx}</div>
);
```

无状态组件(也可以叫做展示组件) 没有生命周期，本身只是一个函数，效率比UI组建高，只有一个render方法时可以考虑使用无状态组件
```js
无状态组件主要用来定义模板，接收来自父组件props传递过来的数据，使用{props.xxx}的表达式把props塞到模板里面。

无状态组件应该保持模板的纯粹性，以便于组件复用。创建无状态组件如下：
const Header = (props) = (
    <div>{props.xxx}</div>
);
```

### B-1.无状态组件-运用：无状态组件一般会搭配高阶组件（简称：HOC）一起使用
无状态组件：无state,主要作用是用于展示UI，接收来自父组件props传递过来的数据

无状态组件一般会搭配高阶组件（简称：HOC）一起使用

例如：无状态组件在需要生命周期时，可以通过高阶组件来实现:
1. 无状态组件作为高阶组件的参数，并在最后通过调用高阶函数导出一个高阶组件
```js
// 这是一个无状态组件 TableComponent 
import React from 'react'
import { Table } from './table'   // 高阶函数
const TableComponent = (props) => {
        return (
            <div>
                {props.dataSource}
            </div>
        )
}

export default Table(TableComponent);


// 写一个高阶组件，里面写任何需要的生命周期
import React from 'react'
export const Table = (ComposedComponent) => {
    return class extends React.Component {
      constructor(props) {
          super(props)
      }  
      componentDidMount() {
          console.log('componentDidMount');
      }
      render() {
        return (
            <ComposedComponent {...this.props}/>
        )
      }
    }      
}
```

## C.有状态组件:有状态组件也可以叫做容器组件
主要用来定义交互逻辑和业务数据（如果用了Redux，可以把业务数据抽离出去统一管理）.

使用{this.state.xxx}的表达式把业务数据挂载到容器组件的实例上（有状态组件也可以叫做容器组件，无状态组件也可以叫做展示组件），然后传递props到展示组件，展示组件接收到props，把props塞到模板里面。
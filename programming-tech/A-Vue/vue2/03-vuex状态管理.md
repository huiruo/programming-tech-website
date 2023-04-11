# vuex使用
vuex有哪几种属性
state => 基本数据(数据源存放地)
getters => 从基本数据派生出来的数据
mutations => 提交更改数据的方法，同步！
actions => 像一个装饰器，包裹mutations，使之可以异步。
modules => 模块化Vuex

辅助函数：
Vuex提供了mapState、MapGetters、MapActions、mapMutations等辅助函数

###  1.Mutation：专注于修改State，理论上是修改State的唯一途径。
有一个固有参数 state，接收的是 Vuex 中的 state 对象

在组件中提交 Mutation：
```
this.$store.commit('mutation函数名'，data)
```
### 2. Action
主要的区别在于mutations 只能是同步操作,action 可以包含异步操作，而且可以通过 action 来提交 mutations

action 也有一个固有参数 context，但是 context 是 state 的父级，包含 state、getters

```js
this.$store.dispatch('action中的函数名'，data)
```


```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {    //官方给出的指定对象, 此处context可以理解为store对象
      context.commit('increment');
    }
  }
})
```

## mapActions 使用方法
```js
// mapActions 使用方法一
...mapActions([
   'asyncDecrease' // 将 `this.asyncDecrease()` 映射为 `this.$store.dispatch('asyncDecrease')`
]),

// mapActions 使用方法二
...mapActions({
    asyncDecrease: 'asyncDecrease' // 将 `this.asyncDecrease()` 映射为 `this.$store.dispatch('asyncDecrease')`
}),
```

```js
methods: {
...mapActions('examine', [
  'setDialogInnerDataDepart',
  'setDialogRightCustomer',
  'setUniqueCheckedListRight',
  'setCheckedListRight',
  'setDivLogicTypeNull',
  'setDivStaffSelectNull',
  'selectStaffAction',
  'selectDepartAction',
  'setCheckedList',
  'setInitDataRightAdjust'
]),
```

# vuex 原理
## vuex的state和getters是如何映射到各个组件实例中响应式更新状态呢？

从源码，可以看出Vuex的state状态是响应式，是借助vue的data是响应式，将state存入vue实例组件的data中；Vuex的getters则是借助vue的计算属性computed实现数据实时监听。
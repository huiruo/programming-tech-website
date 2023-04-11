## Vue-router跳转和location.href有什么区别
```text
答：使用location.href='/url'来跳转，简单方便，但是刷新了页面；
   使用history.pushState('/url')，无刷新页面，静态跳转；
   
引进router，然后使用router.push('/url')来跳转，使用了diff算法，实现了按需加载，减少了dom的消耗。
其实使用router跳转和使用history.pushState()没什么差别的，因为vue-router就是用了history.pushState()，尤其是在history模式下。
```

## router 和 route 的区别
router 是VueRouter的一个对象，通过Vue.use(VueRouter)和VueRouter构造函数的到的一个router对象
route是一个跳转路由对象，每一个路由都会有一个router对象，是一个局部的对象，可以获取对应的name、path、params、query等


# vue路由传参的三种方式
## 跳转1：
```js
getDescribe(id) {
// 直接调用$router.push 实现携带参数的跳转
this.$router.push({
  path: `/describe/${id}`,
})

// 配置：
{
  path: '/describe/:id',
  name: 'Describe',
  component: Describe
}
// 读取：
// 很显然，需要在path中添加/:id来对应 $router.push 中path携带的参数。在子组件中可以使用来获取传递的参数值。
this.$route.params.id
```

## 跳转2：
父组件中：通过路由属性中的name来确定匹配的路由，通过params来传递参数。
```js
this.$router.push({
  name: 'Describe',
  params: {
    id: id
  }
})
// 配置：
// 对应路由配置: 注意这里不能使用:/id来传递参数了，因为父组件中，已经使用params来携带参数了。
{
  path: '/describe',
  name: 'Describe',
  component: Describe
}
// 读取：
this.$route.params.id
```

## 跳转3：
父组件：使用path来匹配路由，然后通过query来传递参数
这种情况下 query传递的参数会显示在url后面?id=？
```js
this.$router.push({
          path: '/describe',
          query: {
            id: id
          }
})

// 对应路由配置：
{
  path: '/describe',
  name: 'Describe',
  component: Describe
}
// 读取：
this.$route.query.id
```
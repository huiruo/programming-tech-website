## Vue-router跳转和location.href有什么区别
使用location.href='/url'来跳转，简单方便，但是刷新了页面；

使用history.pushState('/url')，无刷新页面，静态跳转；
   
引进router，然后使用router.push('/url')来跳转，使用了diff算法，实现了按需加载，减少了dom的消耗。

其实使用router跳转和使用history.pushState()没什么差别的，因为vue-router就是用了history.pushState()，尤其是在history模式下。

## hash 模式和 history 模式
```js
const router = createRouter({
  mode: 'hash',
  routes: [...]
})
```

### hash 模式 
路由路径以 # 开头，例如 http://localhost:8080/#/user。当 URL 中的 hash 值发生变化时，浏览器不会向服务器发送请求，而是触发浏览器的 hashchange 事件，Vue Router 监听该事件并根据新的 hash 值来更新路由状态。

使用 hash 模式的路由非常适合在前端实现单页面应用程序，因为它可以避免在路由切换时向服务器发送请求

### History 模式
当 URL 发生变化时，浏览器会向服务器发送请求，服务器返回对应的 HTML 页面，Vue Router 解析 HTML 页面中的路由配置来更新路由状态。

使用 history 模式的路由可以实现更加自然的 URL，但需要注意的是，在使用 history 模式时，必须确保服务器能够正确地响应路由路径，否则会出现 404 错误。

## Router 和 Route 是 vue-router 中的两个核心组件
## Router
Router 是路由器的核心组件，用于定义路由的基本配置和管理功能。一个应用程序中通常只需要一个 Router 实例，它包含了所有路由规则的集合，以及路由器的全局配置项。
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
```

## Route
用于定义单个路由的属性，包括路径、组件、参数等。在路由跳转时，每个 Route 对象都会根据当前 URL 进行匹配，以确定应该渲染哪个组件。

例子：定义了一个路径为 /about/:id 的路由规则，它对应的组件是 About，并且将路由参数传递给组件的 props 中。
```js
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about/:id',
      name: 'about',
      component: About,
      props: true
    }
  ]
})
```

在组件中，我们可以通过 $route 对象来获取当前路由的信息，例如：
```js
export default {
  props: ['id'],
  created () {
    console.log(this.$route.params.id) // 访问路由参数
    console.log(this.$route.query.page) // 访问查询参数
  }
}
```

## RouterLink
vue-router 的路由链接组件，它提供了生成导航链接的功能，可以让用户通过点击链接来触发路由的跳转。

## Navigation Guards
vue-router 的导航守卫组件，它提供了路由跳转前、跳转后、跳转取消等不同的钩子函数，可以让开发者在路由跳转过程中进行各种处理。

### beforeEach(to, from, next)：全局前置守卫，在每次路由跳转前被调用，用于做路由鉴权等操作
如何使用 beforeEach 实现登录鉴权：

在路由器中使用 beforeEach 定义一个全局的导航守卫，用于在每个路由跳转前进行登录鉴权。在导航到非登录页面时，我们检查本地存储中是否存在 token，如果不存在则跳转到登录页面；否则，继续执行路由跳转。

注意，next 函数是必须调用的，它用于控制路由跳转的行为。如果要中断路由跳转，可以调用 next(false)；如果要跳转到指定路由，可以调用 next({ name: 'xxx' })
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token')
  if (to.name !== 'login' && !isLogin) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
```
### afterEach(to, from)：全局后置钩子，在每次路由跳转完成后被调用
常用于记录路由跳转日志等操作

### beforeRouteEnter(to, from, next)
路由独享的守卫,用于在路由进入前获取组件实例，常用于异步获取数据等操作。

### beforeRouteUpdate(to, from, next)
路由独享的守卫,用于在当前路由改变时，路由被复用时调用，常用于异步获取数据等操作。

### beforeRouteLeave(to, from, next)
路由独享的守卫，在当前路由离开前被调用，可以用于提示用户是否离开当前编辑页面等操作。 

### 演示
* 使用了 beforeEach 方法来进行路由鉴权，只有当用户已经登录才能进入 /about 页面；
* 使用 beforeRouteEnter 方法来在路由进入前获取数据；
* 使用 beforeRouteLeave 方法来在路由离开前提示用户是否离开当前编辑页面。
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

router.beforeRouteEnter((to, from, next) => {
  axios.get('/api/data').then(response => {
    next(vm => {
      vm.data = response.data
    })
  })
})

router.beforeRouteLeave((to, from, next) => {
  if (confirm('Are you sure you want to leave this page?')) {
    next()
  } else {
    next(false)
  }
})

export default router
```

## 在组件内可以使用路由守卫
### 前言
在组件内使用这些路由守卫时，它们的作用域是该组件内部，而不是全局。

因此，如果需要在多个组件中共用某个路由守卫，最好将该路由守卫定义为一个 mixin，然后在需要使用它的组件中引入该 mixin
### beforeRouteEnter：在路由进入前被调用
但是此时组件实例还没有被创建，因此无法访问 this。不过，我们可以通过传递一个回调函数给 next 来访问到组件实例，如下所示：
```js
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // access to component instance via `vm`
      vm.loadData()
    })
  },

  methods: {
    loadData() {
      // load data
    }
  }
}
```

### beforeRouteUpdate：在当前路由改变时调用
但是该组件实例的 props 或者路由参数发生了变化时调用。与 beforeRouteEnter 类似，此时我们也可以通过访问 this 访问到组件实例，如下所示：
```js
export default {
  beforeRouteUpdate(to, from, next) {
    // get updated props or params
    const { id } = to.params

    // do something with updated props or params
    this.loadData(id)

    // call next to continue updating
    next()
  },

  methods: {
    loadData(id) {
      // load data with updated id
    }
  }
}
```

### beforeRouteLeave：在当前路由将要离开时调用，常用于提示用户是否保存当前编辑状态等
在这个钩子中，我们不需要访问组件实例，因此不需要传递回调函数给 next，只需要在回调函数中返回一个布尔值、字符串或者一个带有路径参数的对象即可，如下所示：
```js
export default {
  beforeRouteLeave(to, from, next) {
    if (this.hasChanged) {
      const answer = window.confirm('Do you want to discard your changes?')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
```

## vue路由传参的三种方式
### 跳转1：
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

### 跳转2：
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

## 传参
### 查询参数（query）
使用 query 传递参数，将参数附加在 URL 后面，以 ? 开头，使用 & 分隔多个参数。例如：
```js
// 跳转到路由 /user，传递参数 id=123
this.$router.push({ path: '/user', query: { id: 123 }})
```

在目标组件中，可以通过 $route.query 访问传递的参数，例如：
```js
console.log(this.$route.query.id); // 输出 123
```

### 动态路由（params）
使用 params 传递参数，将参数添加到 URL 中，作为路由的一部分。例如：
```js
// 定义带参数的路由
{ path: '/user/:id', component: User }

// 跳转到路由 /user/123
this.$router.push({ path: '/user/123' })
```

在目标组件中，可以通过 $route.params 访问传递的参数，例如：
```js
console.log(this.$route.params.id); // 输出 123
```

### 命名路由（name）：在定义路由时指定名称，使用 name 传递参数。例如：
```js
// 定义带参数的命名路由
{ path: '/user/:id', name: 'user', component: User }

// 跳转到命名路由 /user，并传递参数 id=123
this.$router.push({ name: 'user', params: { id: 123 }})
```

在目标组件中，可以通过 $route.params 访问传递的参数，例如：
```js
console.log(this.$route.params.id); // 输出 123
```
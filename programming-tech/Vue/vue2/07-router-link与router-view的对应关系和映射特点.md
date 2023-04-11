
router-link对应的router-view规律为：
1.根据to的值而定，值为一层（如 /child）则对应app.vue中的router-view；
　值为两层，如 /second/child，则对应的是/second组件中的router-view；以此类推
2.router-link映射的结果为其对应组件的整个页面内容，如 to='/second/child'，则其对应的view会显示app.vue和/second和/second/child等父子组件的整个页面内容；
　同样的，若to='/child'，则得到的页面结果为app.vue和/child父子组件的整个页面

二者区别：

## 1 router-link
```
<router-link :to="{ path: '/hello', component: HelloWorld }">hello</router-link>
<router-link :to="{ path: '/user/useradd' }">user</router-link>
```

以上是两种写法，根据参数还会有更多中写法。
经过测试：（1）有component参数时优先router-link中配置的component，没有时从js中配置取
　　　　　（2）path参数至关重要，灵活所在，/user/useradd 实际匹配了两个组件，分别是user和useradd
```
{ path: '/user', component:user,
  children:[
    {path:'/user/useradd', component:useradd},
    {path:'/user/userdelete', component:userdelete}
  ]
}
```
## 2.router-view
```
<router-view> 是用来渲染通过路由映射过来的组件，当路径更改时，<router-view> 中的内容也会发生更改
```
```html
<router-link :to="{ path: '/hello', component: HelloWorld }">hello</router-link>
<router-link :to="{ path: '/user/useradd' }">user</router-link>
<router-view/>
```
当前看主要应用于单页面中，与router-link配合，渲染router-link 映射过来的组件。

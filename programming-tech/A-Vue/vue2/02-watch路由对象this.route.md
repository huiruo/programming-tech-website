this.$route 当前激活的路由信息对象。这个属性是只读的，里面的属性是 immutable (不可变) 的，不过你可以 watch (监测变化) 它。
```
watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect //
          //
          //
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
},
```

## 方法1：watch
用户点击当前高亮的路由并不会刷新 view，因为 vue-router 会拦截你的路由，它判断你的 url 并没有任何变化，所以它不会触发任何钩子或者是 view 的变化。
```
//---------------------------
vue 监听路由变化
方法一：通过 watch
// 监听,当路由发生变化的时候执行
watch:{
  $route(to,from){
    console.log(to.path);
  }
},

或：
// 监听,当路由发生变化的时候执行
watch: {
  $route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
},
```



## 方法二：：通过 vue-router 的钩子函数 beforeRouteEnter  beforeRouteUpdate  beforeRouteLeave
```
<script>
  // 引入 Tabbar组件
  import mTabbar from './components/Tabbar'
  import mTabbarItem from './components/TabbarItem'
  // 引入 vuex 的两个方法
  import {mapGetters, mapActions} from 'vuex'
 
  export default {
    name: 'app',
    // 计算属性
    computed:mapGetters([
      // 从 getters 中获取值
      'tabbarShow'
    ]),
    // 监听,当路由发生变化的时候执行
    watch:{
      $route(to,from){
        if(to.path == '/' || to.path == '/Prisoner' || to.path == '/Goods' || to.path == '/Time' || to.path == '/Mine'){
          /**
           * $store来自Store对象
           * dispatch 向 actions 发起请求
           */
          this.$store.dispatch('showTabBar');
        }else{
          this.$store.dispatch('hideTabBar');
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当钩子执行前，组件实例还没被创建
    },
    beforeRouteUpdate (to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
    },
    components:{
      mTabbar,
      mTabbarItem
    },
    data() {
      return {
        select:"Building"
      }
    }
  }
</script>
```

## vue2中的mixin
mixin 是一种可重用的 Vue 组件选项，它可以包含任意组件选项，如 data、methods、computed、生命周期钩子等。我们可以将 mixin 引入到一个组件中，以将 mixin 中的选项混合到组件选项中，从而实现代码复用

下面例子创建了一个名为 myMixin 的 mixin 对象，它包含了 data、created 和 methods 三个选项。

然后，在 MyComponent.vue 组件中引入 myMixin 并在 mixins 选项中使用它，这样就可以将 myMixin 中的选项混入到 MyComponent.vue 组件中。在这个例子中，MyComponent.vue 组件将具有 myMixin 中定义的 data、methods 和 created 钩子。

需要注意的是，如果 mixin 和组件选项中存在同名选项，Vue.js 会自动合并它们，组件选项优先。例如，如果 myMixin 和 MyComponent.vue 组件都有 data 选项，最终的 data 选项将是两者合并的结果。如果混合的选项是生命周期钩子函数，则它们将按照创建顺序依次调用。

另外，我们还可以使用 mixin 的方式来扩展路由守卫。例如，如果我们需要在多个组件中都使用相同的 beforeRouteEnter 钩子，我们可以将它定义为一个 mixin，然后在需要使用它的组件中引入该 mixin 
### 步骤1-创建一个 mixin 对象，定义需要混入的选项
```js
// myMixin.js
export default {
  data() {
    return {
      message: 'Hello, world!'
    }
  },

  created() {
    console.log('myMixin created')
  },

  methods: {
    showMessage() {
      alert(this.message)
    }
  }
}
```

### 在需要使用 mixin 的组件中引入该 mixin，并在 mixins 选项中使用它：
MyComponent.vue
```html
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="showMessage">Show Message</button>
  </div>
</template>

<script>
import myMixin from './myMixin'

export default {
  mixins: [myMixin],

  created() {
    console.log('MyComponent created')
  }
}
</script>
```

## vue3中mixin的替代方式
Vue 3 的 mixin 采用了一种新的 API，即 Composition API，这也是 Vue 3 新增的一个特性。

Composition API 是一种基于函数的 API，它允许我们在逻辑上组织代码，而不是按照生命周期方法和选项对象来组织代码。与 Vue 2 的 mixin 不同，Composition API 允许我们将逻辑代码封装到单个函数中，然后在多个组件中复用该函数，而不是像 mixin 一样将多个选项混合在一起。

### 步骤1
```js
// myMixin.js
import { reactive, onMounted } from 'vue'

export default function() {
  const state = reactive({
    message: 'Hello, world!'
  })

  onMounted(() => {
    console.log('myMixin created')
  })

  function showMessage() {
    alert(state.message)
  }

  return {
    state,
    showMessage
  }
}
```

### 步骤2-在组件中使用该 mixin
在上面的示例中，我们在 setup 函数中使用 myMixin 函数来创建一个 mixin 对象，并返回 state 和 showMessage 属性。然后，在组件中使用 state 和 showMessage 来实现相应的功能。

MyComponent.vue
```html
<template>
  <div>
    <p>{{ state.message }}</p>
    <button @click="showMessage">Show Message</button>
  </div>
</template>

<script>
import myMixin from './myMixin'

export default {
  setup() {
    const { state, showMessage } = myMixin()

    return {
      state,
      showMessage
    }
  },

  mounted() {
    console.log('MyComponent created')
  }
}
</script>
```
## computed 和data 的区别
### data
数据属性定义在 data 中是响应式的，这意味着当数据发生变化时，Vue会自动重新渲染组件以反映这些变化。

### computed
计算属性的值是基于其他数据属性计算得出的，但它们不会在数据发生变化时重新计算，除非相关的依赖数据发生了变化。

computed 常用于处理需要经过计算才能获得的数据，以减少模板中的复杂逻辑，提高代码的可读性。 如果一个值依赖多个属性（多对一），用computed肯定是更加方便的。

特点：
* 缓存结果：只有依赖项变化的时候才会重新计算，否则复用上一次计算的结果。
>computed是用来计算一个属性的值,根据依赖自动缓存，依赖不变的时候，值不会重新计算

* 惰性求值：只有在真正读取它的 value 时，才会进行计算求值。(computed 的延迟计算通常是一件好事：它确保了必要时才会进行计算。)
>只有在使用 computed 时，它才会进行计算。如果一个计算属性，计算开销非常非常大，但它没有被任何地方使用，也不会进行求值。(必须要在模板里使用)
```html
<!-- 
因为 showList 最初是 false，所以模板中不会读取 openTodos，因此不会产生计算。

并且无论是一开始还是添加了新的 todo。只有在 showList 设置为 true 之后，
模板中才会读取 openTodos，这才会触发相应的计算。
-->
<template>
  <button @click="showList = !showList">Click me</button>
  <template v-if="showList">
    <template v-if="hasOpenTodos">
      <h2>{{ openTodos.length }} Todos:</h2>
      <ul>
        <li v-for="todo in openTodos" :key="todo.title">
          {{ todo.title }}
        </li>
      </ul>
    </template>
    <span v-else>There are no Todos</span>

    <input type="text" v-model="newTodo" />
    <button type="button" @click="onAdd">Add</button>
  </template>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const showList = ref(false);

const todos = reactive([
  { title: 'todo item 1', done: true },
  { title: 'todo item 2', done: false }
]);

const openTodos = computed(() => todos.filter(todo => !todo.done));
const hasOpenTodos = computed(() => !!openTodos.value.length);

const newTodo = ref('');

function onAdd() {
  todos.push({
    title: newTodo.value,
    done: false,
  });
}
</script>
```

* >惰性求值也会带来一个缺点：计算属性的返回结果，只有在对它进行计算后才会知道。

## computed 用法
* Getter:Getter 在计算属性被访问时被调用。如果计算属性依赖的响应式数据发生变化，计算属性的 getter 会重新执行。
* setter:当你尝试通过计算属性设置值时，setter 被调用，然后它可以用来更新其他响应式数据。

computed 假如预设只有 getter ，也就是只能读取，不能改变设值。

vue2基本使用：
```js
computed: {
  fullName: function () {
    return this.firstName + ' ' + this.lastName
  }
}

// 其实computed里的代码完整的写法应该是：
computed: {
  fullName: {
    get(){
        return this.firstName + ' ' + this.lastName
    }
  }
}


// setter 使用
// 其执行顺序是setter -> getter -> updated
computed: {
  fullName: {
    //getter 方法
      get(){
          console.log('computed getter...')
          return this.firstName + ' ' + this.lastName
      }，
//setter 方法
      set(newValue){
          console.log('computed setter...')
          var names = newValue.split(' ')
          this.firstName = names[0]
          this.lastName = names[names.length - 1]
          return this.firstName + ' ' + this.lastName
      }
    
  }
},
```

vue3:
```html
<body>
  <script src="./vue3.global.js"></script>
  <div id="root">
    <div>
      <button v-on:click='onClickText' class="btn">Hello world,Click me</button>
      <span>{{refData.myName}}-{{msg}}-{{info.msg2}}</span>
      <span>{{info.age}}-{{nextYage}}</span>
      <span>-nextYageFor2:{{nextYageFor2}}</span>
      <div v-if="showDiv">
        被你发现了
      </div>

      <div>
        <button v-on:click='onIncreaseAge' class="btn">Increase Age</button>
        <button v-on:click='onChangeAgeSetter' class="btn">ChangeAge Setter</button>
      </div>
    </div>
  </div>
  <script>
    const { ref, reactive, computed } = Vue

    Vue.createApp({
      data() {
        return {
          msg: '改变我',
          showDiv: false
        }
      },
      methods: {
        onClickText() {
          console.log('test:', this, '-', this.refData)
          this.msg = '努力'
          this.showDiv = !this.showDiv
          this.info.msg2 = this.showDiv ? '直接点' : '其他选择'
        },
        onIncreaseAge() {
          this.info.age = this.info.age + 1
        },
        onChangeAgeSetter() {
          console.log('this.onChangeAgeSetter', this.nextYageFor2);
          this.nextYageFor2 = 1
        }
      },

      setup(props) {
        const refData = ref({
          myName: 'Ruo'
        })

        const info = reactive({
          msg2: 'hello',
          age: 28
        });

        const ins = Vue.getCurrentInstance();

        const nextYage = computed(() => {
          return info.age + 1
        })

        // 计算属性默认只有 getter ，在需要的时候也可以提供 setter 。
        // computed 预设只有 getter ，也就是只能读取，不能改变设值。
        let nextYageFor2 = computed({
          get: (val) => {
            console.log('1.computed getter...', val)
            return info.age * 10
          },
          set: (value) => {
            console.log('2.computed setter...', value)
            return value
          }
        })

        return {
          info,
          refData,
          nextYage,
          nextYageFor2
        };
      },

    }).mount('#root')
  </script>
</body>
```

vue2:
```html
<body>
  <div id="root">
    <div>
      <button @click="onClickText" class="btn">Hello world, Click me</button>
      <span>{{ refData.myName }} - {{ msg }} - {{ info.msg2 }}</span>
      <span>{{ info.age }} - {{ nextYage }}</span>
      <span>-nextYageFor2: {{ nextYageFor2 }}</span>
      <div v-if="showDiv">
        被你发现了
      </div>

      <div>
        <button @click="onIncreaseAge" class="btn">Increase Age</button>
        <button @click="onChangeAgeSetter" class="btn">ChangeAge Setter</button>
      </div>
    </div>
  </div>
  <script>
    new Vue({
      el: '#root',
      data: {
        msg: '改变我',
        showDiv: false,
        refData: {
          myName: 'Ruo'
        },
        info: {
          msg2: 'hello',
          age: 28
        }
      },
      computed: {
        nextYage: function () {
          return this.info.age + 1;
        },
        nextYageFor2: {
          get: function () {
            console.log('1.computed getter...');
            return this.info.age * 10;
          },
          set: function (value) {
            console.log('2.computed setter...', value);
          }
        }
      },
      methods: {
        onClickText: function () {
          console.log('test:', this);
          this.msg = '努力';
          this.showDiv = !this.showDiv;
          this.info.msg2 = this.showDiv ? '直接点' : '其他选择';
        },
        onIncreaseAge: function () {
          this.info.age = this.info.age + 1;
        },
        onChangeAgeSetter: function () {
          console.log('this.onChangeAgeSetter', this.nextYageFor2);
          this.nextYageFor2 = 1;
        }
      }
    });
  </script>
</body>
```

### computed 会触发组件重新渲染吗-惰性求值
计算属性 (computed) 不会触发组件的重新渲染。它的主要作用是根据依赖的数据属性计算一个新的值，而不会触发组件的重新渲染，除非在模板中直接引用了这个计算属性。如果计算属性的依赖数据发生变化，计算属性会被重新计算，但只有在模板中引用了它的地方才会重新渲染。

这是Vue的一项性能优化措施，因为如果一个计算属性的值没有被用到，那么它不会被计算，也就不会引起不必要的重新渲染。
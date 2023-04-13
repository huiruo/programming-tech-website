当我把 text 的值改变后，手动触发了一下effect()，页面上的值就更新了，这响应式怎么还要手动触发？

解决就是把所有引用了text这个值的effect看作为text的依赖收集起来，当我们改变text的值的时候，把这些依赖都执行一遍。
```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>

<body>
  <script>
    // 挂载到 window 上方便演示
    window.text = ''
    window.effect = effect

    function effect() {
      const root = document.getElementById('app')
      root.innerText = window.text
    }
  </script>
  <div id="app">Hello!</div>
</body>

</html>
```

### 不完善的副作用例子
定义一个副作用函数，如果obj.name发生变化，这个函数就会自动执行
```js
effect(() => {
  document.body.innerHTML = obj.name;
});

setTimeout(() => {
  obj.name = 'Hello, w';
}, 2000);
```
effect 副作用函数不止一个，所以我们需要有个数组去存放所有的副作用函数，先用 Set 来存放好了

从使用上来看 effect 入参接收的是一个函数 fn，所以 effect 是个高阶函数。当 obj 触发 set 时需要执行这个 fn，所以 fn 函数需要暴露出来以便使用。

存放所有的副作用
触发get的时候去收集，触发set的时候去执行，这种依赖收集和触发的模式也是我们常说的发布订阅模式。

另外一个问题：
我们发现虽然 effect 中没有依赖 obj.age ,但当我们改变 obj.age 时，effect 还是会重新执行。

这是因为我们的响应式系统的依赖收集和触发的颗粒度不够，我们现在的解决方案是只要 obj 里面的值发生变化都会触发副作用的更新，这显然是不对的。

所以收集依赖时，必须精确到 obj 的key，大致的数据结构设计如下所示：
在 vue3 中，使用的是 WeakMap来描述这一关系

上面的描述代码如下：
```js
let data = {
  name: 'js',
};

const obj1 = new Proxy(data, {
  get(target, key) {
    return target[key];
  },
  set(target, key, val) {
    target[key] = val;
    console.log('监听赋值成功', key, 'val:', val)
    // render();
  },
});

obj1.name = 'java';
console.log('分割线：==============》')

let activeEffect;
let effects = new Set();
const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      // 收集副作用
      effects.add(activeEffect);
    }
    return target[key];
  },
  set(target, key, val) {
    target[key] = val;
    //执行所有的副作用
    effects.forEach((effect) => effect());
  },
});

function effect(fn) {
  activeEffect = fn;
  fn();
}

// 当 obj.name 改变的时候，希望 effect可以再次被执行
effect(() => {
  console.log('模拟dom更新===》')
  // document.body.innerHTML = obj.name;
});

// 可以存在多个effect
effect(() => {
  console.log('当前obj:', obj.name);
});

setTimeout(() => {
  obj.name = 'hello world';
}, 2000);
```

### 完善的副作用例子
另外一个问题：虽然 effect 中没有依赖 obj.age ,但当我们改变 obj.age 时，effect 还是会重新执行。

这是因为我们的响应式系统的依赖收集和触发的颗粒度不够，我们现在的解决方案是只要 obj 里面的值发生变化都会触发副作用的更新，这显然是不对的。

所以收集依赖时，必须精确到 obj 的key，大致的数据结构设计如下所示：

在 vue3 中，使用的是 WeakMap来描述这一关系

Vue3 响应式设计的巧妙之处就在于此，通过这样一种数据结构就把整个响应式的依赖收集以及对应关系描述的清清楚楚。
```js
let data = {
  name: 'js',
};

let activeEffect;
let effects = new WeakMap(); // 存放所有的对象及副作用的关系

const obj = new Proxy(data, {
  get(target, key) {
    // 判断，有没有 target的关系树
    let depsMap = effects.get(target);
    //如果没有就创建，以当前 obj 为 key
    if (!depsMap) {
      effects.set(target, (depsMap = new Map()));
    }
    // 看 obj.xxx 具体的key有没有创建依赖关系
    let deps = depsMap.get(key);
    // 如果没有就创建
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    // 如果有依赖 就添加到对应的 key上
    if (activeEffect) {
      deps.add(activeEffect);
    }
    return target[key];
  },
  set(target, key, val) {
    target[key] = val;
    // 从WeakMap中取出对应的依赖关系
    const depsMap = effects.get(target);
    if (depsMap) {
      // 取出obj对应的key
      const effect = depsMap.get(key);
      //如果有副作用函数就执行所有的副作用函数
      effect && effect.forEach((fn) => fn());
    }
  },
});

function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  console.log('模拟dom更新===》')
  // document.body.innerHTML = obj.name;
});

setTimeout(() => {
  obj.age = 18;
}, 2000);
```


## 类似实现
### 第1步,设置响应式对象
首先创建Proxy，传入将要监听的对象，然后通过handler设置对象的监听,通过get等函数的形参对数据进行劫持处理，然后创建两个WeakMap实例toProxy,toRow来记录当前对象的代理状态，防止重复代理，在set函数中，通过判断属性的类别（新增属性/修改属性）来减少不必要的操作。
非vue3 代码
```js
/* ----------------响应式对象---------------- */
function reactive(target) {
    /* 创建响应式对象 */
    return createReactiveObject(target);
}
/* 防止重复设置代理(target,observer) */
let toProxy = new WeakMap();
/* 防止重复被代理(observer,target) */
let toRow = new WeakMap();
/* 设置响应监听 */
function createReactiveObject(target) {
    /* 非对象或被代理过则直接返回 */
    if (!isObject(target) || toRow.has(target)) return target;
    /* 已经有代理则直接返回 */
    let proxy = toProxy.get(target);
    if (proxy) {
        return proxy;
    }
    /* 监听 */
    let handler = {
        get(target, key) {
            console.log(`get---key(${key})`);
            let res = Reflect.get(target, key);
            /* 添加追踪 */
            track(target, key);
            /* 如果是对象则继续往下设置响应 */
            return isObject(res) ? reactive(res) : res;
        },/* 获取属性 */
        set(target, key, val, receiver) {
            console.log(`set---key(${key})`);
            /* 判断是否为新增属性 */
            let hasKey = hasOwn(target, key);
            /* 存储旧值用于比对 */
            let oldVal = target[key];
            let res = Reflect.set(target, key, val, receiver);
            if (!hasKey) {
                console.log(`新增属性---key(${key})`);
                /* 调用追踪器,绑定新增属性 */
                track(target, key);
                /* 调用触发器,更改视图 */
                trigger(target, key);
            } else if (val !== oldVal) {
                console.log(`修改属性---key(${key})`);
                trigger(target, key);
            }
            return res;
        },/* 修改属性 */
        deleteProperty(target, key) {
            console.log(`delete---key(${key})`);
            let res = Reflect.deleteProperty(target, key);
            return res;
        }/* 删除属性 */
    }
    /* 创建代理 */
    let observer = new Proxy(target, handler);
    /* 记录与target的联系 */
    toProxy.set(target, observer);
    toRow.set(observer, target);
    return observer;
}
```

### 第2步,收集依赖(发布订阅)
每次向effect函数传入一个fun----console.log(person.name)后，会先执行一遍run函数，将effect推入栈中，然后执行fun，在执行fun的过程中,会读取person对象，进而触发get函数
```js
/* 事件栈 */
let effectStack = [];
/* ----effect函数---- */
function effect(fun) {
    /* 将fun压入栈 */
    let effect = createReactiveEffect(fun);
    /* 初始化执行一次 */
    effect();//实际上是运行run
}
function createReactiveEffect(fun) {
    /* 创建响应式effect */
    let effect = function () {
        return run(effect, fun);
    }
    return effect;
}
function run(effect, fun) {
    /* 防止报错导致栈内元素无法弹出 */
    try {
        effectStack.push(effect);
        fun();
    } finally {
        effectStack.pop();
    }
}
```

### get函数调用追踪器track并传入(person,name)
在track中先获取栈顶元素，也就是刚刚触发的fun,假设当前targetsMap是空的，那么此时将会创建一个新的映射target->new Map(),此时depsMap必然也要创建一个新的映射，把key映射到new Set(),然后向key对应的deps中放入effect，此时，name和fun函数之间的绑定已经实现，执行完后effectStack将会把fun函数弹出，防止越堆越多。
```js
/* 目标Map */
let targetsMap = new WeakMap();
/* ----追踪器---- */
function track(target, key) {
    /* 获取触发track的事件 */
    let effect = effectStack[effectStack.length - 1];
    if (effect) {
        /* 获取以target作为标识的depsMap */
        let depsMap = targetsMap.get(target);
        if (!depsMap) {
            /* 如果不存在就创建一个新Map */
            targetsMap.set(target, depsMap = new Map());
        }
        /* 获取以key为标识的deps */
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, deps = new Set());
        }
        /* 向deps中加入事件 */
        if (!deps.has(effect)) {
            deps.add(effect);
        }
    }
}
```

### 接下来是触发的过程
当每次进行类似person.name='tom'这样的改值操作时

就会触发响应的set函数，set函数对比属性的新旧值后调用trigger函数将(person,name)传入，trigger根据两个传入值结合targetsMap->depsMap->deps的顺序找到name对应的事件数组，然后执行所有事件达到响应更新的目的，至此，简化版的vue3响应机制就实现了。
```js
/* ----触发器---- */
function trigger(target, key) {
    /* 获取depsMap */
    let depsMap = targetsMap.get(target);
    if (depsMap) {
        /* 获取deps */
        let deps = depsMap.get(key);
        /* 执行deps数组中所有的事件 */
        deps.forEach(effect => {
            effect();
        });
    }
}
```

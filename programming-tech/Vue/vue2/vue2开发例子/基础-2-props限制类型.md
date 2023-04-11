## 限制两种类型
```js
  props: {
    classId: [Number, String],
    default() {
      return 0;
    }
  },
```

## 实战限制Object类型
```js
  props: {
    countHistory: {
      type: Number,
      default: 0
    },
    operationRow: {
      type: Object,
      default: () => {
        userId: "";
      }
    }
  },
```

## 实战，限制数组类型
```js
row: {
    type: Array,
    default() {
      return [];
    }
}
```

## 一种类型
```js
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },

```

## 其他参考
```js
props:{
      //数组
      imageList:{
        type: Array,
        default: ()=>[
          {imageName:'p1',url: 'www'},
          {imageName:'p2',url: 'www'},
          {imageName:'p3',url: 'www'},
        ]
      },
      //对象
      audio:{
        type: Object,
        default: ()=>{
          return {audioName:'test',audioUrl:'wwww'}
        }
      }
    },
}
```

```js
props: {
    array: {
        type: Array,
        default () {
            return []
        }
    },
    object: {
        type: Object,
        default () {
            return {}
        }
    }
}
```

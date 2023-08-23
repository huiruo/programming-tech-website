
## 更高效地删除对象中的空字符串属性
并且不希望遍历原型链，可以使用Object.keys()方法结合
```js
function removeEmptyStringProperties(obj) {
  Object.keys(obj).forEach(function(key) {
    if (obj[key] === '') {
      delete obj[key];
    }
  });
}

const removeEmptyStringProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '') {
      delete obj[key];
    }
  });
};

function removeEmptyStringProperties<T>(obj: T): void {
  Object.keys(obj).forEach((key) => {
    const propertyValue = obj[key];
    if (typeof propertyValue === 'string' && propertyValue === '') {
      delete obj[key];
    }
  });
}

// 示例用法
var obj = {
  name: 'John',
  age: '',
  city: 'New York',
  email: '',
};

removeEmptyStringProperties(obj);

console.log(obj);
// 输出: { name: 'John', city: 'New York' }
```

## for in
```js
function removeEmptyStringProperties(obj) {
  for (var key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
}

// 示例用法
var obj = {
  name: 'John',
  age: '',
  city: 'New York',
  email: '',
};

removeEmptyStringProperties(obj);

console.log(obj);
// 输出: { name: 'John', city: 'New York' }
```
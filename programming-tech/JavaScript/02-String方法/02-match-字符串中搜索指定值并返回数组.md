## js match()方法
match()可以在一个字符串中搜索指定的值，或者使用正则表达式模式来搜索。它返回一个包含匹配的值的数组，如果没有匹配的值，则返回 null。

该方法接受一个正则作为参数，用来匹配一个字符串，

### 返回值：它的输出结在不是全局匹配的情况下和exec方法的结果一致

即一个数组并带有额外的属性:
```
result返回值有两个属性可以记下：
input: 原始字符串，即 str;
index: 匹配到的字符位于原始字符串的索引值, 索引初始值为0；
lastIndex: 正则表达式属性,下一次匹配开始的位置
```

### 如果采用全局匹配，则不返回任何和其被匹配字符串相关的信息，只返回匹配的结果。
```js

let str = 'hello huxiao6, balabala, hello huDi, 724';
let re = /hello hu(\w+)/g;

let result = str.match(re);
console.log('加了g全局匹配：',result) // [ 'hello huxiao6', 'hello huDi' ]
```

### 采用全局匹配,不采用全局匹配
它的输出结果在不是全局匹配的情况下和exec方法的结果一致即一个数组并带有额外的属性，

如果采用全局匹配，则不返回任何和其被匹配字符串相关的信息，只返回匹配的结果。

可以看到，在全局匹配下的时候，它不同于exec方法，它会一次性将所有匹配结果以数组形式返回，

且这个数组没有其他属性用来指向被匹配字符串的信息，而exec方法在全局匹配下每次返回的依然是本次匹配的结果数组，

且这个数组中只包含本次匹配信息，同时又拥有指向被匹配字符串的信息，即match方法在全局匹配下一次性返回了所有匹配结果，

而exec在全局匹配下返回的依然是当次匹配结果。
```js
const reg3=/(\w)s(\w)/g;
const str4="ws1estqsa";
console.log('全局匹配：',str4.match(reg3));
/*
全局匹配： (3) ['ws1', 'est', 'qsa']
*/

console.log('非全局匹配代码===>')

const reg2=/(\w)s(\w)/;
const str2="ws1esr";
const result2=str2.match(reg2);
let i=0;

while(result2){
    i++;
    if(i<=4){
        console.log(result2);
        console.log("lastIndex:"+reg2.lastIndex);
    }else{
        break;
    }
}

/*
非全局匹配代码===>
[ 'ws1', 'w', '1', index: 0, input: 'ws1esr', groups: undefined ]
lastIndex:0
[ 'ws1', 'w', '1', index: 0, input: 'ws1esr', groups: undefined ]
lastIndex:0
[ 'ws1', 'w', '1', index: 0, input: 'ws1esr', groups: undefined ]
lastIndex:0
[ 'ws1', 'w', '1', index: 0, input: 'ws1esr', groups: undefined ]
lastIndex:0
* */
```

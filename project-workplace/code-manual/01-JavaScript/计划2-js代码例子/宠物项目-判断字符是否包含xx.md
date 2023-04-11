


```
for (let i = 0; i < result.length; i++) {
    // console.log(result[i].root)
	console.log('是否是食物：', result[i].root.search(/食物/))
	if (result[i].root.search(/食物/) > 0) {
	  isFood = true
	  break
	}
      }
```

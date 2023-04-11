

## 获取值
```js
方式1：
submitForm: () => {
	form.validateFields().then((values: any) => values).catch(err => {
		// console.log('err:', err)
	})
},


方式2：
form.validateFields().then((values: any) => {
	console.log('vals', values)
	const formValue = form.getFieldsValue()
	return values
}).catch(err => {
	// console.log('err:', err)
})
```

## 报错
```bash
'<template v-for>' cannot be keyed. Place the key on real elements instead.
```

问题原因
在 Vue 2.x 中，`<template>`标签不能拥有 key，
在 Vue 3.x 中，key 则应该被设置在`<template>`标签上。 官网链接：结合 
[template v-for](https://cn.vuejs.org/guide/essentials/list.html)

```js
module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 12,
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	extends: ['plugin:vue/vue3-essential', 'plugin:vue/essential', 'eslint:recommended'],
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		// http://eslint.cn/docs/rules/
		// https://eslint.vuejs.org/rules/
		'vue/no-v-for-template-key': 'off'
	},
};
```
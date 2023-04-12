---
title: 实现最右边请使用absolute
sidebar_position: 2
---

## 注意 如果子div 用 position: relative 实现不了效果
```css
.template-type{
	position: absolute;
	top: 5px;
	right: 2%;
	width: 23px;
}
```

```html
<div style={{ position: 'relative' }}>
	<div className='template-type'>
		<CustomIcon type={type} style={{ fontSize: '18px' }} />
	</div>
</div>
```

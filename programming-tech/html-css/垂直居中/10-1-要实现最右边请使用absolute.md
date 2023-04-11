## 注意 如果子div 用 position: relative 实现不了效果
```css
.templaet-type{
	position: absolute;
	top: 5px;
	right: 2%;
	width: 23px;
}
```

```html
<div style={{ position: 'relative' }}>
	<div className='templaet-type'>
		<CustomIcon type={type} style={{ fontSize: '18px' }} />
	</div>
</div>
```

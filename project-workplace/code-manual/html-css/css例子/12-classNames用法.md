## 12_classNames用法
```js
import classnames from 'classnames'

className={classnames(
	{
		'kpic-button-active': page === 1
	},
	'kpic-button'
)}
```

## 例子2：
```html
		<div className='bd-bottom-content'>
			{testList.map((item, index) => {

				return (
					<BoxContainer
						className={classnames(
							'bd-bottom-item', {
							'margin0': testList.length === index + 1
						})}
						key={item.id}>
						<BoxTitle title={item.title} />
						<BtOthersChart data={item} />
					</BoxContainer>
				)
			})}
		</div>
```

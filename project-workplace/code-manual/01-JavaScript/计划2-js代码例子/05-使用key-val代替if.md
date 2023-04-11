## 例子
```js
const onHandle = (id: string, project: ProjectType) => {
	const projectId = project.id
	/*
	if (id === 1) {
		onEdit(projectId)
	} else if (id === 2) {
		onUser(projectId)
	} else if (id === 3) {
		onCopy(projectId)
	} else if (id === 4) {
		showDeleteConfirm(projectId)
	}
	*/
	const actionMap = {
		edit: pid => onEdit(pid),
		auth: pid => onUser(pid),
		copy: pid => onCopy(pid),
		del: pid => showDeleteConfirm(pid)
	}

	actionMap[id]?.(projectId)
}
```

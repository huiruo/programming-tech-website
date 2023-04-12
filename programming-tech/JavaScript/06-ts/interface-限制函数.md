## ts
```js
父组件：
const modalSwitch = (visible: boolean) => {
	console.log("modalSwitch")
	setDeptModalVisible(visible)
}

<DeptModal visible={deptModalVisible} modalSwitch={modalSwitch} />

子：
interface DeptModalType {
  visible: boolean
  modalSwitch(visible: boolean): void
  onOpen?(): void
  onClose?(): void
}

const DeptModal: FC<DeptModalType> = (props) => {
	...
}
```

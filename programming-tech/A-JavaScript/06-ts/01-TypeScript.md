## 1.解构别名类型限制
```js
在用 TypeScript 开发时需要解构一个对象。

在结构时我是这样做的：

const { name, age } = body.value
我想为这两个属性定义类型：

const { name: string, age: number } = body.value
但是这样会有问题。虽然能工作，但是实际上把 name 属性赋值给了 string 变量，把 age 属性赋值给了 number 变量。

正确的语法是这样的：
const { name, age }: { name: string; age: number } = body.value


最好的方式是为此类数据定义一个类型：
interface Dog {
  name: string
  age: number
}
这样写会更简单：
const dog: Dog = body.value
```

## react props.children 包装
```js
interface chartsContainerProps {
  children: React.ReactNode
  showLoading?: boolean
  showError?: string
}
const ChartsContainer = (props: chartsContainerProps) => {
  const { showLoading = true, showError = '' } = props
  return (
    <>
		{props.children}
    </>
  )
}
export default ChartsContainer
```

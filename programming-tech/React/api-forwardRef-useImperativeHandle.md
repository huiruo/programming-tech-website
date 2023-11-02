---
title: api-forwardRef
sidebar_position: 50
---

# forwardRef
ref必须指向dom元素而不是React组件
```js
// 下面就是应用到React组件的错误示例：
const A=React.forwardRef((props,ref)=><B {...props} ref={ref}/>)


// 前面提到ref必须指向dom元素，那么正确方法就应用而生：
const  A=React.forwardRef((props,ref)=>(
<div ref={ref}>
	<B {...props} />
</div>
))
```


React.forwardRef 接受 渲染函数 作为参数。React 将使用 props 和 ref 作为参数来调用此函数。此函数应返回 React 节点。

用于将父组件创建的 ref 引用关联到子组件中的任意元素上，也可以理解为子组件向父组件暴露 DOM 引用。

除此之外，因为 ref 是为了获取某个节点的实例，但是函数式组件是没有实例的，不存在 this 的，这种时候是拿不到函数式组件的 ref 的，而 React.forwardRef 也能解决这个问题。

应用场景：
- 获取深层次子孙组件的 DOM 元素
- 获取直接 ref 引用的子组件为非 class 声明的函数式组件
- 传递 refs 到高阶组件

### forwardRef 获取子组件的Dom
父组件：
```js
export function TemplateModal(props: TemplateModalProps) {
  const formRef: any = useRef()
	// 调用子组件的方法
  const handleCancel = () => {
    formRef.current.resetForm()
    onClose()
    cleanModalCache()
  }

  return (
		<AddForm ref={formRef} formValues={formValues} />
	)
}
```

子组件
```js
export function AddForm(props: AddFormPrps, ref: any) {
  const [form] = Form.useForm()

	// 暴露组件的方法
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      const values = form.getFieldsValue()
      return values
    },
    resetForm: () => {
      form.resetFields()
    }
  }))

	return (
	      <Form
        form={form}
        name='template_form'
        layout='inline'
        onFinish={onFinish}
        initialValues={{ title: '', type: 0, tags: [] }}
      />
  )
}

const WrappedAddForm = forwardRef(AddForm)

export default WrappedAddForm
```

### 实战
父组件
```js
import React, { useEffect, useRef } from 'react'
import Zoom from './zoom'

// 封装的Hooks⽤用use开头
const useChangeTitle = (title) => {
  useEffect(() => {
    document.title = title
  }, [title])
}

const App = ((props) => {
  useChangeTitle("⾃自定义修改标题Hooks")

  const zoomComRef = useRef<any>(null)

  const onGetRef = () => {
    const zoomImgRef = zoomComRef.current.getZoomImg()
  }

  return (
    <>
      <div>
        测试图片放大
      </div>
      <div onClick={() => onGetRef()}>获取子组件</div>
      <div>
        <Zoom ref={zoomComRef} />
      </div>
    </>
  );
})

export default App;
```

子组件
```js
import React, { useRef, useImperativeHandle,forwardRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ZoomImg = forwardRef((props, ref) => {

	const zoomImgRef = useRef<any>('');

	useImperativeHandle(ref, () => ({
		getZoomImg: () => {
			return zoomImgRef.current
		}
	}));

	return (
		<>
			<TransformWrapper
				onZoom={function noRefCheck() {
					console.log("ref:", zoomImgRef.current)
				}}
				initialScale={0.5}
				centerOnInit={true}
				maxScale={2}
				minScale={0.5}
				doubleClick={{ step: 0.7, disabled: false, excluded: [], }}
				panning={{ disabled: false, excluded: [] }}
				wheel={{ disabled: false, step: 0.2, activationKeys: [], excluded: [], touchPadDisabled: false, }}
			>
				<TransformComponent wrapperStyle={{ background: "rgba(0, 0, 0, 0.3)", maxWidth: '80vw', maxHeight: '80vh' }}>
					<img ref={zoomImgRef} src="https://prc5.github.io/react-zoom-pan-pinch/static/media/medium-image.12ec4e94.jpg" alt="test" />
				</TransformComponent>
			</TransformWrapper>
		</>
	);
})
export default ZoomImg;
```
## 实例
下面的`key={i}`会带来渲染问题，当删除第一item，会把第二个的item渲染到第一个，解决方案就是key 要用唯一值；`key={random()}`-->这样解决也会带来问题，后面提到
```ts
export const ChildrenForm = (props: Props) => {
  const {
    index,
    childrenFormItem,
    dataAssemblyParam,
    assemblyDataKey,
    values,
    formActionCallback,
  } = props
  const { formItems: formSchema } = childrenFormItem

  const deleteChildrenFormCard = (index: number) => {
    store.dispatch(designerActions.deleteChildrenFormCard({ values, index, }))
    formActionCallback(index)
  }

  const renderItem = useCallback(
    (
      formItem: FormItem,
      dataAssemblyParam: DataAssemblyParam,
      assemblyDataKey: string,
      index: number,
    ) => {
      // TODO: clone
      const newFormItem = cloneDeep(formItem) || ({} as FormItem)
      let fieldId = formItem.controlItemParam?.id as string
      /** 1.普通组件-2.特殊组件 */
      if (fieldId) {
        newFormItem.controlItemParam.id = `${fieldId}-key-${index}`
        newFormItem.controlItemParam.value = dataAssemblyParam[fieldId]
        // index,field修改data用,例如：src/components/form/SelectView.tsx
        newFormItem.controlItemParam['index'] = index
        newFormItem.controlItemParam['field'] = assemblyDataKey
      } else {
        fieldId = newFormItem.id as string
        newFormItem.controlItemParam = {
          index,
          label: newFormItem.label as string,
          id: fieldId,
        }
      }

      // 有些是模版，并没有在generateFormSchema 生成dataId,取assemblyDataKey
      if (!newFormItem.dataId) {
        newFormItem.dataId = assemblyDataKey
      }

      /*
      console.log(
        'render-item-newFormItem B',
        newFormItem.controlItemParam?.label,
        newFormItem.templateId,
        '--',
        newFormItem,
      )
      */

      newFormItem.dataAssemblyParam = dataAssemblyParam
      if (!isRenderChildField(newFormItem, values, fieldId, index)) {
        return null
      }

      return DynamicFormProvider.of(newFormItem)
    },
    [values],
  )

  // console.log('ChildrenForm.tsx--render',childrenFormItem)

  return (
    <Card
      title={`${childrenFormItem.label}-${index + 1}`}
      extra={<CloseOutlined onClick={() => deleteChildrenFormCard(index)} />}
    >
      {formSchema ? (
        <Fragment>
          {formSchema.map((formItem, i) => {
            return (
              <Fragment key={i}>
              {/* <Fragment key={random()}> */}
                {renderItem(
                  formItem,
                  dataAssemblyParam,
                  assemblyDataKey,
                  index,
                )}
              </Fragment>
            )
          })}
        </Fragment>
      ) : null}
    </Card>
  )
}
```

## 以上解决方法带来严重问题
动态指定key会让react更新错乱
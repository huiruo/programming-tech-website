```js
import { Map } from 'immutable'

designComponent: (state, action: PayloadAction<DesignComponent>) => {
  const { onlyCode, values, isValid } = action.payload
  const { pageAssembly } = state
  const { index, assemblyParam } = findTargetAssemblyParam(
    pageAssembly,
    onlyCode,
  )

  let valuesImmutable = Map(values)
  if (valuesImmutable.has('childrenDefaultVal')) {
    valuesImmutable = valuesImmutable.delete('childrenDefaultVal')
  }

  // ...
}
```
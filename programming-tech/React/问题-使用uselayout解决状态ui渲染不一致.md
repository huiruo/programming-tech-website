## 使用useLayoutEffect而不是useEffect主要有以下几个原因：
1. 同步执行：useLayoutEffect在浏览器绘制之前同步执行，而useEffect是在浏览器绘制之后异步执行
2. 避免视觉闪烁：对于需要立即对DOM进行修改的操作，useLayoutEffect可以避免出现闪烁或视觉不一致的情况
3. DOM测量和更新：当需要测量DOM元素或在渲染前立即更新DOM时，useLayoutEffect更适合
4. 性能考虑：虽然useLayoutEffect是同步的，可能会阻塞浏览器绘制，但在某些情况下可以提供更好的用户体验，特别是涉及到复杂动画或过渡效果时
5. 与类组件生命周期一致：useLayoutEffect的行为更接近于类组件中的componentDidMount和componentDidUpdate

6. 特定场景需求：在某些情况下，如需要在DOM更新后立即获取最新的布局信息时，useLayoutEffect是更好的选择

### 例子
```js
import { Trigger, Root, ItemText, Content, Item, Icon } from '@radix-ui/react-select';
import { Box, css, styled } from '@mui/system';
import arrowIcon from "@assets/arrow.svg"
import { useMemo } from 'react';

export const BoterSelect = (props: IBoterSelect) => {
  const { children, options, id = 'value', label = 'label', value, onChange } = props

  const labelView = useMemo<string>(() => {
    if (!value) return ''

    return options.find((item) => {
      return item[id] === value
    })?.[label] || ''
  }, [value])

  return <Root
    value={value}
    dir="ltr"
    defaultValue={value}
    onValueChange={onChange && onChange}
  >
    <Trigger asChild>
      <RadixSelTrigger width={props.width || 0}>
        <Box component={'span'}>{labelView}</Box>
        <Icon asChild>
          <Box component={'img'} src={arrowIcon} sx={{ width: 22, height: 22, pr: '6px' }} />
        </Icon>
      </RadixSelTrigger>
    </Trigger>

    <Content position="popper">
      <Dropdown width={props.width || 0}>
        {children ? children : options.map((item, i) => {
          return (
            <SelectItem key={item[id] || i} value={item[id]}>
              <ItemText> {item[label]} </ItemText>
            </SelectItem>
          );
        })}
      </Dropdown>
    </Content>
  </Root>
}

在react 中value 已经正确赋值，但是第一次渲染依旧不会默认选中对应的option，但是改动任意代码二次编译就能选中,怎么解决 @radix-ui/react-select 默认选中问题
```

### 修改之后
原因：初始化时机问题：
React的渲染周期和@radix-ui/react-select的内部状态管理可能存在不同步的情况。当组件首次渲染时，Radix UI的Select组件可能还没有完全初始化其内部状态。
```js
export const BoterSelect = (props: IBoterSelect) => {
  const { children, options, id = 'value', label = 'label', value, onChange, width } = props;
  const [internalValue, setInternalValue] = useState(value);

  useLayoutEffect(() => {
    setInternalValue(value);
  }, [value]);

  const labelView = useMemo<string>(() => {
    if (!internalValue) return '';

    return options.find((item) => item[id] === internalValue)?.[label] || '';
  }, [internalValue, options, id, label]);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <Root
      value={internalValue}
      dir="ltr"
      onValueChange={handleValueChange}
    >
      <Trigger asChild>
        <RadixSelTrigger width={width || 0}>
          <Box component={'span'}>{labelView}</Box>
          <Icon asChild>
            <Box component={'img'} src={arrowIcon} sx={{ width: 22, height: 22, pr: '6px' }} />
          </Icon>
        </RadixSelTrigger>
      </Trigger>

      <Content position="popper">
        <Dropdown width={width || 0}>
          {children ? children : options.map((item, i) => (
            <SelectItem key={item[id] || i} value={item[id]}>
              <ItemText>{item[label]}</ItemText>
            </SelectItem>
          ))}
        </Dropdown>
      </Content>
    </Root>
  );
};
```
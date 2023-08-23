
## event ts警告
```js
function ChildComponent(props: any) {
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation?.();
    // 处理点击事件
  }

  return (
    <div onClick={handleClick}>
      子组件
    </div>
  );
}
```

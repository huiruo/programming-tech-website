---
title: mockData-生成的code函数
sidebar_position: 3
---

```js
/**
 * 来源:
 * 02-vue3-源码探究-单个data好调试.html
 * 源码：
function renderComponentRoot(instance) {
  // ...
  console.log('%c=vnode-构建:start-->调用Ast生成的render函数', 'color:green', { render, instance })
  result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
  console.log('%c=vnode-构建:end-->调用Ast生成的render函数返回vnode:', 'color:green', { result })
  // ...
}
 * */
(function anonymous(
) {
  const _Vue = Vue
  const { createElementVNode: _createElementVNode } = _Vue

  const _hoisted_1 = ["onClick"]
  const _hoisted_2 = ["onClick"]

  return function render(_ctx, _cache) {
    with (_ctx) {
      const { createElementVNode: _createElementVNode, toDisplayString: _toDisplayString, openBlock: _openBlock, createElementBlock: _createElementBlock } = _Vue

      return (_openBlock(), _createElementBlock("div", null, [
        _createElementVNode("button", {
          onClick: onClickText,
          class: "btn"
        }, "Hello world,Click me", 8 /* PROPS */, _hoisted_1),
        _createElementVNode("div", null, [
          _createElementVNode("span", null, "ruo-" + _toDisplayString(msg), 1 /* TEXT */)
        ]),
        _createElementVNode("div", null, _toDisplayString(info2.age), 1 /* TEXT */),
        _createElementVNode("button", {
          onClick: onChange,
          class: "btn"
        }, "Change", 8 /* PROPS */, _hoisted_2)
      ]))
    }
  }
})
```
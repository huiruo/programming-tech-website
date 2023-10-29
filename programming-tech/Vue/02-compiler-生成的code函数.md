---
title: compiler-生成的code函数
sidebar_position: 3
---
## 测试用例
[测试主要用例](https://github.com/huiruo/programming-tech-website/blob/main/programming-tech/Vue/vue3%E6%BA%90%E7%A0%81%E8%BF%90%E8%A1%8C%E4%BE%8B%E5%AD%90/02-vue3-%E6%B5%8B%E8%AF%95%E4%B8%BB%E8%A6%81%E7%94%A8%E4%BE%8B.html)

## 第一步骤
[compile调用baseParse返回ast.json](https://github.com/huiruo/programming-tech-website/blob/main/programming-tech/Vue/vue3%E6%BA%90%E7%A0%81%E8%BF%90%E8%A1%8C%E4%BE%8B%E5%AD%90/02-vue3-%E6%B5%8B%E8%AF%95%E4%B8%BB%E8%A6%81%E7%94%A8%E4%BE%8B.html)

## 第二步骤code函数
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
## 为什么React 18 的组件定义要大写
Sat Mar 23 18:44:58 CST 2024

在React中，组件定义要求组件名称必须以大写字母开头。这是为了让React能够区分组件和HTML标签。

在JSX中，如果你使用小写字母开头定义一个组件，比如 `<myComponent />`，React会将它视为HTML标签而不是React组件。而如果你使用大写字母开头定义一个组件，比如`<MyComponent />`，React会将它视为一个自定义的React组件。

这个约定有助于提高代码的可读性，并且使得开发者能够清楚地区分哪些是React组件，哪些是HTML标签。






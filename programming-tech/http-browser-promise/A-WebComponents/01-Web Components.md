## Web Components 提供UI的灵活性
Photoshop是 Adobe Creative Cloud 生态系统中的一部分。通过使用基于 Lit[1] 构建的标准化 Web Components 策略，可以实现应用之间 UI 的一致性。

Lit 是一个构建快速、轻量级 Web Components 库。它的核心是一个消除样板代码的组件基础类，它提供了响应式状态、作用域样式和声明性模板系统，这些系统都非常小、快速且具有表现力。

Photoshop 的 UI 元素来自于Adobe 的 Web Components 库：Spectrum[2]，该库实现了Adobe的设计系统。

Spectrum Web Components 具有以下特点：
* 默认支持无障碍访问：开发时考虑到现有和新兴浏览器规范，以支持辅助技术。
* 轻量级：使用 Lit Element 实现，开销最小。
* 基于标准：基于 Web Components 标准，如自定义元素和 Shadow DOM 构建。
* 框架无关：由于浏览器级别的支持，可以与任何框架一起使用。

此外，整个 Photoshop 应用都是使用基于 Lit 的 Web Components 构建的。Lit的模板和虚拟DOM差异化使得UI更新效率高。当需要时，Web Components 的封装性也使得轻松地集成其他团队的 React 代码成为可能

整个 Photoshop 应用都是使用基于 Lit 的 Web Components 构建的。Lit的模板和虚拟DOM差异化使得UI更新效率高。当需要时，Web Components 的封装性也使得轻松地集成其他团队的 React 代码成为可能。
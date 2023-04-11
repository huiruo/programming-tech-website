---
title: 注意点-不要把 index当成list key 來使用
sidebar_position: 16
---

用index 当key,当你新增一个，底下的节点都会被重新渲染；当你没给这些节点赋值唯一编号，diff将不知道需要更新的地方，所以全量更新；


## 推荐文章
React 開發者一定要知道的底層機制 — React Fiber Reconciler

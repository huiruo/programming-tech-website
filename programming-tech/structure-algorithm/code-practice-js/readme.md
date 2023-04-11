```
其中算法，主要是以下几种：

基础技巧：分治、二分、贪心
排序算法：快速排序、归并排序、计数排序
搜索算法：回溯、递归、深度优先遍历，广度优先遍历，二叉搜索树等
图论：最短路径、最小生成树
动态规划：背包问题、最长子序列
数据结构，主要有如下几种：

数组与链表：单 / 双向链表
栈与队列
哈希表
堆：最大堆 ／ 最小堆
树与图：最近公共祖先、并查集
字符串：前缀树（字典树） ／ 后缀树
```

#### 书
```
剑指 Offer
```

## 初始化ts项目
```
添加package.json文件： npm init -y

tsc --init

yarn add typescript --save
yarn add ts-node --save
yarn add @types/node
```

#### ts 运行
```
tsc 00_ts_test.ts // 生成js

node 00_ts_test.js // 运行
```

#### tsc -w
```
配置了："outDir": "./dist/",
将会在dist 生成js文件
```
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],
  docs: [
    'start',
    'react-vue异同-react',
    'react-vue异同-vue',
    {
      label: 'React',
      type: 'category',
      collapsed: true,
      items: [
        'React/jsx-ast-render阶段',
        'React/render阶段1-beginWork',
        'React/beginWork第3步-Reconciliation-双缓存-diff',
        'React/render阶段2-completeWork',
        'React/render阶段结束后-进入commit阶段',
        'React/commit阶段-useLayoutEffect-useEffect',
        'React/workInProgress构建',
        'React/mockData-babel返回code函数',
        'React/fiberNode-fiber结构-RequestIdleCallback',
        'React/hook和闭包',
        'React/router',
        'React/setState',
        'React/setState异步-同步',
        'React/useEffect',
        'React/fiber',
        'React/diff',
        'React/react-ssr渲染',
        'React/基础-高阶组件',
        'React/基础-无状态组件和HOC-容器组件-展示组件',
        'React/库-redux-mobx',
        'React/渲染到html-原生DOM事件代理',
        'React/注意点-不要把index当成list key',
        'React/注意点-hook-setState的interval-问题',
        'React/api-自定义hooks',
        'React/api-forwardRef',
        'React/api-memo()和shouldComponentUpdate()',
        'React/api-useCallback',
        'React/api-useContext',
        'React/api-useLayoutEffect和useEffect',
        'React/api-useMemo',
        'React/api-useReducer',
        'React/api-useRef',
        {
          label: 'react函数解析',
          type: 'category',
          collapsed: true,
          items: [
            'React/react函数解析/01-18版本中初始化调用render-ReactDOMRoot.prototype.render',
            'React/react函数解析/05-1-渲染流程-performConcurrentWorkOnRoot',
            'React/react函数解析/05-2-performUnitOfWork',
            'React/react函数解析/重点-updateContainer开始渲染-18',
            'React/react函数解析/beginWork 的实现',
            'React/react函数解析/FiberRootNode-18',
            'React/react函数解析/legacyCreateRootFromDOMContainer重点方法-18',
          ]
        },
      ],
    },
    {
      label: 'Vue',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: 'vue3',
          type: 'category',
          collapsed: true,
          items: [
            'Vue/vue3/库-状态管理',
            'Vue/vue3/api-使用refs传值',
            'Vue/vue3/api-emit-传值',
            'Vue/vue3/api-props',
            'Vue/vue3/api-provide和inject-跨组件传值',
            'Vue/vue3/api-reactive和ref使用区别',
            'Vue/vue3/vue3-常用',
          ]
        },
        'Vue/baseCompile生成ast-静态提升-vnode-patch',
        'Vue/编译AST-转换AST为render',
        'Vue/render生成之后-vnode构建',
        'Vue/VNode构建之后-开始渲染',
        'Vue/data发生改变dom更新流程',
        'Vue/mockData-生成的code函数',
        'Vue/响应式原理与reactive',
        'Vue/Reactivity简单例子',
        'Vue/patch-diff',
        'Vue/proxy',
        'Vue/proxy-defineProperty区别',
        'Vue/Reflect',
        'Vue/v-for的key',
        'Vue/问题-v-if和v-for-前者优先级更高',
        'Vue/api-computed-watch区别',
        'Vue/api-nextTick',
        'Vue/api-vue3-vue2区别',
        'Vue/基础-指令-在html中使用',
        {
          label: 'Vue2',
          type: 'category',
          collapsed: true,
          items: [
            'Vue/vue2/vue渲染和更新方式',
            'Vue/vue2/父执行子组件-子执行父',
            'Vue/vue2/router-link与router-view的对应关系和映射特点',
            'Vue/vue2/Vue-router',
            'Vue/vue2/vue动画',
            'Vue/vue2/vuex状态管理',
            'Vue/vue2/watch',
            'Vue/vue2/watch路由对象this.route',
            {
              label: 'vue2开发例子',
              type: 'category',
              collapsed: true,
              items: [
                'Vue/vue2/vue2开发例子/基础-2-props限制类型',
                'Vue/vue2/vue2开发例子/例-2020-0520-vue滚动跳转',
                'Vue/vue2/vue2开发例子/例-2020-0527-写一个弹层—模态和async父组件控制显示',
                'Vue/vue2/vue2开发例子/例-2020-0527修饰符 sync自定义组件',
                'Vue/vue2/vue2开发例子/例-2021-04-修改element 默认样式deep',
                'Vue/vue2/vue2开发例子/例-2021-04-vue事件传参',
                'Vue/vue2/vue2开发例子/例-配置跨域',
              ]
            },
          ]
        },
      ]
    },
    {
      label: 'JavaScript',
      type: 'category',
      collapsed: true,
      items: [
        'JavaScript/keys-hasOwnProperty-defineProperty-forin',
        'JavaScript/this-箭头函数',
        'JavaScript/bind-call-apply',
        'JavaScript/原型-原型链',
        'JavaScript/题1-prototype能否取到值吗',
        'JavaScript/js数据类型-类型转换',
        'JavaScript/深-浅-拷贝',
        'JavaScript/判断是否是数组-判断对象-空对象',
        'JavaScript/数据类型symbol',
        'JavaScript/map数据类型-哈希表',
        'JavaScript/set数据类型',
        'JavaScript/api-eval',
        'JavaScript/运算符i++表示先赋值',
        'JavaScript/高阶函数-函数式编程-纯函数',
        'JavaScript/高阶函数-函数式编程-柯里化实现就是return fn',
        {
          label: 'es6',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/es7-es8',
            'JavaScript/class-super',
            'JavaScript/修饰器',
          ]
        },
        {
          label: 'for常用循环',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/for常用循环/正向遍历-反向',
            'JavaScript/for常用循环/最基础的循环',
            'JavaScript/for常用循环/for-in-实现深拷贝',
            'JavaScript/for常用循环/for-of-遍历对象-数组',
            'JavaScript/for常用循环/forEach',
            'JavaScript/for常用循环/keys-getOwnPropertyNames',
          ]
        },
        {
          label: 'TS',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/ts/typeScript',
            'JavaScript/ts/TypeScript装饰器',
            'JavaScript/ts/interface-type区别',
            'JavaScript/ts/装饰器',
            'JavaScript/ts/泛型参数',
            'JavaScript/ts/interface-限制函数',
          ]
        },
        {
          label: '继承',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/继承/es6-extends',
            'JavaScript/继承/原型链',
            'JavaScript/继承/构造函数继承',
            'JavaScript/继承/组合式继承',
            'JavaScript/继承/原型式继承',
            'JavaScript/继承/寄生式继承',
            'JavaScript/继承/组合继承的问题',
            'JavaScript/继承/寄生组合式继承',
            'JavaScript/继承/寄生组合式继承例子2',
            'JavaScript/继承/js面向对象继承01-高级程序参考',
          ]
        },
        {
          label: 'array方法',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/array方法/array.join把数组转化为string',
            'JavaScript/array方法/string.split-string转化成数组',
            'JavaScript/array方法/filter-过滤函数',
            'JavaScript/array方法/find-返回第一个满足条件的是对象',
            'JavaScript/array方法/findIndex-找到返回index-否则返回-1',
            'JavaScript/array方法/indexOf-找到返回index-否则返回-1',
            'JavaScript/array方法/includes-数组是否包含一个指定的值',
            'JavaScript/array方法/lastIndexOf和arr.indexOf区别是从后面开始找',
            'JavaScript/array方法/map-生成新数组-数组转map结构',
            'JavaScript/array方法/sort-采用快排和插入排序算法',
            'JavaScript/array方法/unshift开头插入',
            'JavaScript/array方法/shift删除第一个元素',
            'JavaScript/array方法/pop删除最后一个元素',
            'JavaScript/array方法/slice返回一个新数组',
            'JavaScript/array方法/splice任意位置删除',
            'JavaScript/array方法/some-若有一个满足则返回true',
            'JavaScript/array方法/every-所有满足则返回true',
            'JavaScript/array方法/reduce-执行函数返回一个值',
            'JavaScript/array方法/values-遍历数组键值',
            'JavaScript/array方法/entries-遍历数组的键名和键值',
            'JavaScript/array方法/string.search',
            'JavaScript/array方法/其他-ECMAScript 6和数组的新功能',
            'JavaScript/array方法/应用1-去重',
            'JavaScript/array方法/应用2-合并数组-concat-apply',
          ]
        },
        {
          label: 'String方法',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/String方法/substr-substring-slice',
            'JavaScript/String方法/js截取字符串',
            'JavaScript/String方法/exec-执行正则表达式模式匹配的字符串-返回匹配结果的数组',
            'JavaScript/String方法/indexOf-lastIndexOf',
            'JavaScript/String方法/match-字符串中搜索指定值并返回数组',
            'JavaScript/String方法/replace-替换字符串中指定值',
            'JavaScript/String方法/search-字符串中查找指定值返回-1或值',
            'JavaScript/String方法/trim',
          ]
        },
        {
          label: 'jsdom操作',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/jsdom操作/js操作dom',
            'JavaScript/jsdom操作/jsDom操作',
            'JavaScript/jsdom操作/div高度-宽度',
          ]
        },
        {
          label: 'react-防抖节流',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/react-防抖节流/05-2021-03-hooks防抖',
            'JavaScript/react-防抖节流/防抖-节流',
            'JavaScript/react-防抖节流/防抖-节流2',
            'JavaScript/react-防抖节流/防抖节流',
          ]
        },
      ]
    },
    {
      label: '解析-解释-编译-事件循环-promise-安全',
      type: 'category',
      collapsed: true,
      link: {
        type: 'generated-index',
      },
      items: [
        '解析-解释-编译-事件循环-promise-安全/Parser解析得到AST-Ignition解释得到字节码',
        '解析-解释-编译-事件循环-promise-安全/步骤1-预解析-变量提升',
        '解析-解释-编译-事件循环-promise-安全/步骤2-作用域-块级作用域原理',
        '解析-解释-编译-事件循环-promise-安全/步骤3-执行上下文-函数调用栈-this',
        '解析-解释-编译-事件循环-promise-安全/闭包-内存生命周期',
        {
          label: '模块化',
          type: 'category',
          collapsed: true,
          items: [
            '解析-解释-编译-事件循环-promise-安全/模块化/模块化和闭包',
            '解析-解释-编译-事件循环-promise-安全/模块化/cjs',
            '解析-解释-编译-事件循环-promise-安全/模块化/esm',
            '解析-解释-编译-事件循环-promise-安全/模块化/nodejs为什么require不能引入图片而vue_require可以引入图片',
          ]
        },
        {
          label: 'promise',
          type: 'category',
          collapsed: true,
          items: [
            '解析-解释-编译-事件循环-promise-安全/promise/Generator',
            '解析-解释-编译-事件循环-promise-安全/promise/async-await',
            '解析-解释-编译-事件循环-promise-安全/promise/题目',
            '解析-解释-编译-事件循环-promise-安全/promise/promise基础',
            '解析-解释-编译-事件循环-promise-安全/promise/实现-promise方法',
            '解析-解释-编译-事件循环-promise-安全/promise/使用-promise-all-20191121新',
            '解析-解释-编译-事件循环-promise-安全/promise/使用-promise模拟请求',
            '解析-解释-编译-事件循环-promise-安全/promise/使用-tabControl-两个请求合并promiseAll',
          ]
        },
        {
          label: 'event loop-浏览器事件',
          type: 'category',
          collapsed: true,
          items: [
            '解析-解释-编译-事件循环-promise-安全/event loop-浏览器事件/浏览器对事件的处理-1冒泡-2捕获',
            '解析-解释-编译-事件循环-promise-安全/event loop-浏览器事件/event loop',
          ]
        },
        '解析-解释-编译-事件循环-promise-安全/安全-web有两大类漏洞-XSS和CSRF',
        '解析-解释-编译-事件循环-promise-安全/辅-浏览器兼容性-防抖函数',
        '解析-解释-编译-事件循环-promise-安全/辅-ie浏览器兼容性',
        '解析-解释-编译-事件循环-promise-安全/旧-变量对象',
        '解析-解释-编译-事件循环-promise-安全/浏览器4个进程之渲染进程-浏览器内核之渲染引擎和JS引擎-V8引擎执行JS',
        '解析-解释-编译-事件循环-promise-安全/题目',
      ]
    },
    {
      label: 'html-css',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: 'requestAnimationFrame',
          type: 'category',
          collapsed: true,
          items: [
            'html-css/requestAnimationFrame/requestAnimationFrame-是宏任务吗',
            'html-css/requestAnimationFrame/requestAnimationFrame动画',
          ]
        },
        'html-css/css-1-块级元素-css',
        'html-css/css-2-块级格式化上下文BFC',
        'html-css/css-4-为什么需要清除浮动',
        'html-css/em和rem',
        'html-css/html5属性',
        'html-css/重要的html-dom属性',
        'html-css/flex-direction-wrap',
        'html-css/flex基础-三个属性-等分布局',
        'html-css/flex实现左右浮动-justifyContent',
        'html-css/flex水平垂直居中-justifyContent-alignContent',
        'html-css/垂直居中/要实现最右边请使用absolute',
        'html-css/水平居中/position-absolute水平居中的三种方法',
        {
          label: 'css3动画',
          type: 'category',
          collapsed: true,
          items: [
            'html-css/css3动画/过渡-transition/transition基础',
            'html-css/css3动画/其他-vue动画/动画延伸：vue动画',
            'html-css/css3动画/animation-不需要触发任何事件触发动画/animation基础',
            'html-css/css3动画/transform-转化/transform-基础',
          ]
        },
        {
          label: 'webgl3d',
          type: 'category',
          collapsed: true,
          items: [
            'html-css/webgl3d/readme_webgl入门',
            'html-css/webgl3d/webgl_变换矩阵',
            'html-css/webgl3d/webgl入门',
            'html-css/webgl3d/webgl与canvas-性能-动画区别',
          ]
        }
      ]
    },
    {
      label: 'http-浏览器缓存',
      type: 'category',
      collapsed: true,
      items: [
        'http-浏览器缓存/浏览器请求-渲染的流程-回流重绘',
        'http-浏览器缓存/浏览器缓存',
        'http-浏览器缓存/http1.1-http2.0-报文',
        'http-浏览器缓存/reflow-repaint',
        'http-浏览器缓存/TCP-IP-握手',
        'http-浏览器缓存/https-加密方式',
        'http-浏览器缓存/跨域-反向代理-正向代理',
        'http-浏览器缓存/辅-DNS查询过程-DNS污染-IP封锁',
        'http-浏览器缓存/状态码-请求报文之req header-响应报文res header',
        'http-浏览器缓存/鉴权-Token和JWT-cookie-session',
        'http-浏览器缓存/http-和js-stream',
        'http-浏览器缓存/辅-vpn-vps-Proxy以及shadowsocks之间的联系和区别',
        {
          label: 'WebSocket-Socks5-shadowsocks',
          type: 'category',
          collapsed: true,
          items: [
            'http-浏览器缓存/WebSocket-Socks5-shadowsocks/00-1-WebSocket和http异同',
            'http-浏览器缓存/WebSocket-Socks5-shadowsocks/00-2-HTTP-Socket区别',
            'http-浏览器缓存/WebSocket-Socks5-shadowsocks/shadowsocks',
            'http-浏览器缓存/WebSocket-Socks5-shadowsocks/Socks5',
            'http-浏览器缓存/WebSocket-Socks5-shadowsocks/Socks5和http代理区别',
            'http-浏览器缓存/WebSocket-Socks5-shadowsocks/Socks协议-OSI参考模型-百度百科',
          ]
        },
        'http-浏览器缓存/websocket/客户端',
      ]
    },
    {
      label: 'webpack',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: 'dynamic-import',
          type: 'category',
          collapsed: true,
          items: [
            'build-webpack/dynamic-import/动态加载',
            'build-webpack/dynamic-import/构建动态组件源码',
            'build-webpack/dynamic-import/vue-react-懒加载',
            'build-webpack/配置实例',
            'build-webpack/配置实例2',
          ]
        },
        'build-webpack/浏览器正常运行流程-静态-同步',
        'build-webpack/dynamic-import-动态-异步',
        'build-webpack/构建包大小优化',
        'build-webpack/构建速度优化',
        'build-webpack/06-1-webpack5新特性',
        'build-webpack/06-2-webpack5-Persistent Caching',
        'build-webpack/webpack4-增量构建',
        'build-webpack/loader',
        'build-webpack/resolve',
        'build-webpack/webpack基础原理',
        'build-webpack/打包原理',
        'build-webpack/vite',
      ]
    },
    {
      label: 'AST-Babel',
      type: 'category',
      collapsed: true,
      items: [
        'build-AST-Babel/AST',
        'build-AST-Babel/babel',
        'build-AST-Babel/babel-编译构建之modules',
        'build-AST-Babel/babel-loader',
        'build-AST-Babel/babel-standalone使用',
        'build-AST-Babel/transform-runtime',
        'build-AST-Babel/less和scss的区别',
        'build-AST-Babel/断点调试要领',
        {
          label: '代码格式化',
          type: 'category',
          collapsed: true,
          items: [
            'build-AST-Babel/eslint-Prettier配置',
            'build-AST-Babel/代码格式化',
          ]
        },
      ]
    },
    {
      label: 'monorepo-turbopack',
      type: 'category',
      collapsed: true,
      items: [
        'build-monorepo-turbopack/monorepo',
        'build-monorepo-turbopack/turbopack',
      ]
    },
    {
      label: 'ssr服务端渲染-nodejs',
      type: 'category',
      collapsed: true,
      items: [
        'ssr服务端渲染-nodejs/react-ssr-demo/react18-ssr',
        'ssr服务端渲染-nodejs/NextJS',
        'ssr服务端渲染-nodejs/nodejs事件循环',
        'ssr服务端渲染-nodejs/TypeORM和Prisma',
      ]
    },
    {
      label: '优化',
      type: 'category',
      collapsed: true,
      items: [
        '优化/React',
        '优化/Vue优化',
        '优化/首屏加载',
        '优化/CDN-内容分发网络',
        '优化/总结',
        '优化/国际化',
      ]
    },
    {
      label: 'C++-V8',
      type: 'category',
      collapsed: true,
      items: [
        'C++-V8/v8/v8基础',
        'C++-V8/编译工具-depot_tools',
        'C++-V8/v8编译',
        'C++-V8/chromium/chromium编译',
        'C++-V8/gn命令',
        'C++-V8/visual studio入门',
        {
          label: 'C++',
          type: 'category',
          collapsed: true,
          items: [
            'C++-V8/C++/start',
            'C++-V8/C++/存储类',
            'C++-V8/C++/运算符',
            'C++-V8/C++/运算符2',
            'C++-V8/C++/函数',
            'C++-V8/C++/条件-循环',
            'C++-V8/C++/数组',
            'C++-V8/C++/字符串',
            'C++-V8/C++/指针-引用',
            'C++-V8/C++/输入输出',
            'C++-V8/C++/数据结构',
            'C++-V8/C++/10-1-类-对象',
            'C++-V8/C++/10-2-接口抽象类',
            'C++-V8/C++/继承',
            'C++-V8/C++/重载运算符和重载函数',
            'C++-V8/C++/多态',
            'C++-V8/C++/命名空间',
            'C++-V8/C++/模板-泛型',
            'C++-V8/C++/预处理器',
            'C++-V8/C++/动态内存',
            'C++-V8/C++/多线程',
            'C++-V8/C++/文件和流',
            'C++-V8/C++/信号处理',
            'C++-V8/C++/异常处理',
          ]
        },
      ]
    },
    {
      label: 'backend',
      type: 'category',
      collapsed: true,
      items: [
        'backend/消息队列',
        'backend/pm2',
        'backend/Docker',
        'backend/redis',
        'backend/Apache/Apache',
        {
          label: 'golang',
          type: 'category',
          collapsed: true,
          items: [
            'backend/golang/03-1-function',
            'backend/golang/03-2-函数拥有者',
            'backend/golang/go-备份/go备份',
            'backend/golang/golang启动一个简单的http服务',
            'backend/golang/协程/helloworld',
            'backend/golang/字符串拼接',
            'backend/golang/指针',
            'backend/golang/类型转换',
          ]
        },
        {
          label: 'mysql',
          type: 'category',
          collapsed: true,
          items: [
            'backend/mysql/mysql-insert',
            'backend/mysql/mysql-问题',
            'backend/mysql/mysql8安装',
            'backend/mysql/mysql行格式',
            'backend/mysql/查看已登录密码',
          ]
        },
      ]
    },
    {
      label: '设计模式',
      type: 'category',
      collapsed: true,
      items: [
        '设计模式/README',
        '设计模式/单例模式',
        '设计模式/代理模式',
        '设计模式/工厂模式',
        '设计模式/03-1-发布订阅模式-或观察者模式',
        '设计模式/03-2-js事件模型',
        '设计模式/适配器模式',
        '设计模式/装饰器模式',
        '设计模式/a-策略模式',
        '设计模式/a-命令模式',
      ]
    },
    {
      label: '正则',
      type: 'category',
      collapsed: true,
      items: [
        '正则/00-1-正则-基础',
        '正则/00-2-例子解析',
        '正则/02-1-exec',
        '正则/02-2-exec清晰例子',
        '正则/辅助-例子',
        '正则/正则例子/特殊需求正则表达',
        '正则/正则例子/校验数字的正则表达式',
        '正则/正则例子/校验字符的正则表达式',
        '正则/test',
      ]
    },
  ],

  structureAlgorithm: [
    'structure-algorithm/README',
    'structure-algorithm/递归/递归例子',
    'structure-algorithm/二叉堆和堆排序/01-1-二叉堆',
    'structure-algorithm/数据结构/关于数据结构',
    {
      label: '前端中数据结构和算法',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/前端中数据结构和算法/js数组和算法',
        'structure-algorithm/前端中数据结构和算法/js原型链和链表',
      ]
    },
    {
      label: '图-深度优先遍历-广度优先遍历',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/图-深度优先遍历-广度优先遍历/图的两种遍历',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/图的遍历-深度优先遍历-DFS',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/广度优先搜索',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/React-算法之深度优先遍历',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/表示无向图的数据类型',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/图',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/图-术语',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/图-运用场景',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/图和树的区别',
        'structure-algorithm/图-深度优先遍历-广度优先遍历/无向图',
      ]
    },
    {
      label: '队列和双端队列',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/队列和双端队列/队列-栈和队列的区别',
        'structure-algorithm/队列和双端队列/a-双端队列',
        'structure-algorithm/队列和双端队列/js的任务队列',
      ]
    },
    {
      label: '基础数学-算法表示-算法复杂度',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/基础数学-算法表示-算法复杂度/基础数学-算法表示',
        'structure-algorithm/基础数学-算法表示-算法复杂度/计算机领域lg常是指2为底数',
        'structure-algorithm/基础数学-算法表示-算法复杂度/数学模型',
        'structure-algorithm/基础数学-算法表示-算法复杂度/算法分析1',
        'structure-algorithm/基础数学-算法表示-算法复杂度/算法分析总结1',
        'structure-algorithm/基础数学-算法表示-算法复杂度/算法分析总结2',
        'structure-algorithm/基础数学-算法表示-算法复杂度/算法复杂度',
      ]
    },
    'structure-algorithm/集合/集合运算',
    {
      label: '链表',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/链表/01-1-链表',
        'structure-algorithm/链表/队列链表实现',
        'structure-algorithm/链表/链表背包的实现',
        'structure-algorithm/链表/双向链表和单向链表区别',
        'structure-algorithm/链表/循环链表',
        'structure-algorithm/链表/有序链表',
      ]
    },
    {
      label: '排序算法',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/排序算法/03-1-选择排序-oN2',
        'structure-algorithm/排序算法/04-1-插入排序-oN或oN2',
        'structure-algorithm/排序算法/05-1-归并排序-nlogn-常用',
        'structure-algorithm/排序算法/06-1-快速排序-nlogn-最常用',
        'structure-algorithm/排序算法/06-2-快速排序-优化版本',
        'structure-algorithm/排序算法/归并和分治',
        'structure-algorithm/排序算法/基数排序',
        'structure-algorithm/排序算法/前言',
        'structure-algorithm/排序算法/桶排序',
      ]
    },
    {
      label: 'Tree',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/树/二叉树-二叉树种类',
        'structure-algorithm/树/例1-二叉搜索树-BST',
        'structure-algorithm/树/例2-1-自平衡树',
        'structure-algorithm/树/例3-1-红黑树',
        'structure-algorithm/树/例4-AVL树',
        'structure-algorithm/树/树',
      ]
    },
    {
      label: '搜索算法',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/搜索算法/02-1-二分查找',
        'structure-algorithm/搜索算法/二叉查找树',
        'structure-algorithm/搜索算法/二分查找',
        'structure-algorithm/搜索算法/符号表-散列表/扩展-hasCode',
        'structure-algorithm/搜索算法/符号表-散列表/散列表',
        'structure-algorithm/搜索算法/符号表-散列表/算法书-散列表',
        'structure-algorithm/搜索算法/符号表-树-二叉树-二叉查找树/二叉查找树',
        'structure-algorithm/搜索算法/符号表-树-二叉树-二叉查找树/二叉查找树与平衡二叉树的区别',
        'structure-algorithm/搜索算法/符号表-树-二叉树-二叉查找树/二叉树',
        'structure-algorithm/搜索算法/符号表-树-二叉树-二叉查找树/红黑树与平衡二叉树',
        'structure-algorithm/搜索算法/符号表-树-二叉树-二叉查找树/平衡二叉树',
        'structure-algorithm/搜索算法/符号表-树-二叉树-二叉查找树/树',
        'structure-algorithm/搜索算法/前言',
      ]
    },
    {
      label: '算法设计与技巧',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/算法设计与技巧/01-1-分治算法',
        'structure-algorithm/算法设计与技巧/02-1-动态规划',
        'structure-algorithm/算法设计与技巧/02-2-动态规划和分治区别',
        'structure-algorithm/算法设计与技巧/03-1-贪心算法',
        'structure-algorithm/算法设计与技巧/04-2-回溯算法',
        'structure-algorithm/算法设计与技巧/05-1-滑动窗口算法',
        'structure-algorithm/算法设计与技巧/关于动态规划',
      ]
    },
    {
      label: '栈-背包',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/栈-背包/背包',
        'structure-algorithm/栈-背包/集合类数据类型的实现-定容栈',
        'structure-algorithm/栈-背包/集合类数据类型的实现-集合的迭代',
        'structure-algorithm/栈-背包/链式数据结构很重要-实现背包-队列-栈',
        'structure-algorithm/栈-背包/栈的应用',
      ]
    },
    {
      label: '字典和散列表',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/字典和散列表/字典',
        'structure-algorithm/字典和散列表/a-散列表',
        'structure-algorithm/字典和散列表/weakmap和map',
      ]
    },
    'structure-algorithm/字符串/字符串查找',
    {
      label: 'code-practice',
      type: 'category',
      collapsed: true,
      items: [
        'structure-algorithm/code-practice-java/README-java',
        'structure-algorithm/code-practice-js/如何做题',
        'structure-algorithm/code-practice-js/无重复字符的最长子串/doc',
        'structure-algorithm/code-practice-js/寻找两个正序数组的中位数/doc',
        'structure-algorithm/code-practice-js/最长回文子串/doc',
        'structure-algorithm/code-practice-js/readme',
      ]
    }
  ],
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;

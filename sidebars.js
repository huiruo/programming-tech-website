/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],
  docs: [
    'start',
    {
      label: 'JavaScript',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: '继承',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/继承/es6-extends',
            'JavaScript/继承/js面向对象继承01-高级程序参考',
            'JavaScript/继承/原型链',
            'JavaScript/继承/原型式继承',
            'JavaScript/继承/寄生式继承',
            'JavaScript/继承/寄生组合式继承',
            'JavaScript/继承/寄生组合式继承例子2',
            'JavaScript/继承/构造函数继承',
            'JavaScript/继承/组合式继承',
            'JavaScript/继承/组合继承的问题',
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
            'JavaScript/array方法/unshift开头插入-splice也可以实现',
            'JavaScript/array方法/shift删除第一个元素',
            'JavaScript/array方法/pop删除最后一个元素',
            'JavaScript/array方法/splice任意位置删除',
            'JavaScript/array方法/slice返回一个新数组',
            'JavaScript/array方法/some-若有一个满足则返回true',
            'JavaScript/array方法/every-所有满足则返回true',
            'JavaScript/array方法/reduce-执行函数返回一个值',
            'JavaScript/array方法/values-遍历数组键值',
            'JavaScript/array方法/entries-遍历数组的键名和键值',
            'JavaScript/array方法/string.search',
            'JavaScript/array方法/对象数组指定过滤-运用set',
            'JavaScript/array方法/其他-ECMAScript 6和数组的新功能',
            'JavaScript/array方法/应用1-去重',
            'JavaScript/array方法/应用2-合并数组-concat-apply',
          ]
        },
        {
          label: 'for常用循环',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/for循环/forof-forEach-实现原理',
            'JavaScript/for循环/for-of-遍历对象-数组',
            'JavaScript/for循环/for-in-实现深拷贝',
            'JavaScript/for循环/keys-getOwnPropertyNames-defineProperty',
            'JavaScript/for循环/正向遍历-反向',
            'JavaScript/for循环/values-循环对象',
            'JavaScript/for循环/最基础的循环',
          ]
        },
        {
          label: 'TS',
          type: 'category',
          collapsed: true,
          items: [
            'JavaScript/ts/typeScript',
            'JavaScript/ts/装饰器',
            'JavaScript/ts/装饰器2',
            'JavaScript/ts/interface-type区别',
            'JavaScript/ts/实战',
            'JavaScript/ts/使用keyof解决对象ts限定',
            'JavaScript/ts/泛型-record',
          ]
        },
        'JavaScript/数据类型-类型转换',
        'JavaScript/判断是否是数组-判断对象-空对象',
        'JavaScript/数据类型symbol',
        'JavaScript/原型-原型链',
        'JavaScript/this-箭头函数',
        'JavaScript/bind-call-apply',
        'JavaScript/map数据类型-哈希表',
        'JavaScript/set数据类型',
        'JavaScript/运算符i++表示先赋值',
        'JavaScript/es6-es7-es8',
        'JavaScript/Reflect',
        'JavaScript/class-super',
        'JavaScript/super',
        'JavaScript/立即执行函数',
        'JavaScript/高阶函数-函数式编程-纯函数-柯里化实现就是return fn',
        'JavaScript/深-浅-拷贝',
        'JavaScript/window.history',
        'JavaScript/js错误处理',
        'JavaScript/URLSearchParams-decodeURIComponent',
        'JavaScript/api-eval',
      ]
    },
    {
      label: 'webGL',
      type: 'category',
      collapsed: true,
      items: [
        'webGL/webgl与canvas-性能-动画区别',
        'webGL/webgl怎么学',
        'webGL/webgl_变换矩阵',
        {
          label: 'react-three-fiber',
          type: 'category',
          collapsed: true,
          items: [
            'webGL/threejs/react-three-fiber/react-three-fiber',
            'webGL/threejs/react-three-fiber/firstScene',
            'webGL/threejs/react-three-fiber/Canvas',
            'webGL/threejs/react-three-fiber/对象属性与传参',
            'webGL/threejs/react-three-fiber/Hooks',
            'webGL/threejs/react-three-fiber/Events',
            'webGL/threejs/react-three-fiber/事件与交互',
            'webGL/threejs/react-three-fiber/Loading-Models',
          ]
        },
      ]
    },
    {
      label: 'animation',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: 'requestAnimationFrame',
          type: 'category',
          collapsed: true,
          items: [
            'animation/requestAnimationFrame/requestAnimationFrame-是宏任务吗',
          ]
        },
        'animation/transition-过渡/transition基础',
        'animation/animation-不需要触发任何事件触发动画/animation基础',
        'animation/transform-转化/transform基础',
        'animation/其他-vue动画/动画延伸-vue动画',
      ]
    },
    {
      label: 'http-browser-promise',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: 'promise',
          type: 'category',
          collapsed: true,
          items: [
            'http-browser-promise/promise/promise基础',
            'http-browser-promise/promise/promise实现原理',
            'http-browser-promise/promise/promise具体实现',
            'http-browser-promise/promise/async-await',
            'http-browser-promise/promise/Generator',
            'http-browser-promise/promise/题目',
            'http-browser-promise/promise/axios',
          ]
        },
        {
          label: '防抖节流',
          type: 'category',
          collapsed: true,
          items: [
            'http-browser-promise/防抖节流/防抖',
            'http-browser-promise/防抖节流/节流',
            'http-browser-promise/防抖节流/按钮更适合防抖-踩坑',
            'http-browser-promise/防抖节流/04-2021-03-hooks防抖',
          ]
        },
        'http-browser-promise/浏览器4个进程之渲染进程-浏览器内核之渲染引擎和JS引擎-V8引擎执行JS',
        'http-browser-promise/浏览器对事件的处理-1冒泡-2捕获',
        'http-browser-promise/web安全漏洞-XSS和CSRF',
        'http-browser-promise/辅-浏览器兼容性',
        'http-browser-promise/题目',
        'http-browser-promise/浏览器请求-渲染的流程',
        'http-browser-promise/浏览器缓存',
        'http-browser-promise/service-worker',
        'http-browser-promise/http1.1-报文',
        'http-browser-promise/reflow-repaint',
        'http-browser-promise/TCP-IP-握手',
        'http-browser-promise/https-加密方式',
        'http-browser-promise/跨域-反向代理-正向代理',
        'http-browser-promise/辅-DNS查询过程-DNS污染-IP封锁',
        'http-browser-promise/鉴权-Token和JWT-cookie-session',
        'http-browser-promise/http-和js-stream',
        'http-browser-promise/辅-vpn-vps-Proxy以及shadowsocks之间的联系和区别',
        {
          label: 'WebSocket-Socks5-shadowsocks',
          type: 'category',
          collapsed: true,
          items: [
            'http-browser-promise/WebSocket-Socks5-shadowsocks/00-1-WebSocket和http异同',
            'http-browser-promise/WebSocket-Socks5-shadowsocks/00-2-HTTP-Socket区别',
            'http-browser-promise/WebSocket-Socks5-shadowsocks/shadowsocks',
            'http-browser-promise/WebSocket-Socks5-shadowsocks/Socks5',
            'http-browser-promise/WebSocket-Socks5-shadowsocks/Socks5和http代理区别',
            'http-browser-promise/WebSocket-Socks5-shadowsocks/Socks协议-OSI参考模型-百度百科',
          ]
        }
      ]
    },
    {
      label: 'parsing-interpretation-compilation',
      type: 'category',
      collapsed: true,
      items: [
        {
          label: '模块化',
          type: 'category',
          collapsed: true,
          items: [
            'parsing-interpretation-compilation/模块化/esm',
            'parsing-interpretation-compilation/模块化/cjs',
            'parsing-interpretation-compilation/模块化/模块化和闭包',
            'parsing-interpretation-compilation/模块化/nodejs为什么require不能引入图片而vue_require可以引入图片',
          ]
        },
        {
          label: '单元测试',
          type: 'category',
          collapsed: true,
          items: [
            'parsing-interpretation-compilation/单元测试/mocha',
            'parsing-interpretation-compilation/单元测试/mocha测试智能合约',
            'parsing-interpretation-compilation/单元测试/钩子',
            'parsing-interpretation-compilation/单元测试/only独家测试',
            'parsing-interpretation-compilation/单元测试/skip包容性测试',
            'parsing-interpretation-compilation/单元测试/其他api',
            'parsing-interpretation-compilation/单元测试/时间',
          ]
        },
        'parsing-interpretation-compilation/Parser解析得到AST-Ignition解释得到字节码',
        'parsing-interpretation-compilation/step1-预解析-变量提升',
        'parsing-interpretation-compilation/step2-作用域-块级作用域原理',
        'parsing-interpretation-compilation/step3-执行上下文-函数调用栈-this',
        'parsing-interpretation-compilation/闭包-内存生命周期',
        'parsing-interpretation-compilation/verdaccio私有库搭建',
        'parsing-interpretation-compilation/旧-变量对象',
      ]
    },
    {
      label: 'webpack-AST-Babel',
      type: 'category',
      collapsed: true,
      items: [
        'webpack-AST-Babel/AST',
        'webpack-AST-Babel/babel',
        'webpack-AST-Babel/babel-编译构建之preset属性值modules',
        'webpack-AST-Babel/babel插件-transform-runtime',
        'webpack-AST-Babel/babel-standalone-babel调试工具',
        'webpack-AST-Babel/断点调试要领-调试开源库',
        {
          label: '代码格式化',
          type: 'category',
          collapsed: true,
          items: [
            'webpack-AST-Babel/eslint-Prettier配置',
            'webpack-AST-Babel/配置代码格式化',
          ]
        },
        {
          label: 'dynamic-import',
          type: 'category',
          collapsed: true,
          items: [
            'webpack-AST-Babel/dynamic-import/动态加载',
            'webpack-AST-Babel/dynamic-import/构建动态组件源码',
            'webpack-AST-Babel/dynamic-import/vue-react-懒加载',
            'webpack-AST-Babel/配置实例',
            'webpack-AST-Babel/配置实例2',
          ]
        },
        'webpack-AST-Babel/webpack基础原理',
        'webpack-AST-Babel/浏览器正常运行流程-静态-同步',
        'webpack-AST-Babel/dynamic-import-动态-异步',
        'webpack-AST-Babel/构建包大小优化',
        'webpack-AST-Babel/构建速度优化',
        'webpack-AST-Babel/webpack4-增量构建',
        'webpack-AST-Babel/webpack5-Persistent-Caching',
        'webpack-AST-Babel/loader-plugin',
        'webpack-AST-Babel/resolve-devServer-等参数',
        'webpack-AST-Babel/vite',
      ]
    },
    {
      label: 'SSR-Nodejs',
      type: 'category',
      collapsed: true,
      items: [
        'SSR-Nodejs/nodejs事件循环',
        'SSR-Nodejs/worker_threads',
        'SSR-Nodejs/TypeORM和Prisma',
      ]
    },
    {
      label: 'web optimization',
      type: 'category',
      collapsed: true,
      items: [
        'web-optimization/总结',
        'web-optimization/升级http2',
        'web-optimization/React',
        'web-optimization/Vue',
        'web-optimization/CDN-内容分发网络',
        'web-optimization/国际化',
        'web-optimization/Catalog',
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
        'C++-V8/Safari-Chrome',
        'C++-V8/electron-tauri',
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
        'backend/nextjs/NextJS',
        'backend/nextjs/nextjs部署',
        'backend/nextjs/nextjs跨域',
        'backend/消息队列',
        'backend/pm2',
        'backend/redis',
        'backend/Apache/Apache',
        'backend/进程-线程-协程',
        {
          label: 'golang',
          type: 'category',
          collapsed: true,
          items: [
            'backend/golang/golang启动一个简单的http服务',
            'backend/golang/03-1-function',
            'backend/golang/03-2-函数拥有者',
            'backend/golang/协程-helloworld',
            'backend/golang/字符串拼接',
            'backend/golang/指针',
            'backend/golang/类型转换',
            'backend/golang/go-备份/go备份',
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
        {
          label: 'nginx',
          type: 'category',
          collapsed: true,
          items: [
            'backend/nginx/nginx',
          ]
        },
      ]
    },
    {
      label: 'docker',
      type: 'category',
      collapsed: true,
      items: [
        'docker/Docker基础',
        'docker/Docker基础2',
        'docker/Dockerfile命令',
        'docker/Docker命令',
        'docker/如何获取docker容器的运行状态',
        'docker/Harbor',
        'docker/K8S基础',
        'docker/Kubernetes',
        'docker/dockerSwarm',
        'docker/dockerignore作用',
        'docker/docker中的nginx配置',
        'docker/理解微服务',
      ]
    },
    {
      label: 'design patterns',
      type: 'category',
      collapsed: true,
      items: [
        'design-patterns/README',
        'design-patterns/单例模式',
        'design-patterns/代理模式',
        'design-patterns/工厂模式',
        'design-patterns/03-1-发布订阅模式-或观察者模式',
        'design-patterns/03-2-js事件模型',
        'design-patterns/适配器模式',
        'design-patterns/装饰器模式',
        'design-patterns/a-策略模式',
        'design-patterns/a-命令模式',
      ]
    },
    {
      label: 'regular-string',
      type: 'category',
      collapsed: true,
      items: [
        'regular-string/正则-基础',
        'regular-string/exec-test',
        'regular-string/string-match-搜索指定值并返回数组',
        'regular-string/string-replace-替换字符串中指定值',
        'regular-string/string-indexOf-lastIndexOf',
        'regular-string/string-截取字符串',
        'regular-string/string-search-字符串中查找指定值返回-1或值',
        'regular-string/string-startsWith-indexOf-的区别',
        'regular-string/string-substr-substring-slice',
        'regular-string/string-trim',
        'regular-string/正则限制-验证例子',
        'regular-string/例子解析',
        'regular-string/例子-校验字符的正则表达式',
        'regular-string/例子-校验数字的正则表达式',
        'regular-string/例子-特殊需求正则表达',
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

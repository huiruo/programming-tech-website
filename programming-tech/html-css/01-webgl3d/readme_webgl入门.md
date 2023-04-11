```
作者：Zheng
链接：https://www.zhihu.com/question/26521256/answer/63869753
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

找一本入门书籍开始阅读，作者最好是该行业从业多年或该领域的专家，其代码会比较规范，基础概念也会讲得很清楚。

针对每个知识点做小demo进行学习，尝试修改参数并查看结果。

图形学相关的数学要掌握，向量，几何体的方程表达，基本计算。

了解一些图形渲染、GPU方面的知识，加深对WebGL渲染管线的认知。

什么时候都不该忽略性能，WebGL也如此，看一些性能相关的最佳实践，从源头避免写出性能很差的3D程序。

在OpenGL ES、OpenGL方向扩展。如果你只是想利用WebGL技术快速做出一些效果，可以选择目前较为成熟的库，例如Three.js。

关于性能，你可以参考下面这些资源：Debugging and Optimizing WebGL Applications。

Google的两位工程师介绍WebGL性能相关的议题。Thinking in WebGL: Reducing Memory Usage。

关于内存方面的考虑。Three.js源码注释 本专栏包括THREE.js整个代码库的源码注释，从数学库，几何对象，相机，材质，纹理，灯光，着色器，内核，详尽细致的注释了每段代码，在注释中，尽可能的包括本人学习wegbl过程中遇到的数学问题，着色器问题，甚至是各种图形学的技术，都进行了详细的补充。Efficient JavaScript Vector Math。glMatrix的作者介绍如何编写高性能的矢量函数库。Optimizing WebGL Applications with Don Olmsteade 一个关于WebGL优化的视频。Don Olmsteade供职于Sony，在PlayStation上做WebGL开发。

最近有人在询问书籍的事情，我把我看过或者了解过的书列在下面：

WebGL Beginner’s Guide 入门书籍，强烈推荐。

Beginning WebGL for HTML5 另一本入门，推荐。

Professional WebGL Programming: Developing 3D Graphics for the Web 比较深入的一本书，适合进阶阅读，强烈推荐。

WebGL: Up and Running 入门书籍，有比较多的three.js部分介绍，对于想从底层掌握WebGL同学不太适合。该书作者也同时维护一个学习WebGL的网站：Learning WebGL。上面的课程非常不错。

WebGL Programming Guide: Interactive 3D Graphics Programming with WebGL 基础知识比较全面。推荐看这本书的高阶部分，介绍的内容也比较丰富。

Graphics Shaders: Theory and Practice 专门介绍图形着色器的书（吐槽一下清华大学出版社的翻译版本，排版差，翻译更差，可见就是糊弄出来的一本书）。GPU编程与CG语言之阳春白雪下里巴人 好奇怪的书名，这是国内一位作者所写，开篇痛诉国内科研之现状，作者对待做学问的态度还是很不错的。少有的优秀中文资料，推荐。网上下载的地方很多，自己百度就好了。WebGL Insights 一本WebGL应用经验的文章合集，适合高阶阅读，如果你开发比较复杂且要求高性能的WebGL程序，这本书会提供比较多的经验。以上书目我都列出了豆瓣地址，原版书大家可以在http://amazon.cn或者http://amazon.com上买到，阅读英文有困难的同学可以考虑中文版（但是部分没有翻译版本）。另外，向业界牛人学习也是一种学习方法：Brandon Jones：谷歌 Chrome WebVR/WebGL 工程师 https://twitter.com/TojiroGregg Tavares：也是在谷歌工作 https://twitter.com/greggman?lang=en，可以去 stackoverflow 上面去看看他回答的有关 WebGL 的内容（User gman）。Tony Parisi：Virtual Reality OG. Entrepreneur. Angel Investor. Co-Creator, VRML, glTF. Head of VR/AR @unity3d. WebGL/WebVR Meetups. Author, O'Reilly WebGL/VR Books. Music. https://twitter.com/auradeluxe我都用 WebGL 做了啥？百度地图 PC 版、WebApp 以及开放平台 JSAPI GL 版所用的渲染引擎
```
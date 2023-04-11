
#### 书籍
```text
源码：
https://gitee.com/ZC_86/algorithms---4th-edition/tree/master/src/main/java/edu/princeton/cs/algs4

配置教程：
https://zhuanlan.zhihu.com/p/25551032

github:源码
https://github.com/kevin-wayne/algs4

官网：
https://algs4.cs.princeton.edu/code/
```

#### java 环境，为了配置 算法包使用
```
键-属性-高级系统设置-高级-环境变量-系统变量

点击新建，如图所示，变量名：JAVA_HOME 变量值：默认位置为C:\Program Files\Java 下，复制一下路径粘贴到这里即可，如下
JAVA_HOME
C:\Program Files\Java\jdk1.8.0_321

点击新建，如图所示，变量名：CLASSPATH 变量值输入：.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar;
CLASSPATH
.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar


点击已经有的PATH，点击编辑，新建输入：%JAVA_HOME%\jre\bin;
%JAVA_HOME%\jre\bin

输入 javac -version 回车之后会显示出版本信息则表示安装配置成功

输入java -version 回车之后会显示出版本信息则表示安装配置成功
```

#### 问题： 'javac' 不是内部或外部命令，也不是可运行的程序
```
步骤一：找到JDK下的bin目录，运行cmd,输入javac，能提示，说明环境配置有问题

(1)新建系统变量->变量名"JAVA_HOME"，变量值"C:\Java\jdk1.8.0_05"（即JDK的安装路径） 
(2)编辑系统变量->变量名"Path"，在原变量值的最后面加上“;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin” ,win10去掉分号，隔行即可，笔者下面有图
(3)新建系统变量->变量名“CLASSPATH”,变量值“.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar”

参考：
https://blog.csdn.net/qq_40670946/article/details/90200364
```


#### 解决好环境问题；配置算法教程
```
点击进入 Java Algorithms and Clients ，点击下方红色方框内 algs4.jar

到下载目录拷贝或剪切 algs4.jar 都可以，然后到C:\Program Files\Java\jdk1.8.0_121\lib 这个位置来，粘贴刚刚复制的 algs4.jar ，如图

注：官方网页给出的路径为：
C:\Users\username\algs4\algs4.jar;


2.接下来点击计算机右键-属性-高级系统设置-高级-环境变量-系统变量，找到CLASSPATH

在末尾处输入:
%JAVA_HOME%\lib\algs4.jar;

.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar
改为：

.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\lib\algs4.jar
```


#### 集合项目
git clone https://github.com/kevin-wayne/algs4.git
```
找到里面的 main 文件夹

再到Java Algorithms and Clients 点击下方红色方框内的 algs4-data.zip 进行下载。
https://algs4.cs.princeton.edu/code/

下载完成之后把里面的文件解压到我们刚刚提到的main文件夹下，如图:

```

```
编译：
javac edu/princeton/cs/algs4/BinarySearch.java
javac java/edu/princeton/cs/algs4/BinarySearch.java

这个到根目录执行才有用：
javac BinarySearch.java
再输入,结果路径错误：
java BinarySearch largeW.txt < largeT.txt | more

把 生成的：BinarySearch.class 复制到:
D:\code_library2\algs4\src\main
java BinarySearch largeW.txt < largeT.txt | more
java BinarySearch.class largeW.txt < largeT.txt | more

最后这样才成功：
D:\code_library2\algs4\src\main\java\edu\princeton\cs\algs4>

java edu.princeton.cs.algs4.BinarySearch largeW.txt < largeT.txt | more

无法加载主类参考：
https://www.cnblogs.com/wangxiaoha/p/6293340.html
```
---
title: 编译工具-depot_tools
sidebar_position: 3
---

## 编译前置工作
depot_tools是个工具包（depot是仓库的意思），里面包含gclient、gcl、gn和ninja等工具，这些根据都是使用python写的。其主要的功能是对git的增强，让代码管理和编译更加简单;

要支持python 3，需要python 2.7或3.8。

下载地址：https://storage.googleapis.com/chrome-infra/depot_tools.zip

将depot_tools添加到你的PATH开头（必须在任何Python和或git的安装之前）。

执行gclient。它做一些初始化工作，与v8代码无关

gclient执行完毕，用where python查看depot_tools中的python.bat路径信息，确保python.bat在环境变量PATH中的位置在系统中原有(如果有)的python环境位置前面

### 如何拉取指定版本
有三种方法：
* 使用-r参数执行sync命令，指定.gclient中solution的引用版本为要使用的版本。
* 先使用--nohooks --with_tags --with_branch_heads拉取最新版本参数执行sync命令，然后手动checkout到指定的版本后，重新执行无参数的sync命令。
* 修改.gclient中solution的url，在仓库地址后加上@version，version可以是仓库的branch名或者tag名或者hash。

## 获取代码-fetch
fetch还有2个可选的参数：
* –nohooks。这个参数表示获取代码完成之后不执行runhooks动作。也就仅仅获取代码。

* –no-history。这个参数表示对代码仓库执行git shallow clones，就不会获得原仓库的全部历史提交，这样可以减少拷贝代码仓库的大小。按照Chromium文档的介绍，不加上这个参数大概会获取22GB大小的数据，而加上这个参数只会获取6.5GB大小的数据。之后可以对这个仓库再执行–unshallow操作 就会获得完整的历史记录。

fetch命令最后调用的是gclient sync来获取代码的

选择一个空目录并运行以下命令之一：
```
$ fetch chromium  # Basic checkout for desktop Chromium
$ fetch android   # Chromium checkout for Android platform
$ fetch ios       # Chromium checkout for iOS platform
fetch chromium -no-history # 不下载全部的代码提交历史，推荐使用这个

fetch v8
```

中途要是网络中断的话输入gclient sync -v来重新下载代码。

当fetch完成，你的工作目录下：
```
.gclient   # A configuration file for you source checkout
src/       # Top-level Chromium source checkout.
```

最后：
```powershell
$ gclient sync
```


## gclient命令
gclient是进行代码拉取、工具部署、代码管理的关键组件。一旦拥有了.gclient配置文件，那么之后的工作就都可以通过gclient完成，不再需要fetch了。

gclient命令其实对应着gclient.py脚本，它是用来管理多个模块源代码仓库的工具。它封装一些常用的git命令，对所有的模块生效。可以看到gclient的功能众多，如下总结一下：
* config。创建一个.gclient配置文件。
* diff。类似git的diff命令，用来比较所有模块提交代码的差异。
* help。显示命令的帮助。
* revert。revert一个提交。
* stauts。类似git status命令，用来显示所有模块代码的状态。
* sync。用来同步所有模块的代码。
* root 输出项目的根目录。
* runhooks 执行项目配置里的hooks。当你执行sync时使用了–nohooks参数时，就可以使用该命令来手动执行hooks。根据DEPS文件的描述执行hook任务。
* recurse 在项目中的每个依赖中都执行一条命令。
* fetch 拉取所有模块中的更新。


sync和runhooks命令比较重要，以下分别介绍一下。

### gclient命令-sync
sync就是用来同步所有模块的代码。当我们把Chromium仓库的代码切换到某个版本，则必须也要运行gclient sync来同步对应依赖的其他仓库代码，否则就有可能代码编译失败。


sync命令主要依赖两个文件工作，所以在这里先讲解这两个文件格式
* .gclient 此文件一般通过fetch自动生成，也可以手动生成，其格式就是python语法。其中记录一个solution数组，每个solution表示一个项目的基础配置。其中最重要的是三个属性:
    * name 项目名
    * url 项目仓库地址
    * deps_file 依赖配置文件
* DEPS 此文件就是上一节中的依赖配置文件，默认文件名称为DEP,也可以自定义。此文件存放在项目仓库的根目录下，其格式就是python语法。其中最重要的是4个属性

运行gclient sync的时候，会读取DEPS文件中描述的依赖的其他库的url和版本，然后把这些仓库切换到正确的版本。
* -n，–nohooks。检出代码之后不运行hooks里面的动作。
* -r，–revision。强制切换到某个代码的某个版本，后面可以使tag名如gclient sync -r 48.0.2564.74。或者提交id，如gclient sync -r f194a61f5ecd56f744273318100300045586d3dc。
* –with_branch_heads。Git在Clone代码仓库时也获取到每个分支的head。
* –with_tags。Git在Clone代码仓库时也获取tags。
* -R，–reset。重置本地的修改。
* -M，–merge。合并上游的修改。
* -A，–auto_rebase。等同于git pull –rebase。
* –upstream。让本地仓库状态匹配上游分支。
* –no-history。为了减小仓库大小，不检出提交历史。
* –shallow。对换成目录进行浅拷贝

### gclient命令-runhooks
runhooks是在同步完代码之后执行的。根据DEPS的文件的描述，执行一些获取代码之后的工作，其中包括生成平台可编译的工程。至于执行了哪些任务，可以参考DEPS文件里面的hooks内容。

runhooks的最后调用src/build/gyp_chromium.py脚本来生成可编译的代码工程。所以如果改变了gyp文件，可以仅运行src/build/gyp_chromium.py脚本来重新生成工程
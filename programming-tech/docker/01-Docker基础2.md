## 安装
Docker Desktop for windows方式，其实质是利用docker的C/S架构，将windows模式下的docker对应docker.sock，docker客户端二进制和docker的数据目录挂载到WSL2里面的linux机器，在此linux机器下执行docker命令(docker命令为docker客户端)

实质为客户端通过 挂载的/var/run/docker.sock文件与windows里面的dockerd服务端进程通信。如下图，我们在linux下重新启动linux下dockerd进程，linux模式下下载的busybox镜像又可以看到了，/var/run/docker.sock的时间戳也被更新了，此时客户端通过/var/run/docker.sock文件与linux下的dockerd服务端通信

* Docker 启动快速属于秒级别。虚拟机通常需要几分钟去启动。
* Docker 需要的资源更少。Docker 在操作系统级别进行虚拟化，Docker 容器和内核交互，几乎没有性能损耗，性能优于通过 Hypervisor 层与内核层的虚拟化。
* Docker 更轻量。Docker 的架构可以共用一个内核与共享应用程序库，所占内存极小。同样的硬件环境，Docker 运行的镜像数远多于虚拟机数量，对系统的利用率非常高。
* 与虚拟机相比，Docker 隔离性更弱。Docker 属于进程之间的隔离，虚拟机可实现系统级别隔离。
* 安全性。Docker 的安全性也更弱，Docker 的租户 Root 和宿主机 Root 等同，一旦容器内的用户从普通用户权限提升为 Root 权限，它就直接具备了宿主机的 Root 权限，进而可进行无限制的操作。
* 虚拟机租户 Root 权限和宿主机的 Root 虚拟机权限是分离的，并且虚拟机利用如 Intel 的 VT-d 和 VT-x 的 ring-1 硬件隔离技术。
* 这种隔离技术可以防止虚拟机突破和彼此交互，而容器至今还没有任何形式的硬件隔离，这使得容器容易受到攻击。
* 可管理性。Docker 的集中化管理工具还不算成熟。各种虚拟化技术都有成熟的管理工具，例如 VMware vCenter 提供完备的虚拟机管理能力。
* 高可用和可恢复性。Docker 对业务的高可用支持是通过快速重新部署实现的。
* 虚拟化具备负载均衡，高可用，容错，迁移和数据保护等经过生产实践检验的成熟保障机制， VMware 可承诺虚拟机 99.999% 高可用，保证业务连续性。
* 快速创建、删除。虚拟化创建是分钟级别的，Docker 容器创建是秒级别的，Docker 的快速迭代性，决定了无论是开发、测试、部署都可以节约大量时间
* 交付、部署。虚拟机可以通过镜像实现环境交付的一致性，但镜像分发无法体系化。Docker 在 Dockerfile 中记录了容器构建过程，可在集群中实现快速分发和快速部署。

## Docker局限性
Docker用于应用程序时是最有用的，但并不包含数据。日志、数据库等通常放在Docker容器外。一个容器的镜像通常都很小，不用和存储大量数据，存储可以通过外部挂载等方式使用，比如：NFS、ipsan、MFS等 ，或者docker命令 ，-v映射磁盘分区。总之，docker只用于计算，存储交给别人。

## Docker 特性
* 文件系统隔离：每个进程容器运行在一个完全独立的根文件系统里。
* 资源隔离：系统资源，像CPU和内存等可以分配到不同的容器中，使用cgroup。
* 网络隔离：每个进程容器运行在自己的网路空间，虚拟接口和IP地址。
* 日志记录：Docker将收集到和记录的每个进程容器的标准流（stdout/stderr/stdin），用于实时检索或者批量检索
* 变更管理：容器文件系统的变更可以提交到新的镜像中，并可重复使用以创建更多的容器。无需使用模板或者手动配置。
* 交互式shell：Docker可以分配一个虚拟终端并且关联到任何容器的标准输出上，例如运行一个一次性交互shell。

由于容器的定义并没有提及是否要运行容器，所以实际上，容器 = 镜像 + 读写层。

## Docker 架构和工作原理
Docker 使用 C/S 结构，即客户端/服务器体系结构。Docker 客户端与 Docker 服务器进行交互，Docker服务端负责构建、运行和分发 Docker 镜像。

Docker 客户端和服务端可以运行在一台机器上，也可以通过 RESTful 、 Stock 或网络接口与远程 Docker 服务端进行通信。

### 工作原理
Docker是一个Client-Server结构的系统，Docker守护进程运行在主机上， 然后通过Socket连接从客户端访问，守护进程从客户端接受命令并管理运行在主机上的容器。容器，是一个运行时环境，就是我们前面说到的集装箱。

## Docker 技术的三大核心概念，分别是：
### 镜像 Image
Docker 镜像是一个只读的模板，可以用来创建 Docker 容器。镜像包含了操作系统、应用程序和所有的依赖文件，可以看作是一个虚拟机的快照。用户可以基于现有的镜像创建新的镜像，并在其中安装和配置应用程序。

### 容器 Container
Docker 容器是镜像运行时的实例，是一个隔离的进程空间。容器包含了运行应用程序所需要的所有文件和设置，但与虚拟机不同的是，容器与主机系统共享操作系统内核。这使得容器非常轻量化，启动和停止也非常快速。
### 仓库 Repository
Docker 仓库是用来存放 Docker 镜像的地方，类似于代码仓库。Docker Hub 是 Docker 官方提供的公共仓库，可以在其中找到大量的开源镜像。用户也可以在私有环境中搭建自己的仓库，用于存储和共享自己的镜像。

### 二者区别 images和container
images跟平常使用的虚拟机的镜像，相当于一个模版
而container则是images运行时的的状态。

docker对于运行过的image都保留一个状态（container），可以使用命令
```
docker ps 来查看正在运行的container
docker ps -a 对于已经退出的container
```
如果你退出了一个container而忘记保存其中的数据，可以使用docker ps -a来找到对应的运行过的container使用docker commit命令将其保存为image然后运行。

image被某个container引用（拿来运行），如果不将这个引用的container销毁（删除），那image肯定是不能被删除。

### 例子
执行命令 "docker run hello-world" 会先从 Docker Hub 上下载 "hello-world" 镜像（如果本地没有），然后在该镜像的基础上创建一个新的容器，并在容器内部运行 "hello-world" 应用程序。因此，在这个命令执行完成之后，"hello-world" 是镜像，而创建的容器则是运行中的容器实例。

### Docker 的核心组件包括：
* Docker Client

* Docker Daemon

* Docker Image

* Docker Registry

* Docker Container

### Docker Client
Docker 客户端。Docker 提供命令行界面（CLI）工具，是许多 Docker 用户与 Docker 进行交互的主要方式。
最常用的 Docker 客户端就是 Docker 命令，我们可以通过 Docker 命令很方便地在 Host 上构建和运行 Docker 容器。

### Docker Daemon
Docker Daemon 是服务器组件，以 Linux 后台服务的方式运行，是 Docker 最核心的后台进程，我们也把它称为守护进程。

它负责响应来自 Docker Client 的请求，然后将这些请求翻译成系统调用完成容器管理操作。

该进程会在后台启动一个 API Server ，负责接收由 Docker Client 发送的请求，接收到的请求将通过 Docker Daemon 内部的一个路由分发调度，由具体的函数来执行请求。

### Docker Image
提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。

镜像不包含任何动态数据，其内容在构建之后也不会被改变。镜像（Image）就是一堆只读层（read-only layer）的统一视角

Docker 镜像可以看作是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。

镜像不包含任何动态数据，其内容在构建之后也不会被改变。我们可将 Docker 镜像看成只读模板，通过它可以创建 Docker 容器。

镜像有多种生成方法：
* 从无到有开始创建镜像
* 下载并使用别人创建好的现成的镜像
* 在现有镜像上创建新的镜像
* 可以将镜像的内容和创建步骤描述在一个文本文件中，这个文件被称作 Dockerfile ，通过执行 docker build命令可以构建出 Docker 镜像。

### Docker Registry
Docker Registry 是存储 Docker Image 的仓库,运行 docker push、docker pull、docker search 时，实际上是通过 Docker Daemon 与 Docker Registry 通信。

### Docker Container
Docker 容器就是 Docker 镜像的运行实例，是真正运行项目程序、消耗系统资源、提供服务的地方。

Docker Container 提供了系统硬件环境，我们可以使用 Docker Images 这些制作好的系统盘，再加上我们所编写好的项目代码，Run 一下就可以提供服务。

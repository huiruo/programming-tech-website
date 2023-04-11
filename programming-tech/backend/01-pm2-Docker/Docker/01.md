## docker的概念
image: 镜像，类似于一个说明书，告诉docker怎么去做出一个这样的应用出来；
container： 容器，根据这个image生成，生成以后就可以通过命令去使用；

### 常用的指令
- docker image ls <查看镜像列表>
- docker run -d -p 3000:8000 列表名 <将镜像8000运行在本机的3000端口后台运行，产生一个容器>
- docker ps -a <查看容器的执行情况>
- docker build -t 镜像名称 . <创建一个镜像，点标示文件的文件位置>
- docker container stop 容器id <暂停一个服务>


## .dockerignore
Docker 运行时，会忽略掉本地工作空间里被配置到 .dockerignore 中的文件。
忽略掉一些不必要的文件也可以提高 docker 的构建速度。
```
node_modules
```

## 目录
```
└── compose_test
    ├── docker
    │   └── docker-compose.yml
    ├── Dockerfile
    ├── node_modules
    ├── package.json
    ├── server.js
```

## Docker Compose
Docker Compose 是 Docker 的工具，你可以通过 YML 文件配置来运行 Docker。
就是可以让你把 docker 命令配置写在配置文件里然后运行的工具。

定义docker-compose脚本
文档：
> docker-compose.yml:
```
# compose 依赖的版本
version: '3'
# 指定容器名称
container_name: 'my-docker'
# 构建设置
services:
  web:
    # 当前目录构建
    build: .
    # 端口映射
    ports:
      - '80:80'
```

实例：
> docker-compose.yml:
```
version: '3'
services:
  web:
    build: ../
    ports:
     - "5000:5000"
  redis:
    image: redis:3.0.7
```
这个compose文件定义了两个服务，即定义了web和redis两个容器。
您不需要安装Redis，由Docker镜像提供的。
```
web容器： 
    使用当前docker-compose.yml文件所在目录的上级目录（compose_test/Dockerfile）中的Dockerfile构建映像。 
    将容器上的暴露端口5000映射到主机上的端口5000。 我们使用Flask Web服务器的默认端口5000。 

redis容器： 
    redis服务使用从Docker Hub提取的官方redis镜像3.0.7版本
```

## Dockerfile
一个容器一个Dockerfile文件
Dockerfile 就是来告诉 Docker 怎么创建镜像以及创建完成后的各种操作

> Dockerfile
```
FROM        node            <继成>
COpy        app/app         <拷贝>
WORKDIR     /app            <工作目录>
RUN         npm install     <执行命令，在编译阶段执行>
EXPOSE      3000            <暴露一个端口>
CMD         node app.js     <命令，容器运行阶段的命令>
```

```
# 镜像是 node 的 14.9.0 版本，后续指令都将在这个环境下运行
FROM node:14.9.0
# 工作空间设置为 /app，这指的是容器内的工作空间
WORKDIR /app
# 拷贝当前工作目录的 package.json -> 容器的工作空间 /app
COPY package.json /app
# 设置镜像源并安装包
RUN npm i --registry=http://r.npm.taobao.com && npm install
# 复制当前工作目录的所有文件到 /app
COPY . /app
# 声明 80 端口，仅仅告诉镜像使用者默认端口，实际映射在下文告知
EXPOSE 80
# 运行 node 脚本
CMD node server.js
```
## 在compose_test/docker/目录下执行docker-compose.yml文件：
然后就可以创建运行 docker 容器了，运行： docker-compose up 此时，你的服务就可以通过 localhost 访问到了
```
$ docker-compose up
# 若是要后台运行： $ docker-compose up -d

# 若不使用默认的docker-compose.yml 文件名：
$ docker-compose -f server.yml up -d 
```

### 进入容器
可以运行 docker ps 命令看到当前运行的容器。
执行 docker image ls 可以看到创建的容器

之后，通过 docker exec -it container-id /bin/bash 进入容器内部
修改了代码之后，你可以通过 docker-compose up --build 再重新构建容器，因为有缓存机制，这次构建会很快速！

## 重新构建和运行应用程序
使用更新的compose文件构建应用程序，然后运行它。
$ docker-compose up -d
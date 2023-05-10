## Dockerfile配置
### 例子1
镜像例子运行js的例子
```bash
FROM node
WORKDIR /app
COPY app.js /app
# 使用 `RUN` 指令运行需要的命令，例如，在容器中安装依赖项。
# RUN npm install
CMD ["node", "app.js"]

# docker build -f dockerfile . -t code-js
# docker run -d -p 8800:8800 code-js
# docker run code-js
``` 

### 例子2
使用Alpine版本的Node.js作为基础镜像，并指定了工作目录。它首先复制package.json文件，然后安装依赖项，接着将整个项目代码复制到容器中，运行npm run build命令进行构建，最后通过CMD命令启动应用程序。
```bash
# 指定node镜像版本
FROM node:14.15.0-alpine3.12

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY package.json /app

# 安装项目依赖
RUN npm install

# 将源代码复制到容器中
COPY . /app

# 运行构建命令
RUN npm run build

# 启动应用程序
CMD ["npm", "start"]
```

### 例子3
```bash
FROM node:18-alpine as installer

WORKDIR /app

COPY ./apps/web/package.json .

RUN yarn install

# 分阶段减少体积
# FROM node:18-alpine as builder

WORKDIR /app


# copy needed files
COPY ./apps/web .

# copy node_modules
# COPY --from=installer /app/node_modules ./node_modules

RUN yarn build 

# cleanup devDependencies
# RUN npm prune --production

# run app
FROM node:18-alpine 

WORKDIR /app

# COPY --from=builder /app .

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/public ./public
# COPY --from=builder  /app/next-i18next.config.js ./next-i18next.config.js
# COPY --from=builder  /app/.env ./.env
# COPY --from=builder  /app/.env.production ./.env.production
COPY --from=builder  /app/.next ./.next
COPY --from=builder  /app/next.config.js ./next.config.js
COPY --from=builder  /app/package.json ./package.json

CMD yarn start

# docker build -f dockerfile.web . -t code-web
# docker run -d -p 3600:3600 code-web
```

## 前言
Dockerfile 是自动构建 Docker 镜像的配置文件，用户可以使用 Dockerfile 快速创建自定义的镜像。Dockerfile 中的命令非常类似于 Linux 下的 Shell 命令。

Dockerfile 分为四个部分:
* 基础镜像（父镜像）信息指令 FROM。
* 维护者信息指令 MAINTAINER。
* 镜像操作指令 RUN 、EVN 、ADD 和 WORKDIR 等。
* 容器启动指令 CMD 、ENTRYPOINT 和 USER 等。
```
FROM python:2.7
MAINTAINER 大技术<test@gmail.com>
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 5000ENTRYPOINT ["python"]CMD ["app.py"]
```

分析上面:
```
从 Docker Hub 上 Pull 下 Python 2.7 的基础镜像
显示维护者的信息
Copy 当前目录到容器中的 /App 目录下 复制本地主机的 ( Dockerfile 所在目录的相对路径)到容器里
指定工作路径为 /App
安装依赖包
暴露 5000 端口
启动 App
```

## ADD
复制指定的源文件、目录、URL到容器的指定目录中。所有拷贝到container中的文件和文件夹权限为0755，uid和gid为0。

如果源是一个目录，那么会将该目录下的所有文件添加到container中，不包括目录；如果源文件是可识别的压缩格式，则docker会帮忙解压缩（注意压缩格式）；如果源是文件且目标目录中不使用斜杠结束，则会将目标目录视为文件，源的内容会写入目标目录；如果源是文件且目标目录中使用斜杠结束，则会源文件拷贝到目标目录下。
```
#具体使用法如下：
ADD <源> <目标>
```

## FROM
所有的 Dockerfile 都应该以 FROM 开头，FROM 命令指明 Dockerfile 所创建的镜像文件以什么镜像为基础，FROM 以后的所有指令都会在 FROM 的基础上进行创建镜像。

同一个 Dockerfile 中多次使用 FROM 命令用于创建多个镜像。比如我们要指定 Python 2.7 的基础镜像：
```
FROM python:2.7
```

## MAINTAINER
MAINTAINER 是用于指定镜像创建者和联系方式，一般格式为 MAINTAINER。

## COPY
COPY 是用于复制本地主机的(为 Dockerfile 所在目录的相对路径)到容器中的。

* 路径必须是绝对路径，如果不存在，会自动创建对应目录
* 路径必须是Dockerfile 所在路径的相对路径
* 如果是一个目录，只会复制目录下的内容，而目录本身则不会被复制

要拷贝当前目录到容器中的 /app 目录下:
```
COPY . /app
```

## WORKDIR
指定RUN、CMD、ENTRYPIONT指定的命令的运行目录。可以使用多个WORKDIR指令，后续参数如果是相对路径，则会基于之前的命令指定的路径。如：WORKDIR /data　WORKDIR work。最终的路径就是/data/work。path路径也可以是环境变量。

WORKDIR 用于配合 RUN，CMD，ENTRYPOINT 命令设置当前工作路径。

可以设置多次，如果是相对路径，则相对前一个 WORKDIR 命令

例如我们设置 /app 路径，我们可以进行如下操作：
```
WORKDIR / app
```

## ENV
在镜像中用于设置环境变量的，然后RUN命令可以使用此设置的环境变量，在容器启动后也以通过docker inspect查看环境变量，可以通过docker run --env key=value来设置或修改环境变量。
```
#具体使用法如下：
ENV <key> <value>
ENV JAVA_HOME /usr/local/jdk
```

## RUN
RUN 用于容器内部执行命令。每个 RUN 命令相当于在原有的镜像基础上添加了一个改动层，原有的镜像不会有变化。一般格式为 RUN。
例如我们要安装 Python 依赖包，我们做法如下：
```
RUN pip install -r requirements.txt
```

## EXPOSE
EXPOSE 命令用来指定对外开放的端口。

指定容器的端口映射（容器与物理机），运行容器时加上-p参数指定EXPOSE设置的端口。EXPOSE可以设置多个端口号，相应地运行容器配套多次使用-p参数。可以通过docker port +容器需要映射的端口号和容器ID来参考宿主机的映射端口。
```
EXPOSE 5000
```

## ENTRYPOINT
ENTRYPOINT 可以让你的容器表现得像一个可执行程序一样。一个 Dockerfile 中只能有一个 ENTRYPOINT，如果有多个，则最后一个生效。

ENTRYPOINT 命令也有两种格式：
```
ENTRYPOINT ["executable", "param1", "param2"] ：推荐使用的 Exec 形式。
ENTRYPOINT command param1 param2 ：Shell 形式。
```

要将 Python 镜像变成可执行的程序，我们可以这样去做：
```
ENTRYPOINT ["python"]
```

## CMD
CMD 命令用于启动容器时默认执行的命令，CMD 命令可以包含可执行文件，也可以不包含可执行文件。

不包含可执行文件的情况下就要用 ENTRYPOINT 指定一个，然后 CMD 命令的参数就会作为 ENTRYPOINT 的参数。

### CMD 命令有三种格式：
```
CMD ["executable","param1","param2"]：推荐使用的 exec 形式。
CMD ["param1","param2"]：无可执行程序形式。
CMD command param1 param2：Shell 形式
```

一个 Dockerfile 中只能有一个 CMD，如果有多个，则最后一个生效。而 CMD 的 Shell 形式默认调用 /bin/sh -c 执行命令。

CMD 命令会被 Docker 命令行传入的参数覆盖：docker run busybox /bin/echo Hello Docker 会把 CMD 里的命令覆盖。

例如我们要启动 /app ，我们可以用如下命令实现：
```
CMD ["app.py"]
```

## 构建 Dockerfile
```dockerfile
FROM nginx:alpine
RUN echo '<h1>hello docker nginx</h1>' > /usr/share/nginx/html/index.html
```

```
docker build -t nginx:1.0 .

-t 是为新镜像设置仓库和名称
nginx 为镜像名
:1.0 为标签（不添加为默认 latest ）
```

```
docker run --name nginx -d -p 8080:80 nginx:1.0
```

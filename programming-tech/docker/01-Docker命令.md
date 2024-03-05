## 复制命令
从容器外复制到容器内
```bash
➜  web git:(main) ✗ docker ps
CONTAINER ID   IMAGE                COMMAND                   CREATED              STATUS              PORTS      NAMES
e4edc18a2b87   node-client:latest   "docker-entrypoint.s…"   About a minute ago   Up About a minute   3008/tcp   competent_elion


docker cp ./package.json competent_elion:/usr/share
```

## 容器和宿主机文件拷贝

### 例子： 部署nextjs 网站
```bash
docker cp /Users/ruo/company-workspace/haixing-company/oss-next-i18next-ssg/out/. mynginx:/usr/share/nginx/html

rm *
# 删除子文件夹
rm -r *
docker cp /Users/ruo/company-workspace/haixing-company/weekly-star/out/. mynginx:/usr/share/nginx/html
```

### 容器内文件-->宿主机
```bash
docker cp 容器ID:容器内路径 目的主机路径

// 从容器拷贝到本地目录
docker cp nginx:/etc/nginx/nginx.conf /usr/nginx/nginx.conf
```

### 宿主机文件-->容器中
```bash
docker cp 主机路径 容器ID:容器内路径

// 从本地目录拷贝到容器
docker cp /usr/nginx/nginx.conf nginx:/etc/nginx/nginx.conf

docker cp /usr/nginx/html/main.html nginx:/usr/share/nginx/html
```

例子：
```
docker cp nextjs-test:/server.js /home/ruo/work-space/temp-space

docker cp jolly_visvesvaraya:/server.js /home/ruo/work-space/temp-space

docker cp 2916feb30290:/server.js /home/ruo/work-space/temp-space

docker cp jolly_visvesvaraya:/app /home/ruo/work-space/temp-space

docker cp 2916feb3029:/app /home/ruo/work-space/temp-space
```

## 镜像
### 查看镜像
```
docker images

docker image ls --all

-a：列出所有镜像（含历史镜像）
-q：只显示镜像ID
-f：过滤
```

### 创建新的镜像
```
docker image build -t code-platform .
```

### 删除镜像
```
docker rmi 镜像名称/ID
docker rmi -f 镜像名称/ID
```

## 容器

### 查看
docker ps [OPTIONS]
```
// 列出正在运行的容器信息
docker ps 

// 会列出所有容器的信息，包括正在运行的和已经停止的容器。
// 除了基本信息外，还会显示容器的退出代码、命令、创建时间、端口映射等更详细的信息。
docker ps -a
```
* -a：列出当前所有正在运行的容器+历史上运行过的
* -l：显示最近创建的容器。-n：显示最近n个创建的容器。-q：静默模式，只显示容器编号。

### 启动容器
```
docker run[OPTIONS]IMAGE[COMMAND][ARG...]

docker run -p 3000:3000 code-platform
```

参数【OPTIONS】说明：
* --name：为容器指定一个名称
* -d：后台运行容器并返回容器ID，也即启动守护式容器
* -i：以交互模式（interactive）运行容器，通常与-t同时使用
* -t：为容器重新分配一个伪输入终端（tty），通常与-i同时使用。也即启动交互式容器（前台有伪终端，等待交互）
* -e：为容器添加环境变量
* -P：随机端口映射。将容器内暴露的所有端口映射到宿主机随机端口
* -p：指定端口映射

-p指定端口映射的几种不同形式：
* -p hostPort:containerPort：端口映射，例如-p 8080:80
* -p ip:hostPort:containerPort：配置监听地址，例如 -p 10.0.0.1:8080:80
* -p ip::containerPort：随机分配端口，例如 -p 10.0.0.1::80
* -p hostPort1:containerPort1-p hostPort2:containerPort2：指定多个端口映射，例如-p 8080:80 -p 8888:3306


### 启动守护式容器
大部分情况下，我们系统docker容器服务是在后台运行的，可以通过-d指定容器的后台运行模式：
```
docker run -d 容器名
```

```
docker run -p 3600:3600 nextjs-test

或则快速运行：
docker start 1874f672f0a7

docker run --name nginx -p 8008:80 nginx

或则直接运行已有镜像：
docker start nginx
```

例子:启动nginx
```
docker run -d --name nginx -p 8008:80 nginx

-d 后台持续运行运行。
--name 自定义的容器名称。
-p 映射主机端口号到docker容器的端口号。

8008即为外部web访问的端口号，而80则为nginx容器对外暴露的端口号。

启动成功，就可以通过 ip:8008 访问站点

http://localhost:8008/

127.0.0.1:8008
```

### 启动交互式容器
以交互方式启动ubuntu镜像
```
docker run -it ubuntu /bin/bash
```

### 停止/重启容器
```
docker start 容器ID或者容器名
docker restart 容器ID或容器名

docker stop nginx
docker start nginx
```

强制停止容器:

docker kill 容器ID或容器名

### 查看容器内部细节
docker inspect容器ID或容器名

### 进入正在运行的容器
docker exec -it 容器名称/容器ID/容器ID简写 bashShell

例子:查看nginx容器的配置资源目录:
```
bash:
docker exec -it nginx bash

或则sh:
docker exec -it nginx sh
```

例子:进入容器后搜索看下nginx文件：
```
find -name nginx

cd /usr/share/nginx/

cat /usr/share/nginx/html/index.html

exit // 退出
```

docker exec 和 docker attach 区别：
* attach直接进入容器启动命令的终端，不会启动新的进程，用exit退出会导致容器的停止
* exec是在容器中打开新的终端，并且可以启动新的进程，用exit退出不会导致容器的停止


### 删除容器
提示: 这一步要确定删除容器没问题的情况下, 才可以做
```
docker container rm nginx
```

### 强制删除正在运行的容器
```
docker rm -f 容器ID或容器名
```

### 查看容器日志
docker logs 容器ID或容器名

## 其他命令
* docker -v
* 使用以下命令列出有关 Docker 安装的系统范围的信息，包括 WSL 2 上下文中你可使用的统计信息和资源（CPU & 内存）：
```
docker info

docker pull hello-world

docker run hello-world
```

### 执行命令，默认去docker hub中搜索:
```
docker search 镜像名称

docker pull 镜像名称[:tag]
```

### 查看镜像/容器/数据卷所占的空间
```
docker system df
```
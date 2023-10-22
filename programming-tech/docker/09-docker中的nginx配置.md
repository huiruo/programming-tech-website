## 准备 Nginx 镜像
https://www.zhihu.com/question/423719533
```
docker pull nginx
```

在根目录创建 Nginx 配置文件：
touch default.conf

## 端口问题
如果要部署多个网站，可以启动多个容器，每个容器可以对应一个端口号。这时，可以修改每个容器的日志配置资源文件等内容。

## nginx的配置文件方式1
者vim命令没有用，解决办法：apt update完成之后 apt install vim
```
vim /etc/nginx/nginx.conf
```

## nginx的配置文件方式2
还有第二种方式，挂载配置文件，就是把装有docker宿主机上面的nginx.conf配置文件映射到启动的nginx容器里面，这需要你首先准备好nginx.con配置文件,如果你应经准备好了，下一步是启动nginx
```
ocker run --name nginx -p 80:80 -v /home/docker-nginx/nginx.conf:/etc/nginx/nginx.conf -v /home/docker-nginx/log:/var/log/nginx -v /home/docker-nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf -d nginx

--name  给你启动的容器起个名字，以后可以使用这个名字启动或者停止容器

-p 映射端口，将docker宿主机的80端口和容器的80端口进行绑定

-v 挂载文件用的，第一个-v 表示将你本地的nginx.conf覆盖你要起启动的容器的nginx.conf文件，第二个表示将日志文件进行挂载，就是把nginx服务器的日志写到你docker宿主机的/home/docker-nginx/log/下面

第三个-v 表示的和第一个-v意思一样的。

-d 表示启动的是哪个镜像
```

## 将nginx容器的配置日志资源等目录映射到本地主机目录下
需要在启动容器时，使用到 -v 命令，如：
```
docker run -d --name nginx \
-p 8080:80 \
-v /usr/nginx/html:/usr/share/nginx/html \
-v /usr/nginx/log:/var/log/nginx \
-v /usr/nginx/nginx.conf:/etc/nginx/nginx.conf \
nginx
```

其中 -v 是目录挂载，将本地目录映射到容器目录，后面直接修改本地目录下的内容，会同步到容器内。
上面的命令，挂载了nginx的资源文件目录、日志目录、配置文件。
这时候如果查看配置文件nginx.conf，可以发现，有这么一段：
```
include /etc/nginx/conf.d/*.conf;

这是由于nginx容器除了加载主配置文件nginx.conf以外，还加载了conf.d目录下的子配置文件，通常最少有一个default.conf。所以，在启动容器时，也可以把该目录挂载出来：

-v /usr/nginx/conf.d:/etc/nginx/conf.d
```



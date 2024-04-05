docker pull nginx
```
创建Nginx容器：一旦你有了Nginx镜像，你可以使用以下命令在Docker中创建一个Nginx容器：

docker run --name mynginx -p 80:80 -d nginx
```
这将创建一个名为"mynginx"的容器，并将主机的端口80映射到容器的端口80。Nginx默认监听端口80来提供HTTP服务。使用-d选项可以让容器在后台运行。

```
检查Nginx容器：现在，你可以使用以下命令检查Nginx容器是否正在运行：
docker ps
```
## 配置文件
```bash
find / -name "default.conf"

/etc/nginx/conf.d/default.conf
```

### 备份：
/etc/nginx/conf.d/default.conf
```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

### 备份：
/etc/nginx/conf.d/default.conf
```nginx
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

修改后：
```bash
sudo nginx -s reload
```

## 资源文件
```
cd /usr/share/nginx/html
```

## cp
```
docker cp /path/to/your/folder mynginx:/usr/share/nginx/html

docker cp /path/to/your/folder mynginx:/usr/share/nginx/html

docker cp /Users/ruo/company-workspace/haixing-company/oss-next-i18next-ssg/out/. mynginx:/usr/share/nginx/html
```

## 删除之前的容器
```
docker ps

docker stop mynginx

docker rm mynginx
```

## 启动新容器
如果你需要保留之前的容器并仅更改端口，你可以使用以下命令来重新启动容器，并指定新的端口映射：
```
docker run --name mynginx -p 8099:80 -d nginx
```

更新网站：
```
docker cp /Users/ruo/company-workspace/haixing-company/nextjs-h5-template/out/. mynginx:/usr/share/nginx/html
```

## 进入docker
首先，使用 docker ps 命令列出正在运行的容器，找到要进入的容器的容器 ID 或名称。

使用以下命令进入容器：
```bash
docker exec -it <container_id_or_name> zsh

docker exec -it c196ad1656d3 zsh

docker exec -it c196ad1656d3 /bin/bash
```

## 处理报错
检查 Nginx 配置：查看 Nginx 配置文件是否正确配置了 /en/ 路径。你可以在容器中的
```
/etc/nginx/conf.d/
```
目录中找到默认的 Nginx 配置文件。确保配置文件中包含类似以下代码的配置项：

## 在主机上编辑文件-修改nginx文件
从容器复制文件到主机
```
docker cp <container_id_or_name>:/path/to/file /path/on/host

docker cp mynginx:/etc/nginx/conf.d/default.conf /Users/ruo/company-workspace/haixing-company/nextjs-h5-template/
```

将更改后的文件复制回容器：
```
docker cp /Users/ruo/company-workspace/haixing-company/nextjs-h5-template/default.conf mynginx:/etc/nginx/conf.d
```

重启nginx:
```
nginx -s reload
```

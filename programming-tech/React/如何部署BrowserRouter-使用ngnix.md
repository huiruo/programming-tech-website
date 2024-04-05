## history browser 	
react-router官方推荐，需要服务器支持（因为是SPA项目，url切换时需要服务器始终返回index.html）

## 为什么这样配就可访问BrowserRouter?
```
server {
    listen 8099;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

这个配置可以让 BrowserRouter 正常工作的原因是因为它确保了所有的请求都会被重定向到 index.html。让我来解释一下这个配置的工作原理：

* listen 8099;这一行指定了 nginx 监听的端口，也就是你的 React 应用所运行的端口。

* server_name localhost;：这一行指定了服务器的域名，这个配置适用于在本地环境下部署。如果你需要在其他环境中部署，你可能需要修改这个值。

* root /usr/share/nginx/html;：这一行指定了 nginx 的根目录，即 nginx 应该从哪个目录下提供文件。在这个配置中，它被设置为你的 React 应用的构建目录 /usr/share/nginx/html。

* index index.html;：这一行指定了默认的索引文件是 index.html，如果请求的路径是一个目录，则会尝试查找该目录下的 index.html 文件。

* `location / { try_files $uri $uri/ /index.html; }`这个 location 块是最重要的部分。它表示 nginx 对于所有的请求都会尝试查找对应的文件或目录，如果找到了就直接返回，如果没有找到则重定向到 index.html 文件。这样的配置使得当用户访问除了已经存在的文件或目录外的路径时，都能够被重定向到 React 应用的入口文件 index.html。

因此，当用户访问 http://localhost:8099/editor 时，即使 /editor 这个路径实际上在服务器上并不存在，但是由于 nginx 配置中的`try_files $uri $uri/ /index.html;`指令，nginx 会将请求重定向到 index.html 文件，然后由 React Router 来处理这个路径，使得 BrowserRouter 正常工作。

### 部署参考
https://blog.csdn.net/qq_38433300/article/details/103984865

注意点：

* 代码中加：
```
basename="/app/"，这里的 /app/ 和nginx中的location /app/ 一致
```

* homepage
```
"homepage":"http://a.yeashian.com/app"，此处为域名(域名为nginx中配置的)，ip不行
```

* 跳转不能使用`window.location.href="xxxx"`,必须使用react路由跳转

nginx中加:
```
location /app/ {

  try_files $uri /app/index.html;

  index index.html;

}
```

### 实战
conf.d/default.conf
```
server {
    listen 8099;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}


|
|
V

server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
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


## 方式1 当以静态网页方式进行部署时
流程是项目会被构建(打包)，然后把最终生成的静态资源(HTML, CSS, JS, 图片等) 部署到全国各地的CDN节点。

```
yarn && yarn build && yarn next export

发布目录:
out
```

## 方式2-当以Node Server的方式进行部署时
流程是先进行项目构建，静态资源部署到的CDN节点，然后服务启动进入等待被访问的状态，当有访问到服务请求时，服务器会进行处理。
```
yarn && yarn build

发布目录:
yarn next start --port 3900
```


## 方式3-docker
使用官方的 dockerfile 进行打包时，next.config.js开启outputStandalone:

next.config.js
```js
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
}
```


## 方式4-部署到nginx
默认是localhost:3000，我们肯定是要通过域名访问项目，因此还需要进行域名配置，通过nginx反向代理来实现
```nginx
server {
  listen  80;
  server_name  yourdomain.com;

  error_log  /var/log/nginx/yourdomain_error.log;

  location / {
      proxy_pass     
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
  }
}
```

### pm2
```
npm install -g pm2
```

```js
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start",
  "server":"next build && next start",
},
```

项目目录：
```
pm2 start npm --name yourName -- run server --watch
```
## 首先在目录首页`.npmrc`
```
registry=http://localhost:4873/
```

## Verdaccio 安装
官方文档：
https://verdaccio.org/zh-cn/docs/docker/

参考文档：
https://juejin.cn/post/7096701542408912933

```
https://marrydream.top/tools/%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7/%E4%BD%BF%E7%94%A8Verdaccio%E6%90%AD%E5%BB%BAnpm%E7%A7%81%E6%9C%89%E6%9C%8D%E5%8A%A1%E5%99%A8/
```

其他参考文档：
```
https://juejin.cn/post/7096701542408912933

https://zhuanlan.zhihu.com/p/618257146

https://juejin.cn/post/7140193996147523621

https://zhaomenghuan.js.org/blog/npm-private-repository-verdaccio.html#docker-%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85
```

## 使用
```bash
docker pull verdaccio/verdaccio

# 要运行docker 容器： 最后一个参数定义使用哪个镜像。
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio

# http://0.0.0.0:4873
```

### 运行
```
修改了配置文件后，可运行以下命令使配置生效

verdaccio -c config.yml

verdaccio -c /Users/xx/verdaccio_data/conf/config.yml
```


本地路径:
```
/Users/xx/verdaccio_data
```

根据路径运行:
```bash
docker run -d \
  --name verdaccio \
  -p 4873:4873 \
  -v /Users/xx/verdaccio_data/storage:/verdaccio/storage \
  -v /Users/xx/verdaccio_data/conf/config.yml:/verdaccio/conf/config.yml \
  verdaccio/verdaccio
```

## 添加用户
```
npm adduser --registry http://0.0.0.0:4873/
npm adduser --registry http://localhost:4873/

提示让先添加用户，按照它的命令提示，进行添加用户操作
admin 123456
2196411859@qq.com

输入命令后会提示让输入账号密码和邮箱，输入完成后就自动登录了，此时就可以发布npm包到verdaccio私有库了。
```

## 发布npm包到verdaccio私有库
创建测试库
```
mkdir verdaccio-demo-publish
cd verdaccio-demo-publish

npm init -y
```

第二步：
package.json添加files字段，配置npm发布时要上传的文件，此时只需要添加index.js, package.json文件会默认上传。
```json
{
  "name": "verdaccio-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo "Error: no test specified" && exit 1"
  },
  "files": [
    "index.js"
  ],
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 发布包到verdaccio私有库:
```
npm publish --registry http://0.0.0.0:4873/
npm publish --registry http://localhost:4873/

删除：
npm unpublish olag --registry http://localhost:4873/ --force
npm unpublish ee-front --registry http://localhost:4873/ --force
```


问题：

我上传后npm 包npm i下载下来需要这样的结构，要怎么使用npm publish --registry http://localhost:4873/ 上传到verdaccio私有库
```
@olag
  app
    dist
    package.json
  native
    dist
    package.json
  utils
    dist
    package.json
```

```
需要进入每个子目录，运行npm publish --registry http://localhost:4873/命令来上传每个子包到您的Verdaccio私有库。确保在每个子目录中运行该命令，以便将每个子包分别发布到Verdaccio。
例如，在app子目录中运行：
cd app
npm publish --registry http://localhost:4873/

cd native
npm publish --registry http://localhost:4873/

cd utils
npm publish --registry http://localhost:4873/
```

## 使用发布在verdaccio私有库的npm包
新建测试项目并初始化
```
mkdir verdaccio-demo-use
cd verdaccio-demo-use
npm init -y
```

### 安装上传到verdaccio私有库的包
安装刚刚发布到私有库的依赖
```
npm i verdaccio-demo-publish -S
npm i ee-front -S
```

安装依赖操作的时候，会发现报错了：

报错code是404，是因为默认情况下会从npm公共仓库下载包，而不是从我们私有仓库下载包，
依然需要在项目根目录添加 .npmrc文件，添加配置:

.npmrc
```
registry=http://localhost:4873/
```

### 测试使用：使用从私有库安装的包:
node index.js
```js
const { add } = require('verdaccio-demo-publish')
console.log(add(1, 2))
```

### 测试使用：测试安装不在verdaccio私有库的包
```bash
npm i react -S
```
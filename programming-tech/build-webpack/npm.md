1. 发出npm install命令；查询node_modules目录之中是否已经存在指定模块,存在，跳过
2. npm 向registry查询模块压缩包的网址；
3. 下载压缩包，存放在~/.npm目录；
4. 安装模块:解压压缩包到当前项目的node_modules目录；
5. 生成或更新版本描述文
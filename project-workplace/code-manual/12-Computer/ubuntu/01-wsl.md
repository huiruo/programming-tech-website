## 安装
https://docs.microsoft.com/zh-cn/windows/wsl/install 

## 在 wsl 中打开
```
在vs 打开项目：
code .
```

## node
```
参考：https://developer.aliyun.com/article/760687

安装指定版本:
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
NodeSource 源启用成功后，安装 Node.js 和 npm:
sudo apt-get install -y nodejs

卸载旧版本：
sudo apt-get remove nodejs
sudo apt autoremove
```
```js
未能保存“typeorm.config.ts”: 无法写入文件"vscode-remote://wsl+ubuntu-20.04/home/ruo/user_ws/boter/apps/server/config/typeorm.config.ts"(NoPermissions (FileSystemError): Error: EACCES: permission denied, open '/home/ruo/user_ws/boter/apps/server/config/typeorm.config.ts')


wsl (NoPermissions (FileSystemError): Error: EACCES: permission denied, open
```

```
Try this, fixed it for me

sudo chown -R username path 
Example:

sudo chown -R root /home/ruo/user_ws/boter
cd /home/ruo/user_ws/boter

// 这条命令可以
sudo chown -R root /home/
sudo chown 777 /home/
sudo chown 777 /home/ruo/


EACCES: permission denied, open '/home/ruo/.vscode-server/extensions/.obsolete'

chmod 777 -R  需要改变存取模式的目录（中间加的　-R 是递归这个目录下的所有目录和文件）
sudo chmod 777 /home/ -R
```

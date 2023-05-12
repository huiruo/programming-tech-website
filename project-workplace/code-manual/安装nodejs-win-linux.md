## 安装默认版本
```
sudo apt install -y build-essential
sudo apt install nodejs
sudo apt install npm
```

## NodeSource安装最新
有时不一定成功
```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

sudo apt install -y nodejs
```


## 手动安装包安装
```
访问这里：
https://nodejs.org/dist/

找到想安装版本:
sudo wget https://nodejs.org/dist/latest-v18.x/node-v18.16.0-linux-x64.tar.xz

sudo mv node-v18.16.0-linux-x64.tar.xz /usr/local/etc

cd /usr/local/etc
cd /usr/local/

sudo tar -xf node-v18.16.0-linux-x64.tar.xz
```

### 设置环境变量
```bash
sudo vim ~/.bashrc

# 末尾添加
export PATH="/usr/local/etc/node-v16.14.0-linux-x64/bin:$PATH"

# 立即生效
source ~/.bashrc
```

还有一种方式：
软连接的方式的话以后安装 yarn 之类的话也需要自己添加软链接
```bash
sudo ln -s /usr/local/etc/nodejs/bin/node /usr/local/bin/
# 设置 node 软链接

sudo ln -s /usr/local/etc/nodejs/bin/npm /usr/local/bin/
# 设置 npm 软链接
```


## 卸载
sudo apt remove nodejs
sudo apt remove npm

## 版本管理

https://learn.microsoft.com/zh-cn/windows/dev-environment/javascript/nodejs-on-wsl

### fnm
https://github.com/Schniz/fnm#using-a-script
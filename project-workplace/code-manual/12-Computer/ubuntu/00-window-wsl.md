## 通过powershell 安装
wsl --install

wsl --install -d Ubuntu-22.04
```
安装成功，之后需要为新安装的 Linux 发行版创建用户帐户和密码。
```
## 第二种方式：通过商店安装


## 登录
wsl -u <Username>
wsl --user <Username>

## 配置
sudo apt update

sudo apt-get install curl

sudo apt git
```
/home/ruo/.ssh/id_rsa.pub
ssh -T git@github.com
```

## 配置nodejs
https://learn.microsoft.com/zh-cn/windows/dev-environment/javascript/nodejs-on-wsl
```
使用以下命令安装 nvm：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
若要验证安装，请输入：
command -v nvm

列出当前安装的 Node 版本（此时应为无）：nvm ls


安装 Node.js 的当前稳定的 LTS 版本（推荐用于生产应用程序）：nvm install --lts
安装 Node.js 的当前版本（用于测试最新的 Node.js 功能和改进，但更容易出现问题）：nvm install node
```

* 使用以下命令验证 Node.js 是否已安装，以及是否为当前默认版本：node --version。 然后使用以下命令验证是否也有 npm：npm --version（还可以使用 which node 或 which npm 来查看用于默认版本的路径）。

* 若要更改要用于项目的 Node.js 版本，请创建新的项目目录 mkdir NodeTest，输入目录 cd NodeTest，然后输入 nvm use node 切换到当前版本，或输入 nvm use --lts 切换到 LTS 版本。 你还可以使用已安装的任何其他版本的特定数量，如 nvm use v8.2.1。 （若要列出 Node.js 的所有可用版本，请使用以下命令：nvm ls-remote）。

npm install -g yarn

## python
自带:
python3 --version

## 安装 zsh
查看：
cat /etc/shells
sudo apt install zsh
设置：
chsh -s /bin/zsh #安装完成后设置当前用户使用 zsh 并重启 wsl
chsh -s /bin/sh
chsh -s /bin/bash 这个是默认终端
```

```

此时我们需要下载 oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

此时我们可以根据该项目 readme 切换主题
```
vim ~/.zshrc

ZSH_THEME="agnoster"

# 设置 node 在 zsh的命令
export PATH=/home/ruo/.nvm/versions/node/v18.15.0/bin:$PATH
```

## 一般都在/usr/bin
/usr/share
/usr/local

https://www.cnblogs.com/ahuo/archive/2012/06/02/2532322.html


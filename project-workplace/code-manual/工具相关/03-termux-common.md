# linux 
## rename
```
将目录A重命名为B
mv A B

例子：将/a目录移动到/b下，并重命名为c
mv /a /b/c
```
## delete 创建文件夹和文件
rm -rf xx

```
mkdir /root/log-codeserver

touch /root/log-codeserver/log.txt

rm -f testfile

rm -rf testfile

查看版本
cat /etc/issue
```

## edit
nvim ~/.config/nvim/init.vim
cd /storage/emulated/0/A-termux-space/programming-technology


# termux 基础使用
## 触摸键盘
Ctrl+A -> 将光标移动到行首
Ctrl+C -> 中止当前进程
Ctrl+D -> 注销终端会话
Ctrl+E -> 将光标移动到行尾
Ctrl+K -> 从光标删除到行尾
Ctrl+L -> 清除终端
Ctrl+Z -> 挂起（发送SIGTSTP到）当前进程

## 音量加键也可以作为产生特定输入的特殊键.

音量加+E -> Esc键
音量加+T -> Tab键
音量加+1 -> F1（和音量增加+ 2→F2等）
音量加+0 -> F10
音量加+B -> Alt + B，使用readline时返回一个单词
音量加+F -> Alt + F，使用readline时转发一个单词
音量加+X -> Alt+X
音量加+W -> 向上箭头键
音量加+A -> 向左箭头键
音量加+S -> 向下箭头键
音量加+D -> 向右箭头键
音量加+L -> | （管道字符）
音量加+H -> 〜（波浪号字符）
音量加+U -> _ (下划线字符)
音量加+P -> 上一页
音量加+N -> 下一页
音量加+. -> Ctrl + \（SIGQUIT）
音量加+V -> 显示音量控制
音量加+Q -> 显示额外的按键视图

## pkg
pkg search 搜索包
pkg install 安装包
pkg uninstall 卸载包
pkg reinstall 重新安装包
pkg update 更新源
pkg upgrade 升级软件包
pkg list-all 列出可供安装的所有包
pkg list-installed 列出已经安装的包
pkg shoe 显示某个包的详细信息
pkg files 显示某个包的相关文件夹路径

# termux 安装和配置
## 不要从google play 安装
```
从git下载：
https://github.com/termux/termux-app#installation

termux-app_v0.118.0+github-debug_arm64-v8a.apk


安装 Termux 后，启动它并使用 Termux 的 pkg 命令执行一些必要的软件安装。

// 更新源 和 升级软件包
pkg update && pkg upgrade

订阅附加仓库 root-repo ：pkg install root-repo
执行更新，使所有安装的软件达到最新状态：

sl
安装命令：pkg install sl

fish
安装命令：pkg install fish
执行命令：fish
清屏。
输入：exit，退出。

安装sudo
一开始是不能用sudo命令的，所以需要输入安装sudo
pkg install tsu

缓存
termux-setup-storage
```

```
// 下载工具
apt install wget
// 解压缩工具
apt install tar

pkg install build-essential python nodejs yarn

pkg uninstall nodejs
```


## git 和 openssh
```
pkg install git openssh
pkg i vim
apt install less   // termux下vim支持触摸移动光标移动位置
export EDITOR=vim  把默认编辑器修改为vim

如果失败：
pkg remove game-repo
pkg remove science-repo
pkg update
```

git:
```
Generating public/private rsa key pair.
Enter file in which to save the key (/data/data/com.termux/files/home/.ssh/id_rsa):

cd /data/data/com.termux/files/home/.ssh

vim id_rsa.pub
cd /storage/emulated/0/termux-space/
git clone git@github.com:huiruo/life.git
```

## 目录结构 和 特殊环境变量 PREFIX
```
~ > echo $HOME
/data/data/com.termux/files/home
~ > echo $PREFIX
/data/data/com.termux/files/usr
 
~ > echo $TMPPREFIX
/data/data/com.termux/files/usr/tmp/zsh
```
长期使用 Linux 的朋友可能会发现，这个 HOME 路径看上去可能不太一样，为了方便，Termux 提供了一个特殊的环境变量：PREFIX


# termux nginx
```
apt install nginx -y
nginx文件安装完成之后的文件位置：

/usr/sbin/nginx：主程序
/etc/nginx：存放配置文件
/usr/share/nginx：存放静态文件
/var/log/nginx：存放日志

service nginx start  #启动nginx
nginx -s quit
nginx -s reload

ifconfig
192.168.1.102 
192.168.1.255
```

```
pkg install nginx

nginx

浏览器输入127.0.0.1:8080看到以下界面即成功
```

### nginx 常用命令
```
nginx -s quit //优雅停止nginx，有连接时会等连接请求完成再杀死worker进程

nginx -s reload //优雅重启，并重新载入配置文件nginx.conf

nginx -s reopen //重新打开日志文件，一般用于切割日志

nginx -v //查看版本

nginx -t //检查nginx的配置文件

nginx -h //查看帮助信息

nginx -V //详细版本信息，包括编译参数

nginx -c filename //指定配置文件
```

# 安装 linux
pkg install proot-distro 
proot-distro list
```
proot-distro install <alias> 
比如，我要安装ubuntu 20.04，指令为：
proot-distro install ubuntu-20.04

proot-distro login ubuntu
输入exit可以退出登录的linux系统
```

### 安装Linux后
```
apt update
apt upgrade

可选：
apt install nodejs
apt install npm
apt install gcc
apt install g++
apt install gfortran
apt install cmake

然后安装java：
apt search openjdk

然后安装python。
apt install python3
```

### vim 配置
https://www.bilibili.com/video/av844444336/

## 1
```
git config --global user.name "huiruo"
git config --global user.email "2196411859@qq.com"

git config --global user.name "shuling"
git config --global user.email "3221563643@qq.com"
ssh-keygen -t rsa -C "3221563643@qq.com"

ssh-keygen -t rsa -C "2196411859@qq.com"

Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.

复制文件到git：
id_rsa.pub

验证添加SSH key成功否：
ssh -T git@github.com

git clone git@github.com:shulingchen/professional-technology-manual.git

cd /storage/emulated/0/termux-space/professional-technology-manual

git clone git@github.com:huiruo/code-record-manual.git


进入目录：
cd /storage/emulated/0/termux-space/professional-technology-manual
从git更新:
git pull
```
---
title: mysql8安装
sidebar_position: 1
---

修改my.ini文件：
```
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[mysqld]
# 设置3306端口
port = 3306
# 设置mysql的安装目录
basedir = D:\\Program Files\\mysql\\
# 设置mysql数据库的数据的存放目录
datadir = D:\\Program Files\\mysql\\data
# 允许最大连接数
max_connections=20
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 创建模式
sql_mode = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
```

basedir = D:\\Program Files\\mysql\\
basedir = D:\\Program Files\\mysql8.0.27
datadir = D:\\Program Files\\mysql8.0.27\\data

## 设置环境变量
MYSQL_HOME
D:\Program Files\mysql8.0.27
D:\zipApp\mysql-8.0.28-winx64

path：
%MYSQL_HOME%\bin


## 3
```
以管理员身份运行cmd，执行以下操作：

（1）切换到mysql的bin目录；
（2）执行mysqld --initialize命令，此时会生成一个新目录data，查看.err文件，可以看到root用户生成的随机密码；

mysqld --initialize

generated for root@localhost: 0=kfOgxSyq7O
0=kfOgxSyq7O
```

（3）执行mysqld --install命令，安装mysqld服务；

mysqld --install

执行net start mysql命令，启动mysql服务；

net start mysql
net stop mysql命令，停止mysql服务

执行mysql -u root -p命令，连接mysql数据库，输入上述随机生成的密码；

mysql -u root -p

```
执行以下sql重置root密码：
alter user 'root'@'localhost' identified with mysql_native_password by 'Abchen123456';
```
## redis
```
sudo apt-get update

sudo apt-get install -y redis-server

service 服务识别不了redis 要不没安装 或者安装了名字不是这个
可以用service --status-all 查看一下支持的服务

然后再sudo service redis-server start 成功

启动：
sudo service redis-server start

查看状态：
service redis-server status
```

## 配置
```
root@CHENG:/etc/systemd/system# whereis redis
redis: /etc/redis
cd /etc/redis

改为6388：
设置密码

配置文件中添加 requirepass 123456

重启redis，命令service redis restart。
service redis-server restart

在查看端口情况如下:
netstat -talnp
```

## windows Redis
```
C:\Program Files\Redis

redis-server.exe redis.windows.conf

常见的redis服务命令：

       卸载redis服务-------------redis-server --service-uninstall

       开启redis服务-------------redis-server --service-start

       停止redis服务-------------redis-server --service-stop

设置密码由于开机启动配置文件为
redis.windows-service.conf，文件内部有设置密码项，所以我们修改redis.windows-service.conf文件，
```
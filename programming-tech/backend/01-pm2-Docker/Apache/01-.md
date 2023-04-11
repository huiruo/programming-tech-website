```
运行:
cd D:\Apache24\bin
httpd.exe

localhost:8089
```


### config:
D:\Apache24\conf\httpd.conf
```conf
# Define SRVROOT "c:/Apache24"
Define SRVROOT "D:/Apache24"

ServerRoot "${SRVROOT}"
```

```
输入以下命令安装Apache服务：（要以管理员身份打开dos窗口）
httpd -k install -n Apache24

关闭和停止：
httpd -k stop -n Apache24
httpd -k start -n Apache24


重启和卸载http的命令
httpd -k restart -n Apache24
httpd -k uninstall -n Apache24
注意：卸载时要先关闭服务，再卸载。否则服务可能依然在运行，只是状态设为了“禁用”
```

### 网站
在 D:\Apache24\htdocs
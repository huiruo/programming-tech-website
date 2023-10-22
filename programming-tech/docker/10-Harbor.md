Harbor 是由 VMware 公司中国团队为企业用户设计的 Registry server 开源项目，包括了权限管理 (RBAC)、LDAP、审计、管理界面、自我注册、HA 等企业必需的功能，同时针对中国用户的特点，设计镜像复制和中文支持等功能。

前置条件：已安装docker、Docker Compose

* 基于角色的访问控制 - 用户与 Docker 镜像仓库通过 “项目” 进行组织管理，一个用户可以对多个镜像仓库在同一命名空间（project）里有不同的权限。
* 镜像复制 - 镜像可以在多个 Registry 实例中复制（同步）。尤其适合于负载均衡，高可用，混合云和多云的场景。
* 图形化用户界面 - 用户可以通过浏览器来浏览，检索当前 Docker 镜像仓库，管理项目和命名空间。
* AD/LDAP 支持 - Harbor 可以集成企业内部已有的 AD/LDAP，用于鉴权认证管理。
* 审计管理 - 所有针对镜像仓库的操作都可以被记录追溯，用于审计管理。
* 国际化 - 已拥有英文、中文、德文、日文和俄文的本地化版本。更多的语言将会添加进来。
* RESTful API - RESTful API 提供给管理员对于 Harbor 更多的操控，使得与其它管理软件集成变得更容易。
* 部署简单 - 提供在线和离线两种安装工具， 也可以安装到 vSphere 平台 (OVA 方式) 虚拟设备。

## 1.harbor安装及配置
```
wget https://github.com/goharbor/harbor/releases/download/v2.3.4/harbor-offline-installer-v2.3.4.tgz
tar xf harbor-offline-installer-v2.3.4.tgz -C /usr/local/
cd /usr/local/harbor

#修改配置文件

[root@localhost harbor]# ll
总用量 596292
-rw-r--r-- 1 root root      3361 11月  9 2021 common.sh
-rw-r--r-- 1 root root 610560420 11月  9 2021 harbor.v2.3.4.tar.gz
-rw-r--r-- 1 root root      7844 6月  13 12:31 harbor.yml
-rw-r--r-- 1 root root      7840 11月  9 2021 harbor.yml.tmpl
-rwxr-xr-x 1 root root      2500 11月  9 2021 install.sh
-rw-r--r-- 1 root root     11347 11月  9 2021 LICENSE
-rwxr-xr-x 1 root root      1881 11月  9 2021 prepare

cp harbor.yml.tmpl harbor.yml

#修改hostname、harbor登录密码、关闭https。

vim harbor.yml
hostname: www.myharbor.com
harbor_admin_password: harbor12345
#https:
  # https port for harbor, default is 443
  #  port: 443
  # The path of cert and key files for nginx
  #  certificate: /your/certificate/path
  # private_key: /your/private/key/path
data_volume: /data  #这个路径是宿主机的路径，根据实际情况修改成空间大的地方
```

```
#执行安装程序，只安装harbor
./install.sh  (前提条件：docker需要启动)

# 除了安装harbor外，还安装公正服务 notary 以及漏洞扫描器 trivy，
./install.sh --with-notary --with-trivy --with-chartmuseum

[root@localhost harbor]# ll
总用量 596300
drwxr-xr-x 3 root root        20 6月  13 12:34 common
-rw-r--r-- 1 root root      3361 11月  9 2021 common.sh
-rw-r--r-- 1 root root      5996 6月  13 12:34 docker-compose.yml
-rw-r--r-- 1 root root 610560420 11月  9 2021 harbor.v2.3.4.tar.gz
-rw-r--r-- 1 root root      7844 6月  13 12:31 harbor.yml
-rw-r--r-- 1 root root      7840 11月  9 2021 harbor.yml.tmpl
-rwxr-xr-x 1 root root      2500 11月  9 2021 install.sh
-rw-r--r-- 1 root root     11347 11月  9 2021 LICENSE
-rwxr-xr-x 1 root root      1881 11月  9 2021 prepare
```

## 用docker-compose查看Harbor容器的运行状态

```
[root@localhost harbor]# docker-compose ps
      Name                     Command                  State                      Ports                
--------------------------------------------------------------------------------------------------------
harbor-core         /harbor/entrypoint.sh            Up (healthy)                                       
harbor-db           /docker-entrypoint.sh 96 13      Up (healthy)                                       
harbor-jobservice   /harbor/entrypoint.sh            Up (healthy)                                       
harbor-log          /bin/sh -c /usr/local/bin/ ...   Up (healthy)   127.0.0.1:1514->10514/tcp
harbor-portal       nginx -g daemon off;             Up (healthy)                                       
nginx               nginx -g daemon off;             Up (healthy)   0.0.0.0:80->8080/tcp,:::80->8080/tcp
redis               redis-server /etc/redis.conf     Up (healthy)                                       
registry            /home/harbor/entrypoint.sh       Up (healthy)                                       
registryctl         /home/harbor/start.sh            Up (healthy) 

docker-compose基本命令

# 启动Harbor容器
docker-compose start

# 停止Harbor容器
docker-compose stop

# 暂停Harbor容器
docker-compose pause

# 继续运行Harbor容器
docker-compose unpause

# 重启Harbor容器
docker-compose restart

# 停止并删除Harbor容器，加上-v参数可以同时移除挂载在容器上的目录
docker-compose down

# 创建并启动Harbo容器，参数“-d”表示后台运行命令
docker-compose up -d
```
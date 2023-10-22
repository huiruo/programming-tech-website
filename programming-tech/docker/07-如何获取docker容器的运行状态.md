
## 如何获取docker 容器的运行状态
1. 查看所有正在运行的Docker容器：

```
docker ps
```

2. 查看所有的Docker容器，包括已经停止的容器：

```
docker ps -a
```

3. 获取Docker容器的详细信息，包括运行状态：

```
docker inspect <container_name>
```

注：其中 `<container_name>` 是容器名称或容器ID。

4. 查看Docker容器的日志：

```
docker logs <container_name>
```

注：其中 `<container_name>` 是容器名称或容器ID。

5. 获取Docker容器的健康状态：

```
docker inspect --format='{{json .State.Health}}' <container_name>
```

注：其中 `<container_name>` 是容器名称或容器ID。

6. 获取Docker容器的CPU和内存使用情况：

```
docker stats <container_name>
```

注：其中 `<container_name>` 是容器名称或容器ID。

7. 通过Docker API获取Docker容


## 用js写一个程序获取docker容器的运行状态
有多种方法可以获取Docker容器的运行状态，以下是其中一种基于Docker命令的JavaScript程序示例：

```javascript
const { exec } = require('child_process');

function checkContainerStatus(containerName) {
  exec(`docker inspect -f '{{.State.Status}}' ${containerName}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing command: ${err}`);
      return;
    }
    console.log(`Container ${containerName} is ${stdout.trim()}`);
  });
}

// Example usage
checkContainerStatus('my-container');
```

该程序使用`child_process`模块的`exec`函数执行Docker命令`docker inspect`，并使用`-f`参数指定输出格式为容器状态。程序将命令输出的结果作为回调函数的标准输出返回，然后输出容器的运行状态。在上面的示例中，容器名称为`my-container`。

### 用shelljs写一个程序获取docker容器的运行状态
```js
/*
`exec`函数执行Docker命令`docker inspect`，并使用`-f`参数指定输出格式为容器状态。
程序将命令输出的结果作为`exec`函数返回的对象的标准输出返回，然后输出容器的运行状态。
在上面的示例中，容器名称为`my-container`。注意，`silent`参数设置为`true`以禁用命令输出到控制台。
*/
checkContainerStatus(containerName: string) {
  const command = `docker inspect -f '{{.State.Status}}' ${containerName}`;
  const result = exec(command, { silent: true });
  if (result.code !== 0) {
    console.error(`Error executing command: ${result.stderr}`);
    return;
  }
  console.log(`Container ${containerName} is ${result.stdout.trim()}`);
}
```

### 用shelljs写一个程序获取docker在运行的docker,输出数组
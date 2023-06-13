
# yarn
## yarn add
默认情况下，使用 yarn add 命令添加依赖时，会将依赖包添加到 dependencies 字段中。这意味着，该依赖包将作为项目的生产依赖，在应用部署时会被安装到生产环境中。

## yarn add some-package --dev
添加到 devDependencies 字段中，表示该依赖包只是项目的开发依赖，在应用部署时不会被安装到生产环境中。
```
使用 --dev 或 -D 选项
```

# npm
## npm install some-package
```
这个命令会将 some-package 安装到 dependencies 字段中。
```

## npm install some-package --save-dev
将依赖包安装到 devDependencies 字段中，可以使用 --save-dev 或 -D 选项


---
title: chromium编译
sidebar_position: 1
---

配置vs和SDK还有环境变量等过程和上面配置v8时一致，只是在最后fetch和编译时有些许差别

```
fetch chromium
cd src

gn gen out/debug_comp --args="is_debug=true is_component_build=true" 

autoninja -C out/debug_comp chrome
```

或者使用vs进行编译调试
```shell
gn gen --ide=vs out\debug_by_vs --args="is_component_build = true is_debug = true v8_optimized_debug = false"
```

最后找到gn_all，编译之，最终得到可执行文件。


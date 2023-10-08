
## 保存当前工作目录的未提交更改，并可选择性地附加一条消息
```bash
git stash save "message

gsta	On Git >= 2.13: git stash push
gsta	On Git < 2.13: git stash save
```

## 列出所有的存储项，以便查看已保存的更改。每个存储项都有一个唯一的名称（如 stash@{0}、stash@{1} 等
```bash
git stash list

gstl
```

## 应用指定的存储项到当前分支，但并不删除存储项。
你可以使用 stash@{n} 来引用存储项，其中 n 是存储项的编号。
```bash
git stash apply stash@{n}

gstaa
```

## 应用最新的存储项（stash），并从存储列表中删除它
通常用于恢复最近一次保存的更改。
```bash
git stash pop

gstp
```

## 删除指定的存储项，其中 n 是存储项的编号。
```bash
git stash drop stash@{n}

gstd
```

## 删除所有的存储项。这会清空存储列表，慎用
```bash
git stash clear

gstc
```

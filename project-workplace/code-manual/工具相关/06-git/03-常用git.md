## 手动merge
1、当master代码改动了，需要更新开发分支（dev）上的代码
```git
git checkout master 
git pull 
git checkout dev
git merge master 
git push -u origin dev
```

2、开发分支（dev）上的代码达到上线的标准后，要合并到 master 分支
```
git checkout dev
git pull
git checkout master
git merge dev
git push -u origin master
```

## 切换到某一个commit,常调试用
```
git checkout c5d383d74bbe42af7
```

## 基于某个分支new 分支等操作
```
git checkout -b feat-xx

git push --set-upstream origin feat-xx

删除远程分支：
git push --delete origin feat-xx

删除本地：
git branch -D feat-xx
```

## log
```
1.简洁显示日志记录,按向下键来查看更多，按 Q 键退出查看日志

git log --pretty=oneline
例子：撤销commit文件
前五次提交是已经 push 到远程仓库的,第六次是 commit 的,然后我突然不想 commit 了,需要撤销：
情况1:
git reset --hard c5d383d74bbe42af7(你需要回退到的id)
撤销第六次 commit ,你就要把 HEAD 指向 第五次,所以 reset 一下 HEAD

情况2：
如果想保留工作空间的代码只是撤销commit,请执行下面的命令:
git reset --soft HEAD^
HEAD^的意思是上一个版本，也可以写成HEAD~1
如果你进行了2次commit，想都撤回，可以使用HEAD~2



2.显示从近到远的日志记录，按向下键来查看更多，按 Q 键退出查看日志

git log
```

## git reset 参数
```
--mixed
意思是：不删除工作空间改动代码，撤销commit，并且撤销git add . 操作
这个为默认参数,git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的。
--soft
不删除工作空间改动代码，撤销commit，不撤销git add .
--hard
删除工作空间改动代码，撤销commit，撤销git add .
注意完成这个操作后，就恢复到了上一次的commit状态。
```

## 撤销push 文件
```
第一步:
git log --pretty=oneline

第二步:　
git reset --soft commitID(d6cdbba417....) 
回退当前工作空间的上一个版本,并且保留代码更改

三：
git log --pretty=oneline
再次查看当前提交的日志,确认是否成功撤销

四：
git push origin master --force
强制提交当前版本号，以达到撤销版本号的目的.必须添加参数force进行强制提交，否则会提交失败,报错原因：本地项目版本号低于远端仓库版本号。(master 代表分支名称,默认是 master，或者也可以直接用 git push --force)
```

## 删除远程分支
```bash
git push origin --delete feature-branch
```

## 方法1.回退不提交（可能不生效）

$ git reset --hard HEAD^ 回退到上个版本
$ git reset --hard HEAD~3 回退到前3次提交之前，以此类推，回退到n次提交之前
$ git reset --hard commit_id 退到/进到 指定commit的sha码

## 方法2：回退不提交（推荐）
```
git reset --hard 962c01f580a2c5b2afa86625b36d5472af1c4033
```

## 第二步，提交
强推到远程：
$ 
git push origin HEAD --force



## 回退到已经push 的commit
git reset --hard 10bd20ca1b328ac03849fcd09705ae2e58d95d6e

git reset --hard 873a9ee2426b27566fbfed208101796794f57a82

git push origin HEAD --force
或
git push origin master -f

## git pull --rebase
```
git pull = git fetch + git merge
git pull --rebase = git fetch + git rebase

--rebase的本意是想让事情的发展看起来很连续和优美，而不是多出很多无用的merge commit

git pull , 该命令会将远程的提交和你本地的提交merge，如果有冲突需要手动解决并提交，会产生merge的记录

git pull -- rebase 该命令会把你的提交“放置”在远程拉取的提交之后，即改变基础（变基），如果有冲突

解决所有冲突的文件，git add <冲突文件>
git rebase --continue
```

## 回退版本（三种方式）

### git reset commit_id(撤销 commit 和 add 操作)
git reset 默认是--mixed 模式

* 回退一个版本,且会将暂存区的内容和本地已提交(commit)的内容全部恢复到未暂存的状态,不影响原来本地文件(未提交的也不受影响)

* 会保留源码，只是将 git commit 和 index 信息回退到了某个版本

### git reset --soft commit_id（撤销 commit 操作）
```
*回退一个版本,不清空暂存区,将已提交的内容恢复到暂存区,不影响原来本地的文件(未提交的也不受影响)

保留源码，只回退 commit 信息到某个版本，不涉及 index 的回退，如果还需要提交，直接 commit 即可
```

### git reset --hard commit_id（慎用）
撤销 commit 和 add 操作，并将本地版本置回上一版本

回退一个版本,清空暂存区,将已提交的内容的版本恢复到本地,本地的文件也将被恢复的版本替换

源码也会回退到某个版本,commit 和 index 都会回退到某个版本.(注意这种方式是改变本地代码仓库源码)



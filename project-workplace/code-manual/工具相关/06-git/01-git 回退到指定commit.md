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
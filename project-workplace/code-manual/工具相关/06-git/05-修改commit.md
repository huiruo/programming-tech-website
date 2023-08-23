
1. git log

2. git rebase -i <commit-id>

3. 在rebase界面中将需要修改的commit的命令由pick改为edit。然后保存并退出。

4. 现在你已经处于需要修改的commit的状态，可以使用git commit --amend命令来修改该commit：
git commit --amend
这会打开一个编辑器，你可以修改commit的提交信息。完成后保存并退出编辑器。

5. git rebase --continue

6. 最后使用git push --force命令来强制更新远程仓库：


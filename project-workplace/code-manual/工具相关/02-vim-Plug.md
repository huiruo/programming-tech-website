## 常用命令
:source ~/.vimrc
:source 重新加载配置
:tabnew xx
:e重新加载文件
:e!强制丢掉本地修改，从磁盘加载文件.

## 插件使用
PlugStatus	列出所有已安装插件
PlugInstall	安装.vimrc中安装的插件
PlugUpdate	更新.vimrc中安装的插件
PlugClean	删除.vimrc中没有安装的插件
PlugSearch	搜索插件

## tab总结
```
:tabedit{filename}新建标签页，并在标签页中打开对应文件

tabnew: 与tabedit完全相同

<Ctrl+w>T如果当前标签中有多个子窗口，它会将当前活动子窗口放到新的标签页中

tabc[lose]闭当前标签页

tabo[nly]关闭除当前激活标签页的所有

gt 或:tabn[ext]切换到下一个标签页

gT 或tabp[revious]切换到上一个标签页

tabmove {n}移动当前标签页
```


## vim-terminal-help
* ALT + =: toggle terminal below.
* ALT + SHIFT + h: move to the window on the left.
* ALT + SHIFT + l: move to the window on the right.
* ALT + SHIFT + j: move to the window below.
* ALT + SHIFT + k: move to the window above.
* ALT + SHIFT + n: move to the previous window.
* ALT + -: paste register 0 to terminal.
* ALT + q: switch to terminal normal mode.
```
首先，这个插件设置了一个键盘映射ALT+=（可以更改）来切换终端窗口，就像 vscode 的CTRL+backtick. 当您按下ALT+=它将在当前窗口下方打开一个新终端，并将 shell 工作目录初始化为当前文件的父目录。大多数时候你想对当前文件做一些事情，所以在当前文件目录中打开 shell 会让生活更轻松。

完成后，只需ALT+=再次按下即可隐藏终端，因此您始终按下ALT+=可切换终端窗口，但如果您运行exit并退出前一个终端会话并ALT+=再次点击，则会创建一个新终端。

ALT+SHIFT+h/j/k/l在窗口之间移动。大多数 vim 用户用于CTRL+h/j/k/l窗口切换，但这些键在终端应用程序中被大量使用，例如，如果您使用tnoremap覆盖CTRL+j或CTRL+k，您将无法在 fzf 中使用它们。所以CTRL+h/j/k/l不会用于tnoremap，terminal-help鼓励大家使用新的ALT+SHIFT+h/j/k/l窗口间跳转。
```

### vim-terminal设置
```
g:terminal_key: 哪个键将用于切换终端窗口，默认为<m-=>.
g:terminal_cwd：初始化工作目录：0用于未更改的1文件路径和2项目根目录。
g:terminal_height: 新的终端高度，默认为 10。
g:terminal_pos: 在哪里打开终端，默认为rightbelow.
g:terminal_shell: 指定 shell 而不是默认的。
g:terminal_edit: 在vim中打开文件的命令，默认为tab drop.
g:terminal_kill: 设置为term在退出 vim 时终止会话。
g:terminal_list: 设置为 0 以在缓冲区列表中隐藏终端缓冲区。
g:terminal_fixheightwinfixheight: 设置为 1为终端窗口设置。
g:terminal_close: 设置为 1 以在进程完成时关闭窗口。
```

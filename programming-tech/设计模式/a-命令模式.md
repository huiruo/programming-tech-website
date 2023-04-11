---
title: 命令模式
sidebar_position: 9
---

```js
<body>

	<button id="button1">点击按钮1</button>
	<button id="button2">点击按钮2</button>
	<button id="button3">点击按钮3</button>

	<script>
		var button1 = document.getElementById( 'button1' ),
		var button2 = document.getElementById( 'button2' ),
		var button3 = document.getElementById( 'button3' );

		var setCommand = function( button, command ){
			button.onclick = function(){
				command.execute();
			}
		};

		var MenuBar = {
			refresh: function(){
				console.log( '刷新菜单目录' );
			}
		};
		var SubMenu = {
			add: function(){
				console.log( '增加子菜单' );
			},
			del: function(){
				console.log( '删除子菜单' );
			}
		};
		在让button 变得有用起来之前，我们要先把这些行为都封装在命令类中：
		var RefreshMenuBarCommand = function( receiver ){
			this.receiver = receiver;
		};
		RefreshMenuBarCommand.prototype.execute = function(){
			this.receiver.refresh();
		};
		var AddSubMenuCommand = function( receiver ){
			this.receiver = receiver;
		};

		AddSubMenuCommand.prototype.execute = function(){
			this.receiver.add();
		};
		var DelSubMenuCommand = function( receiver ){
			this.receiver = receiver;
		};
		DelSubMenuCommand.prototype.execute = function(){
			console.log( '删除子菜单' );
		};

		var refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar );
		var addSubMenuCommand = new AddSubMenuCommand( SubMenu );
		var delSubMenuCommand = new DelSubMenuCommand( SubMenu );
		setCommand( button1, refreshMenuBarCommand );
		setCommand( button2, addSubMenuCommand );
		setCommand( button3, delSubMenuCommand );
	</script>
</body>
```
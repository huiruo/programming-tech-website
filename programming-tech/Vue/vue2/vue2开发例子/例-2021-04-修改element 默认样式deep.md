有些Sass 之类的预处理器无法正确解析 >>>。可以使用 /deep/ 操作符( >>> 的别名)
## deep样式穿透
```
  <div class="custom-css">
	<el-tabs
	  class="custom-css"
	  v-model="activeName"
	  @tab-click="handleClick"
	>
	  <el-tab-pane label="弹窗提示文案" name="first"
	    >用户管理</el-tab-pane
	  >
	  <el-tab-pane label="系统消息文案" name="second"
	    >配置管理</el-tab-pane
	  >
	  <el-tab-pane label="toast提示文案" name="third"
	    >角色管理</el-tab-pane
	  >
	</el-tabs>
      </div>
```

```
<style lang="scss" scoped>
.footer-content {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}
.custom-css /deep/ .el-tabs__item {
  color: #ebeef5;
}
.custom-css /deep/ .is-active {
  color: #409eff;
}
</style>
```

## 2.使用>>>穿透
```
<style scoped>
	.my .el-input__inner{
		border-radius: 30px;/* 这个不起作用 */
	}
	.my >>> .el-input__inner{
		border-radius: 30px;/* 这些起作用 */
		border: 1px solid #eceef2;
		outline: 0;
	}
</style>
```


## 3.在样式外新增一个样式不添加scoped
```
<style>
	.my{
		margin: 20px;
	}
	.my .el-input__inner{
		border-radius: 15px;/* 这个样式起效果 */
	}
</style>
<style scoped>
	.my .el-input__inner{
		border-radius: 30px; /* 这个样式不起效果 */
	}
</style>
```

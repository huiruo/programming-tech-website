伪类： hover active    伪类目的是拿到元素得状态

伪元素： befor after    是元素，只不过不在dom 里面，为了使css 拿到 dom元素以外得元素。


1.
		/*链接伪类*/		注意:link，:visited，:target是作用于链接元素的！
				:link		表示作为超链接，并指向一个未访问的地址的所有锚
				:visited	表示作为超链接，并指向一个已访问的地址的所有锚
				:target 	代表一个特殊的元素，它的id是URI的片段标识符
		/*动态伪类*/		注意:hover，:active基本可以作用于所有的元素！
				:hover		表示悬浮到元素上
				:active		表示匹配被用户激活的元素（点击按住时）
				
				由于a标签的:link和:visited可以覆盖了所有a标签的状态，所以当:link，:visited，:hover，:active同时出现在a标签
				身上时 :link和:visited不能放在最后！！！
				
				隐私与:visited选择器
					只有下列的属性才能被应用到已访问链接：
						color
						background-color
						border-color
		/*表单相关伪类*/
				:enabled	匹配可编辑的表单
				:disable	匹配被禁用的表单
				:checked	匹配被选中的表单
				:focus		匹配获焦的表单
				
		/*结构性伪类*/
				index的值从1开始计数！！！！
				index可以为变量n(只能是n)
				index可以为even odd

					#wrap ele:nth-child(index)		表示匹配#wrap中第index的子元素 这个子元素必须是ele
					#wrap ele:nth-of-type(index)	表示匹配#wrap中第index的ele子元素
					除此之外:nth-child和:nth-of-type有一个很重要的区别！！
							nth-of-type以元素为中心！！！
							
				:nth-child(index)系列			

					:first-child
					:last-child
					:nth-last-child(index)
					:only-child	(相对于:first-child:last-child 或者 :nth-child(1):nth-last-child(1))
					
				:nth-of-type(index)系列
					:first-of-type
					:last-of-type
					:nth-last-type(index)
					:only-of-type	(相对于:first-of-type:last-of-type 或者 :nth-of-type(1):nth-last-of-type(1))
					
				:not		
				:empty(内容必须是空的，有空格都不行，有attr没关系)


2.
		/*伪元素*/
				::after
				::before
				::firstLetter
				::firstLine
				::selection
## 参数
```go
//多个同类型的参数，可省略前面的类型

func testFn(x, y int){

	fmt.Println(x, y)

}



//多个同类型的参数，可省略前面的类型
func testSum(x int, y int)int{

	ret := x + y

	return ret

}
```

## B1.返回值
```go
// 多个返回值，也支持参数简写
func calc(a, b int)(sum, sub int){

	sum = a + b

	sub = a - b

	return
}


//如不需要第二参数,直接使用下划线来占位
i, _ := div(11, 3)
```

## B2:多个返回值使用实例
```go
//利用golang中可以返回多个值的特性来直接将a b两个值相反返回,然后再让调用函数中的a ,b两个变量接收.
func swapByReturn(a,b int) (c,d int)  {
    return b,a
}
 
func main() {
    a, b := 1, 2
 
    a, b = swapByReturn(a, b)
 
    fmt.Println(a, b)
}
```



## 可变参数函数
```go
/**
在写函数得过程中,发现golang是没有函数重载,没有默认参数,可选参数这些东西
只有一个 就是可变参数 既...三个点代表
*/
func addAll(sum ...int) int {
 
    s := 0
    for e := range sum {
        s += sum[e]
    }
 
    return s
}
```

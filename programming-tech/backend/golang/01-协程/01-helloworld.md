## hello world
```go
func init() {
	fmt.Println("init====>")
	// 协程test
	fmt.Println("开启协程：")
	go say("world")
	say("hello")
}

func say(s string) {
	fmt.Println("执行")
	for i := 0; i < 5; i++ {
		time.Sleep(10)
		fmt.Println(s)
	}
}
```

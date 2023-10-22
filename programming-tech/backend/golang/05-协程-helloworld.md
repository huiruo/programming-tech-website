## 协程
在 Go 编程语言中，协程（Goroutine）是一种轻量级线程的概念，用于并发执行任务。协程是 Go 语言并发模型的核心组成部分，它允许你在你的程序中同时执行多个任务，而无需手动管理线程或进程。
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

协程的特点：
* 协程是轻量级的，创建和销毁协程的开销很小。
* Go 语言提供了内置的并发支持，使协程易于创建和管理。
* 协程之间可以通过通道（Channels）进行通信，实现数据传递和同步。
* Go 语言的运行时（runtime）会自动管理协程的调度。
* 协程不需要显式的锁或互斥量来进行同步，因为 Go 的并发模型是基于通信的。
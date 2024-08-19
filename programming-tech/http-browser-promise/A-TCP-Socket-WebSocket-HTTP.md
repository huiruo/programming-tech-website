## TCP、Socket、WebSocket、HTTP
https://zhuanlan.zhihu.com/p/51279572

WebSocket和Http的异同点

同：
1. 建立在TCP之上，通过TCP协议来传输数据。
2. 都是可靠性传输协议。
3. 都是应用层协议。
异：
1. WebSocket是HTML5中的协议，支持持久连接，HTTP不支持持久连接
2. HTTP是单向协议，只能由客户端发起，做不到服务器主动向客户端推送信息。

WebSocket和Socket

1. Socket本身并不是一个协议，它工作在OSI模型会话层，是一个套接字，TCP/IP网络的API，是为了方便大家直接使用更底层协议而存在的一个抽象层。Socket其实就是一个门面模式，它把复杂的TCP/IP协议族隐藏在Socket接口后面，对用户来说，一组简单的接口就是全部，让Socket去组织数据，以符合指定的协议。而WebSocket则是一个典型的应用层协议。

### Socket和TCP/IP
* Socket是对TCP/IP协议的封装，像创建Socket连接时，可以指定使用的传输层协议，Socket可以支持不同的传输层协议(TCP或UDP),当使用TCP协议进行连接时，该Socket连接就是一个TCP连接。

WebSocket HTTP和TCP/IP
* WebSocket和HTTP一样，都是建立在TCP之上，通过TCP来传输数据。
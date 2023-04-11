# 扩展从输入URL到页面展示，发生了什么？
 1、首先从本地查找域名，有的话直接用hosts文件里的ip地址，否则查询DNS，得到ip地址
 2、建立TCP连接——进行“三次握手”
 3、客户端发送http请求
 4、服务端处理，并返回结果给客户端
 5、关闭TCP连接——需要“四次挥手”
 6、浏览器收到结果，开始解析资源（JS、CSS、HTML），解析HTML生成的dom树，和同时解析css生成的cssom树结合生成渲染树
 7、根据渲染树渲染页面

# 请求报文
```
请求行:包含请求方法，请求uri,http版本
状态行:响应结果的状态码
首部字段:包含请求和响应的各种条件和属性的各类首部

分为4中首部：
1.通用首部：请求报文和响应报文都会使用的头部
2.请求首部：补充请求的附加内容，客户端信息，响应内容相关优先级等信息
3.响应首部:补充响应的附加内容，也会要求客户端附加额外的内容信息
4.实体首部:针对实体部分使用的首部，补充了资源更新时间等与实体有关的信息
```
# 响应报文
# http首部字段
http首部字段是构成http报文的要素之一。无论请求还是响应都会用到首部字段。
## 1.通用首部
```text
Cache-Control 控制缓存的行为，例如Cache-Control:private,max-age=0,no-cache。
	Cache-Control: private 表示仅向特定用户返回响应。对于其他用户发送过来的请求则不会返回缓存。
	Cache-Control: no-cache 强制向源服务器再次验证。
	Cache-Control: max-age = [秒] 表示响应的最大Age值。

Connection 逐跳首部、连接的管理
	Connection: keep-alive，建立持久连接,默认
	Connection: close，服务器欲断开连接
Date 创建报文的日期时间，有以下两种格式
	Date:Tue, 05 Jul 2016 12:43:35 GMT
	Date:Tue Jul 05 12:43:35 2016
Pragma 报文指令
	Pragma:no-cache。客户端要求所有的中间服务器不返回缓存资源，这个字段只是为了兼容http/1.0版本的服务器，希望服务器不缓存的话，还会加上Cache-Control: no-cache，两个字段一起使用。
Trailer 报文末端的首部一览
	Trailer: Expires，Trailer会事先说明在报文主体后纪录了哪些首部字段，用于HTTP/1.1版本分块传输编码时。
	Transfer-Encoding 指定报文主体的传输编码方式
Transfer-Encoding: chunked。此传输编码方式仅用于分块传输编码时。
Upgrade 升级为其他协议，用于检测HTTP或其他协议能否使用更高的版本进行通信。
Via 代理服务器的相关信息
Warning 错误通知
```
## 2.请求首部
从客户端向服务器端发送请求报文时使用的首部，补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。
```text
Accept 用户代理可处理的媒体类型
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8。希望服务器返回的资源格式是html或xhtml+xml格式的，如果不能达成则可以返回任意格式。当服务器提供多种内容时，将会返回q（权重值，范围是0～1）最高的媒体类型。

Accept-Charset 优先的字符集
	Accept-Charset: iso-8859-5, unicode-1-1;q=0.8。通知服务器用户所支持的字符集以及字符集的相对优先顺序，若一次性指定多种字符集，那么按权重q来表示优先级。

Accept-Encoding 优先的内容编码
	Accept-Encoding:gzip, deflate, sdch。也可以使用星号作为通配符，指定任意的编码格式。

Accept-Language 优先的语言（自然语言）
	Accept-Language:zh-CN,zh;q=0.8,en;q=0.6。告知服务器用户代理能处理的自然语言集，以及自然语言集的相对优先级。可一次指定多种自然语言集，按权重q来表示相对优先级，

Authorization 认证信息
	Authorization: Basic dWVub3NlbjpwYXNzd29yZA==。告知服务器用户代理的认证信息（证书）。服务器会先发送401状态吗响应，客户端接收后把首部字段Authorization加入请求进行认证。

Expect 期待服务器的特定行为
	Expect: 100-continue。告知服务器，期望出现的某种特定行为。因服务器无法理解客户端的期望作出回应而发生错误时，会返回状态码417 Expectation Failed。
From 用户的电子邮箱地址
	From: xxxx@163.com。告知服务器使用用户代理的用户的电子邮件地址。

Host 请求资源所在服务器
	Host:shop.prepub.souche.com。告知服务器请求的资源所处的主机名和端口号。此请求头是HTTP/1.1规范里唯一一个必须存在请求内的。

Origin 用来说明请求从哪里发起的，包括，且仅仅包括协议和域名。
这个参数一般只存在于CORS跨域请求中，可以看到response有对应的header：Access-Control-Allow-Origin

Referer 告知服务器请求的原始资源的URI，其用于所有类型的请求，并且包括：协议+域名+查询参数（注意，不包含锚点信息）

If-Match 比较实体标记（ETag）
	If-Match: "123456"。附带条件当此值与所请求资源的ETag（实体标记）值匹配一致时，服务器才会接收请求，反之服务器返回412 Precondition Failed。此值设为星号通配符则会被服务器忽略此附带条件。

If-Modified-Since 比较资源的更新时间
	If-Modified-since: Tue, 05 Jul 2016 12:43:35 GMT。如果资源是在If-Modified-since字段指定的日期时间后发生了更新，则服务器接收此请求，否则返回304 Not Modified。

If-None-Match 比较实体标记（与If-Match相反）
与If-Match的作用相反。

If-Range 资源未更新时发送实体Byte的范围请求
首部字段If-Range属于附带条件之一。它告知服务器若指定的If-Range字段值（ETag值或者时间）和请求资源的ETag值或时间相一致时，则作为范围请求处理。反之，则返回全体资源。

If-Unmodified-Since 比较资源的更新时间（与If-Modified-Since"相反）

Max-Forwards 最大传输逐跳数

Max-Forwards: 2。请求往下可以转发两次，每转发一次Max-Forwards值减1，直到某台服务器接收到Max-Forwards为0的请求后返回响应。

Proxy-Authorization 代理服务器要求客户端的认证信息

Range 实体的字节范围请求

TE 传输编码的优先级

User-Agent HTTP客户端程序的信息
```

## 3.响应首部字段:从服务器端向客户端返回响应报文时使用的首部，补充了响应的附加内容，也会要求客户端附加额外的内容信息。
```
Accept-Ranges 是否接受字节范围请求。当可处理范围请求时值为bytes，反之则指定其为none。

Age 推算资源创建经过时间

ETag 资源的匹配信息

Location:客户端重定向至指定URI，该字段配合3xx的状态码响应，几乎所有的浏览器接收到包含首部字段的location响应后，都会强制性尝试对重定向资源的访问。
Proxy-Authenticate 代理服务器对客户端的认证信息

Retry-After 对再次发起请求的时机要求，主要配合503和3xx状态码，字段值可以是指定的具体日期时间，也可以是创建响应后的秒数。

Server HTTP服务器的安装信息

Server：Apache/2.2.17(Unix) PHP/5.2.5。告知客户端当前服务器上安装的HTTP服务器应用程序的信息。

Vary 代理服务器缓存的管理信息

WWW-Authenticate 服务器对客户端的认证信息

Access-Control-Allow-Origin:标识允许哪个域的请求。
```
## 4.针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息。
```
Allow 资源可支持的HTTP方法
	Allow：GET，HEAD。

Content-Encoding 实体主体适用的编码方式
	Content-Encoding：gzip。告知客户端，服务器会对实体的主体部分选用的内容编码方式。

Content-Language 实体主体的自然语言

Content-Length 实体主体的大小（单位：字节）

Content-Location 替代对应资源的URI

Content-MD5 一个由md5算法获得的128位二进制数，在通过base64编码。目的检查报文主题在传输过程中是否保持完整，以及确认传输到达。

Content-Range 实体主体的位置范围

Content-Type 实体主体的媒体类型
	Content-Type: text/html; charset=UTF-8

Expires 实体主体过期的日期时间，控制资源缓存的时间。如果不希望缓存，最好在Expires字段内写入与首部字段Date相同的时间值。

Last-Modified 资源的最后修改日期时间
```

## 5.非 HTTP/1.1 首部字段
在 HTTP 协议通信交互中使用到的首部字段，不限于 RFC2616 中定义的 47 种首部字段。还有 Cookie、Set-Cookie 和 Content-Disposition等在其他 RFC 中定义的首部字段，它们的使用频率也很高。

## End-to-end 首部和 Hop-by-hop 首部
HTTP 首部字段将定义成缓存代理和非缓存代理的行为，分成 2 种类型。
端到端首部（End-to-end Header）
分在此类别中的首部会转发给请求 / 响应对应的最终接收目标，且必须保存在由缓存生成的响应中，另外规定它必须被转发。
## 逐跳首部（Hop-by-hop Header）
分在此类别中的首部只对单次转发有效，会因通过缓存或代理而不再转发。HTTP/1.1 和之后版本中，如果要使用 hop-by-hop 首部，需提供 Connection 首部字段。
下面列举了 HTTP/1.1 中的逐跳首部字段。除这 8 个首部字段之外，
其他所有字段都属于端到端首部。
```
Connection
Keep-Alive
Proxy-Authenticate
Proxy-Authorization
Trailer
TE
Transfer-Encoding
Upgrade
```

## 6.为Cookie服务的首部字段
Set-Cookie   开始状态管理所使用的Cookie信息 响应首部字段
Cookie       服务器接收到的Cookie信息      请求首部字段

## 6.1.Set-Cookie字段的属性
```
NAME=VALUE   赋予Cookie的名称和其值（必需项）
expires=DATE  Cookie的有效期（若不明确指定则默认为浏览器关闭前为止）
path=PATH     将服务器上的文件目录作为Cookie的适用对象（若不指定则默认为文档所在的文件目录）
domain=域名	作为Cookie适用对象的域名（若不指定则默认为创建Cookie的服务器的域名）
Secure   仅在HTTPS完全通信时才会发送Cookie
HttpOnly  加以限制，使Cookie不能被JavaScript脚本访问
```

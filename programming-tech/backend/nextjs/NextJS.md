---
title: NextJS
sidebar_position: 1
---

## NextJS
NextJs 是一个构建 React 应用的框架。

开箱即用，它为您提供服务器端渲染、静态站点生成、无服务器功能等等。

它是一个工具箱，为您提供创建高性能web应用程序所需的一切。

create-react-app，直接 yarn build 完成后，将 build 目录下的 index.html 作为入口文件，再通过 nginx 的路径去访问我们的项目。

Next.js 的 dockerFile 格式是和 Node.js 服务的格式是类似的，那么本质上，Next.js 其实就是一个 Node 后端服务，所以运行生产环境时，访问yarn start打开的端口来访问我们的应用。

### 使用NextJS的优势
1. 快速,由于服务器端渲染和静态站点生成,对于使用较慢设备的用户，这可能导致更快的加载时间。<br/>
使用 nodejs 在服务器端完成页面的渲染,浏览器请求 URL，根据不同的路由，向服务器请求不同的数据，然后服务器拼接一个携带了数据的html字符串，返回给浏览器。同时浏览器执行js脚本，给页面的元素绑定对应的事件，使页面可以进行交互。

2. 易于部署

3. 当搜索引擎优化
在创建电子商务网站时，搜索引擎优化比以往任何时候都更加重要。

## 区别
Next.js中的四种渲染方法：CSR、SSR、SSG和ISG。每种方法都适用于不同的情况。CSR适用于需要新数据的页面。SSR适用于使用动态数据的页面，但它对SEO较为友好。


SSR和CSR的区别在于:
* 在SSR中，从服务器上的每个页面请求获取数据；
* CSR中，从客户端获取数据。

SSG和ISG从性能和SEO方面来说都很出色，因为数据预获取，用户还可以缓存数据。
* SSG适合数据基本上静态的页面
* ISG最适合含有用户想要间隔更新的数据的页面。

## 1.配置服务端渲染`getServerSideProps`-SSR
https://nextjs.org/docs/app/building-your-application/rendering/server-components

>页面要使用服务器端渲染，需要导出一个名为 getServerSideProps 的异步函数。假设页面需要预渲染频繁更新的数据（从外部API获取），可以编写 getServerSideProps，它获取这些数据并将其传递给 Page。

>getServerSideProps与getStaticProps不同之处。getStaticProps是在构建时执行的，因此在每个请求期间都不会重新执行。这意味着在使用getStaticProps时，每个请求都将使用相同的预先获取的数据。
```js
// 使用 getServerSideProps
export async function getServerSideProps(context) {
  // 在这里获取服务器端数据
  return {
    props: {
      data: // 数据
    }
  };
}
```

## 2.配置客服端渲染-CSR
https://nextjs.org/docs/app/building-your-application/rendering/client-components

在 Next.js 中，默认情况下，如果你没有导出 getServerSideProps 函数或 getServerSideProps 返回 null，页面将采用客户端渲染 (Client-Side Rendering, CSR)。这是因为 Next.js 支持默认的客户端渲染，而无需显式导出 getServerSideProps。

当用户需要频繁更新数据或不想预渲染页面时，应该使用客户端渲染（CSR）。用户可以在页面层面或组件层面实现CSR。在页面层面，Next.js在运行时获取数据；而在组件层面执行操作时，它在页面挂载时获取数据。正因为如此，CSR可能导致性能变慢。


## 3.静态站点生成-SSG
在Next.js中，用户必须从想要静态渲染的页面中导出 getStaticProps函数。
```js
export default function Home({ data }) {
  return (
    <main>
      // Use data
    </main>
  );
}
export async function getStaticProps() {
  // Fetch data from external API at build time
  const res = await fetch('https://.../data') 
  const data = await res.json()
  // Will be passed to the page component as props
 return { props: { data } }
}
```

在Next.js 13中，静态渲染是默认操作，内容被获取和缓存，除非用户关闭了缓存选项。
```js
async function getData() {
  const res = await fetch('https://.../data');
  return res.json();
}
export default async function Home() {
  const data = await getData();
  return (
    <main>
      // Use data
    </main>
  );
}
```

## 4.增量静态生成-ISG
有时用户想使用SSG，但又想定期更新内容，这时候增量静态生成（ISG）大有帮助。

ISG让用户可以在构建静态页面后在指定的时间间隔后创建或更新静态页面。这样一来，用户不需要重建整个站点，只需重建需要它的页面。

ISG保留了SSG的优点，又增加了为用户提供最新内容的好处。ISG非常适合站点上那些使用不断变化的数据的页面。比如说，用户可以使用ISR渲染博文，以便在编辑文章或添加新文章后博客保持更新。

若要使用ISR，将revalidate属性添加到页面上的getStaticProps函数中。
```js
export async function getStaticProps() {
  const res = await fetch('https://.../data')
  const data = await res.json()
  return {
    props: {
      data,
    },
    // 在这里，当请求在60秒后到来时，Next.js将尝试重新构建页面。下一个请求将产生带有更新页面的响应。
    revalidate: 60
  }
}
```


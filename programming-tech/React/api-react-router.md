## router和context组件级的数据共享
如果组件的功能不能单靠组件自身来完成，还需要依赖额外的子组件，那么可以利用`Context`构建一个由多个子组件组合的组件。例如，react-router。

react-router的`<Router />`自身并不能独立完成路由的操作和管理，因为导航链接和跳转的内容通常是分离的，因此还需要依赖`<Link />`和`<Route />`等子组件来一同完成路由的相关工作。为了让相关的子组件一同发挥作用，react-router的实现方案是利用`Context`在`<Router />`、`<Link />`以及`<Route />`这些相关的组件之间共享一个`router`，进而完成路由的统一操作和管理。

下面截取`<Router />`、`<Link />`以及`<Route />`这些相关的组件部分源码，以便更好的理解上述所说的。

通过代码的分析，可以看出，整个react-router其实就是围绕着`<Router />`的`Context`来构建的。

总结：
* 相比`props`和`state`，React的`Context`可以实现跨层级的组件通信。

* Context API的使用基于生产者消费者模式。生产者一方，通过组件静态属性`childContextTypes`声明，然后通过实例方法`getChildContext()`创建`Context`对象。消费者一方，通过组件静态属性`contextTypes`申请要用到的`Context`属性，然后通过实例的`context`访问`Context`的属性。

* 使用`Context`需要多一些思考，不建议在App中使用`Context`，但如果开发组件过程中可以确保组件的内聚性，可控可维护，不破坏组件树的依赖关系，影响范围小，可以考虑使用`Context`解决一些问题。

* 通过`Context`暴露API或许在一定程度上给解决一些问题带来便利，但个人认为不是一个很好的实践，需要慎重。

* 旧版本的`Context`的更新需要依赖`setState()`，是不可靠的，不过这个问题在新版的API中得以解决。

* 可以把`Context`当做组件的作用域来看待，但是需要关注`Context`的可控性和影响范围，使用之前，先分析是否真的有必要使用，避免过度使用所带来的一些副作用。

* 可以把`Context`当做媒介，进行App级或者组件级的数据共享。

* 设计开发一个组件，如果这个组件需要多个组件关联组合的，使用`Context`或许可以更加优雅。

## 传参方式
1. params传参:路由表配置：参数地址栏显示;动态路由,推荐使用

2. search传参：会暴露在url中，刷新页面不会消失，但取数据时，需处理

3. query传参:参数地址栏不显示，刷新地址栏，参数丢失,类似于表单中的get方法，传递参数为明文

4. state传参,类似于post方式，使用方式和query类似
```
state传参：BrowserRouter(history)模式下，刷新页面不消失；

而HashRouter(hash)模式下，刷新页面会消失，但都不会暴露在url中
```

## router v6 
### 1.移除了之前的withRouter，路由组件使用hooks订阅history
```js
import { useNavigate } from 'react-router-dom';

function App(props: any) {
  let navigate = useNavigate();

  const onRouter = (type: string) => {
    console.log('onRouter')
    navigate(`${type}`)
  }

  return (
    <div className="container">
      <div>
        <button onClick={() => onRouter('redux')}>ReduxPage</button>
      </div>
    </div>
  );
}

export default App;
```

### 2.useRoutes api实现动态路由更加方便
```js
const RoutesContainer = () => {
	const GetRoutes = () => {
		const routes = useRoutes(routesConfig);
		return routes
	}

	return (
		<HashRouter>
			<GetRoutes />
		</HashRouter>
	);

};
```

### 3.Switch重命名为Routes
```js
// v5
<Switch>
    <Route exact path="/"><Home /></Route>
    <Route path="/profile"><Profile /></Route>
</Switch>

// v6
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="profile/*" element={<Profile />} />
</Routes>
```

### 4.Route 的新特性变更,component/render被element替代
```js
import Profile from './Profile';

// v5
<Route path=":userId" component={Profile} />
<Route
  path=":userId"
  render={routeProps => (
    <Profile routeProps={routeProps} animate={true} />
  )}
/>

// v6
<Route path=":userId" element={<Profile />} />
<Route path=":userId" element={<Profile animate={true} />} />
```

### 4.history 的用法也将被替换成navigate

```js
// v5
history.push('/home');
history.replace('/home');

// v6
navigate('/home');
navigate('/home', { replace: true });
```

### 遇到的问题
Module '"react-router-dom"' has no exported member 'withRouter'.

react-router-dom v6 版本中的 withRouter 和 Switch 已过时，可以退回到 v5 版本继续使用，或者使用 useNavigate()替代 withRouter，使用 Routes 替代 Switch。
例如：

const navigate = useNavigate()
navigate('/test') // 跳转到/test
navigate(-1) // 返回上一级
navigate(0, {replace: true})// 强制刷新当前页面并不加入路由历史

```js
So basically instead of having something like
...
function handleClick() {
  history.push("/home");
}
...
use something like:

// This is a React Router v6 app
import { useNavigate } from "react-router-dom";
function App() {
  let navigate = useNavigate();
  function handleClick() {
    navigate("/home");
  }
  ...
```

### Redirect 也没法使用

新版的路由需要引入 Navigate 标签，以下是案例
```js
<Router>
  <Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/admin' element={<Admin />} />
    <Route path='*' element={<Navigate to='/login' />} />
  </Routes>
</Router>;
这样就可以完美替代之前Redirect的重定向操作;
```

或则：
废弃了 V5 中的 Redirect

```js
// v5 废弃了
const routers = [{ path: 'home', redirectTo: '/' }];

// 404可以这么写
const routers = [
  {
    name: '404',
    path: '*',
    element: <NoMatch />,
  },
];
```

### React Router v6 exact
```js
<Route exact>消失了。相反，具有后代路由（在其他组件中定义）的路由在其路径中使用一个尾随*符号来指示它们精确匹配。
```

```
react router v6 doesn't support exact anymore.

// old - v5 <Route exact path="/" component={Home} />

// new - v6 <Route path="/" element={<Home />} />

As stated in their documentation:

You don't need to use an exact prop on <Route path="/"> anymore. This is because all paths match exactly by default. If you want to match more of the URL because you have child routes use a trailing * as in <Route path="users/*">.
```

### 嵌套路由变得更简单
v5 中的嵌套路由必须非常明确定义，且要求在这些组件中包含许多字符串匹配逻辑.

具体变化有以下：
1. Route children 已更改为接受子路由。 
2. 比 Route exact 和 Route strict 更简单的匹配规则。
3. Route path 路径层次更清晰。
```js
// v5
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/profile' component={Profile} />
      </Switch>
    </BrowserRouter>
  );
}

function Profile() {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <nav>
        <Link to={`${url}/me`}>My Profile</Link>
      </nav>

      <Switch>
        <Route path={`${path}/me`}>
          <MyProfile />
        </Route>
        <Route path={`${path}/:id`}>
          <OthersProfile />
        </Route>
      </Switch>
    </div>
  );
}
```

v6 中，你可以删除字符串匹配逻辑。不需要任何 useRouteMatch()

```js
// v6
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='profile/*' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

function Profile() {
  return (
    <div>
      <nav>
        <Link to='me'>My Profile</Link>
      </nav>

      <Routes>
        <Route path='me' element={<MyProfile />} />
        <Route path=':id' element={<OthersProfile />} />
      </Routes>
    </div>
  );
}
```

```js
		// <HashRouter>
		<BrowserRouter>
			<Routes>
				{/* {routesConfig.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)} */}
				{/* <Route element={NotFound} /> */}
				{/* <Route path="/" element={<Home />} > */}
				<Route path="/">
					{/* <Route path="moments" element={<Moments />} /> */}
					<Route path="*" element={<NotFound />} />
				</Route>
				<Route path="/moments" element={<Moments />} />
			</Routes>
		{/* </HashRouter> */}
```

### 实现来回导航(使用 go、goBack、goForward)
实现来回导航(使用 go、goBack、goForward)
```js
import { useHistory } from 'react-router-dom';

function App() {
  const { go, goBack, goForward } = useHistory();

  return (
    <>
      <button onClick={() => go(-2)}>Go 2 pages back</button>
      <button onClick={goBack}>Go back</button>
      <button onClick={goForward}>Go forward</button>
      <button onClick={() => go(2)}>Go 2 pages forward</button>
    </>
  );
}
```

### 获取当前路由
```js
import { NavLink,useLocation } from "react-router-dom";
import './index.scss'

const Header =()=>{
  const { pathname } = useLocation()
  ...
}
```

## v6传参
### 1.params参数
需要在Route上显示写明 :params
```js
<BrowserRouter>
  <Routes>
      <Route path={'/class/:id/:grade'} element={<ToPage/>} />
  </Routes>
</BrowserRouter>
```

```js
import { useNavigate } from "react-router-dom";
const goTo = () => {
    navigate(`/class/${id}/${grade}`)
}

import { useParams } from "react-router-dom";

const ToPages = () => {
  const { id, grade } = useParams();
  return (<h1>id : {id}, grade : {grade}</h1>)}
}
```

```js
import { useNavigate } from "react-router-dom";
let navigate = useNavigate();
function navigateToDetail(id){
    navigate(`detail/${id}`)
}
```

### 接收
在detail页面需要使用useParams接收路由params参数
```js
import {useParams} from "react-router-dom";
const {id} = useParams();
```


## 2.search参数
如果传递的是search参数（例如：detail?id=1&name=李四）需要使用useSearchParams获取search参数

```js
import {useSearchParams} from "react-router-dom"
const [searchParams] = useSearchParams();
const id = searchParams.get("id");
```

1.直接拼接
```js
const Pages = () => {
  const navigate = useNavigate();
  const id = "1";
  const grade = "2";
  const goTo = () => {
      navigate(`/class?id=${id}&grade=${grade}`)
  }
}
```

1.2 pathname + 拼接search
```js
const Pages = () => {
  const navigate = useNavigate();
  const id = "1";
  const grade = "2";
  const goTo = () => {
      navigate({
        pathname: "/class",
        search: `?id=${id}&grade=${grade}`
    })
  }
}
```

1.3 pathname + 创建search (推荐)
```js
const Pages = () => {
  const navigate = useNavigate();
  const params = { id: '1', grade: '2' };
  const goTo = () => {
      navigate({
        pathname: "/class",
        search: `?${createSearchParams(params)}`
    })
  }
}
```

### search接收
```js
import { useSearchParams } from "react-router-dom";

const ToPages = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const grade = searchParams.get("grade");
  return (<h1>id : {id}, grade : {grade}</h1>)}
}
```

### 3.state 传参
如果传递的是state参数需要使用useLocation获取参数

```js
import { useNavigate } from "react-router-dom";
const goTo = () => {
  navigate(`/class`, { state: {id, grade} } )
}

import {useLocation} from "react-router-dom";
const location = useLocation();
const {id} = location.state;
```

## 源码
### Router.js
尽管源码还有其他的逻辑，但<Router />的核心就是为子组件提供一个带有router属性的Context，同时监听history，一旦history发生变化，便通过setState()触发组件重新渲染。
```js
/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  static contextTypes = {
    router: PropTypes.object
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        ...this.context.router,
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      }
    };
  }
  
  // ......
  
  componentWillMount() {
    const { children, history } = this.props;
    
    // ......
    
    this.unlisten = history.listen(() => {
      this.setState({
        match: this.computeMatch(history.location.pathname)
      });
    });
  }

  // ......
}
```

### Link.js
`<Link />`的核心就是渲染`<a>`标签，拦截`<a>`标签的点击事件，然后通过`<Router />`共享的`router`对`history`进行路由操作，进而通知`<Router />`重新渲染。
```js
/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
  
  // ......
  
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleClick = event => {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !this.props.target &&
      !isModifiedEvent(event)
    ) {
      event.preventDefault();
      // 使用<Router />组件提供的router实例
      const { history } = this.context.router;
      const { replace, to } = this.props;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };
  
  render() {
    const { replace, to, innerRef, ...props } = this.props;

    // ...

    const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;

    const href = history.createHref(location);
    return (
      <a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
    );
  }
}
```

### Route.js
`<Route />`有一部分源码与`<Router />`相似，可以实现路由的嵌套，但其核心是通过`Context`共享的`router`，判断是否匹配当前路由的路径，然后渲染组件。
```js
class Route extends React.Component {
  
  // ......
  
  state = {
    match: this.computeMatch(this.props, this.context.router)
  };

  // 计算匹配的路径，匹配的话，会返回一个匹配对象，否则返回null
  computeMatch(
    { computedMatch, location, path, strict, exact, sensitive },
    router
  ) {
    if (computedMatch) return computedMatch;
    
    // ......

    const { route } = router;
    const pathname = (location || route.location).pathname;
    
    return matchPath(pathname, { path, strict, exact, sensitive }, route.match);
  }
 
  // ......

  render() {
    const { match } = this.state;
    const { children, component, render } = this.props;
    const { history, route, staticContext } = this.context.router;
    const location = this.props.location || route.location;
    const props = { match, location, history, staticContext };

    if (component) return match ? React.createElement(component, props) : null;

    if (render) return match ? render(props) : null;

    if (typeof children === "function") return children(props);

    if (children && !isEmptyChildren(children))
      return React.Children.only(children);

    return null;
  }
}
```

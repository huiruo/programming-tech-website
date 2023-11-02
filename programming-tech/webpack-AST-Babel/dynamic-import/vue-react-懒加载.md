# （懒加载）实现
## react
```
https://legacy.reactjs.org/docs/code-splitting.html
```

Route-based code splitting
```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```


## Vue
```
https://vuedose.tips/dynamic-imports-in-vue-js-for-better-performance
```

```js
// Instead of a usual import
import MyComponent from "~/components/MyComponent.js";

// do this
const MyComponent = () => import("~/components/MyComponent.js");
```
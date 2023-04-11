import React, { Suspense } from "react";
import NavList from "../NavList/index.jsx";
import routerConfig from "../../route/index.js";
import { useRoutes } from "react-router-dom";

export default function AppPage() {
  return (
    <div>
      <NavList />
      <Suspense fallback={<div>加载中。。。</div>}>
        {useRoutes(routerConfig)}
      </Suspense>
    </div>
  );
}

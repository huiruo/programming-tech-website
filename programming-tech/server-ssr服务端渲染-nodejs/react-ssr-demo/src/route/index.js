import React from "react";
import Header from "../page/Header/index.jsx";
import Footer from "../page/Footer/index.jsx";
import User from "../page/User/index.jsx";
const routerConfig = [
  {
    path: "/",
    element: <Header />,
    index: true,
  },
  {
    path: "/footer",
    element: <Footer />,
  },
  {
    path: "/user",
    element: <User />,
  },
];

export default routerConfig;

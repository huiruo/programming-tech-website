import React from "react";
import AppPage from "./src/page/AppPage/index.jsx";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");
const element = (
  <BrowserRouter>
    <AppPage />
  </BrowserRouter>
);
hydrateRoot(root, element);

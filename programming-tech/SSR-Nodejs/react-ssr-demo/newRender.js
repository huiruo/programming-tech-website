import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import AppPage from "./src/page/AppPage/index.jsx";
import { StaticRouter } from "react-router-dom/server";

function newRender(req, res, assets) {
  const { pipe } = renderToPipeableStream(
    <StaticRouter location={req.url}>
      <AppPage />
    </StaticRouter>,
    {
      bootstrapScripts: [assets["main.js"]],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ssr</title>
      </head>
      <body>
        <div id="root">`);
        pipe(res);
        res.write(`</div>
    </body>
    </html>`);
      },
    }
  );
}

module.exports = newRender;

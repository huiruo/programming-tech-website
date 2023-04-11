import React from "react";
import App from "./src/page/AppPage";
import { renderToString } from "react-dom/server";

function render(req, res, assets) {
  const html = renderToString(<App />);
  console.log('html:', html);
  res.statusCode = "200";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ssr</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script src="${assets["main.js"]}"></script>
    </body>
    </html>`
  );
}

module.exports = render;

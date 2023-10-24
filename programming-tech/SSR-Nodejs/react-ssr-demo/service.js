const register = require("@babel/register");
register({
  ignore: [/node_modules/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
});
const express = require("express");
const static = require('serve-static');
const webpack = require("webpack");
const newRender = require("./newRender");
const webpackConfig = require("./webpack.config");

webpack(webpackConfig, (error, status) => {
  const statusJson = status.toJson({ assets: true });
  const assets = statusJson.assets.reduce((item, { name }) => {
    item[name] = `/${name}`;
    return item;
  }, {});

  const app = express();
  app.get("/", (req, res) => {
    // app.get("*", (req, res) => {
    console.log('req:', req.path);
    newRender(req, res, assets);
  });

  app.use(static('build'));

  app.listen(8200, () => {
    console.log("http://localhost:8200");
  });
});

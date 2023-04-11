const path = require("path");

module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: "./index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
};

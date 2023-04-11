// vue.config.js
const path = require("path");

function resolve(dir) {
  console.log(path); 
  //path大对象，里面有很多方法
  console.log(dir);
  //src/components/icon/svg
  console.log(path.join(__dirname, dir));
  //C:\Users\yang\Desktop\WORK\CePing-dl\src\components\icon\svg
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "/",

  // 将构建好的文件输出到哪里
  outputDir: "dist",

  // 放置生成的静态资源(js、css、img、fonts)的目录。
  assetsDir: "static",

  // 指定生成的 index.html 的输出路径
  indexPath: "index.html",

  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  runtimeCompiler: false,

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],

  // 生产环境关闭 source map
  productionSourceMap: false,
//设置为 true 或 'warning' 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
  // lintOnSave: true,

  // 配置css
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    sourceMap: true,
    // css预设器配置项,移动端常用
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px2rem")({
            remUnit: 100
          })
        ]
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },

  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  //函数写法
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"));

    config.optimization.minimizer("terser").tap(args => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.exclude.add(/node_modules/);
    svgRule
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });

    const imagesRule = config.module.rule("images");
    imagesRule.exclude.add(resolve("src/components/icon/svg"));
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  },
//对象的配置的写法（和函数写法二选一）
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       "@": resolve("src"),
  //       'assets': resolve('src/assets')
  //     }
  //   }
  // }
  configureWebpack: config => {
    /*有插件就在这里配置
    config.plugins.push(xxx);
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(xxx);
    }
    */
    //这里可以修改打包提示文件过大的配置
   // if (process.env.NODE_ENV === "production") {
  //     // 为生产环境修改配置...
  //     config.mode = "production";
  //     config["performance"] = {
  //       //打包文件大小配置
  //       maxEntrypointSize: 10000000,
  //       maxAssetSize: 30000000,
  //     };
  //   }
  },
  performance: { hints: false }, //关闭打包提示文件过大的警告
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require("os").cpus().length > 1,

  devServer: {
    host: "0.0.0.0",
    port: 8088, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌

    // 配置多个代理
    proxy: {
      "/api": {
        target: "http://xxx",
        // ws: true, // 代理的WebSockets
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          "^/api": "/api"
        }
      },
      "/api2": {
        target: "http://xxx/",
        // ws: true, // 代理的WebSockets
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          "^/api2": "/api"
        }
      },
      "/api3": {
        target: "http://dceccn.com:8888/",
        // ws: true, // 代理的WebSockets
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          "^/api3": "/api"
        }
      }
    }
  }
};

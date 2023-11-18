/*
 * @Description:
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-11 14:02:02
 */
const { defineConfig } = require("@vue/cli-service");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  chainWebpack(config) {
    // 设置 svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  transpileDependencies: true,
  devServer: {
    // port: 8080,
    proxy: {
      "/ixdpc": {
        target: "https://6x54604q10.zicp.fun", //反向代理地址 开发
        // target: "http://121.36.73.70:18085", //反向代理地址 外网
        // target: "http://localhost:18085", //反向代理地址  内网
        changeOrigin: true,
        pathRewrite: {
          "^/ixdpc": "",
        },
      },
    },
  },
  outputDir: "dist", //打包文件名称
});

// const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   publicPath: "./",
//   outputDir: "dist", //打包文件名称
//   transpileDependencies: true,
//   devServer: {
//     // port: 8080,
//     proxy: {
//       "/api": {
//         target: "https://6x54604q10.zicp.fun", //反向代理地址
//         changeOrigin: true,
//         pathRewrite: {
//           "^/api": "",
//         },
//       },
//     },
//   },
//   chainWebpack: (config) => {
//     config.plugin("html").tap((args) => {
//       args[0].title = "XXXX";//系统标题
//       return args;
//     });
//   },
// });

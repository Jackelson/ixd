const { defineConfig } = require('@vue/cli-service')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  chainWebpack(config) {
    // 设置 svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  transpileDependencies: true,
	devServer: {
    // port: 8080,
    proxy: {
      "/api": {
        target: "https://6x54604q10.zicp.fun", //反向代理地址
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  outputDir: "dist", //打包文件名称

})


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


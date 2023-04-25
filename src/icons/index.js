import SvgIcon from '@/components/SvgIcon'
// 1. 导入所有的 svg 图标
// require.context 帮助文档：https://webpack.docschina.org/guides/dependency-management/#requirecontext

// 你还可以通过 require.context() 函数来创建自己的 context。

// 可以给这个函数传入三个参数：一个要搜索的目录，一个标记表示是否还搜索其子目录， 以及一个匹配文件的正则表达式。

// 1.1. 此时返回一个 require 的函数，可以接受一个 request 的参数，用于 require 的导入。
const svgRequire = require.context('./svg', false, /\.svg$/)
// 1.2. 该函数提供了三个属性，可以通过 require.keys() 获取到所有的 svg 图标
console.log(svgRequire.keys())
svgRequire.keys().forEach((svgIcon) => {
  // 1.3. 遍历图标，把图标作为 request 传入到 require 导入函数中，完成本地 svg 图标的导入
  svgRequire(svgIcon)
})
// 2. 完成 SvgIcon 的全局注册
export default (app) => {
  app.component('svg-icon', SvgIcon)
}
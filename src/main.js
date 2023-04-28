import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 新增路由监听
import './router/intRouter';
import store from './store'
import './styles/common.scss'
// 导入 svgIcon
import installIcons from '@/icons'
// 引入element
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import axios from "axios";

// main.js:注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
installIcons(app)
app.use(store)
// 全局挂载 axios
app.config.globalProperties.$http = axios
app.use(router)
app.use(ElementPlus, { locale })
app.mount('#app')


/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-08 22:21:36
 */
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
import { menuTitles } from './utils/menuTitle';
import { menuList } from './views/MainPage/menus';


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

router.beforeEach((to, from, next) => {
	if(to.path == '/login') {
		next()
		return; 
	}
	const menuName = menuTitles[to.meta.title];
	store.commit("SET_MENU_TITLE", menuName)
	let menus = [];
	let flag = false;
	if (to.path != '/dashBoard') {
		for (let i = 0; i < menuList.length; i++) {
			if (menuList[i].children && menuList[i].children.length > 0) {
				for (let j = 0; i < menuList[i].children.length; j++) {
					if (menuList[i].children[j] && menuList[i].children[j].path == to.path) {
						menus = [menuList[i].name, menuList[i].children[j].name];
						console.log(menus, 'menus')
						flag = true;
						break;
					}
				}
			}
			if (flag) {
				break;
			}
		}
		store.commit("SET_BREADCRUMB", menus)
	}
	next()
})
installIcons(app)
app.use(store)
// 全局挂载 axios
app.config.globalProperties.$http = axios
app.use(router)
app.use(ElementPlus, { locale })
app.mount('#app')


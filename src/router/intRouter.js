/*
 * @Description:
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-17 21:29:12
 */
import router from "@/router";
// var whiteList = ["/login", "/auth-redirect", "/config/control/index"]; // no redirect whitelist
import { upLine } from "@/api/user";
function getUrlParams(url) {
  // 通过 ? 分割获取后面的参数字符串
  let urlStr = url.split("?")[1];
  // 创建空对象存储参数
  let obj = {};
  // 再通过 & 将每一个参数单独分割出来
  let paramsArr = urlStr.split("&");
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    let arr = paramsArr[i].split("=");
    obj[arr[0]] = arr[1];
  }
  return obj;
}

router.beforeEach(async (to, from, next) => {
  if (to.path === "/") {
    const hasToken = localStorage.getItem("createById");
    if (hasToken) {
      next();
    } else {
      const currentUrl = window.location.href;
      console.log(currentUrl);
      const params = getUrlParams(currentUrl);
      const res = await upLine(params);
      if (res.code == 200) {
        localStorage.setItem("createById", res.data.sysUser.userId);
        localStorage.setItem("createByRole", res.data.sysUser.roles[0].roleId);
        localStorage.setItem("updateBy", res.data.sysUser.dept.updateBy);
        localStorage.setItem("remark", res.data.sysUser.dept.remark);
        localStorage.setItem("remark", res.data.sysUser.dept.remark);
        localStorage.setItem("menus", res.data.permissions);
        localStorage.setItem("userName", res.data.sysUser.userName);
        localStorage.setItem("token", res.data.toekn);
        this.$store.commit("setUserDetail", res.data);
      }
    }
  } else {
    next();
  }
  //   const hasToken = localStorage.getItem("createById");
  //   if (hasToken) {
  //     const hasRoles = "this.$store.getters.getUserDetail";
  //     if (hasRoles) {
  //       next();
  //     }
  //   }
});

// router.beforeEach((to, from, next) => {
// 	const hasToken = localStorage.getItem('createById')
// 	if (hasToken) {
// 		if (to.path === '/login') {
// 			next()
// 			// NProgress.done()
// 		} else {
// 			const hasRoles = 'this.$store.getters.getUserDetail'
// 			if (hasRoles) {
// 				next()
// 			} else {
// 				next(`/login`)
// 				// 	try {
// 				//   const role = await store.dispatch('user/getInfo')
// 				//   const accessRoutes = await store.dispatch('permission/generateRoutes', role)
// 				//   router.addRoutes(accessRoutes)
// 				//   next({ ...to,
// 				//     replace: true
// 				//   })
// 				// } catch (error) {
// 				//   await store.dispatch('user/resetToken')
// 				//   Message.error(error || 'Has Error')
// 				//   next(`/login`)
// 				//   NProgress.done()
// 				// }
// 			}
// 		}
// 	} else {
// 		/* has no token*/
// 		if (whiteList.indexOf(to.path) !== -1) {
// 			next()
// 		} else {
// 			next(`/login`)
// 			// NProgress.done()
// 		}
// 	}
// });

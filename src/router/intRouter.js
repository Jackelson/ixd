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
// import { upLine } from "@/api/user";
function getUrlParams(url) {
  // 通过 ? 分割获取后面的参数字符串
  let urlStr = url.split("?")[1];
  // 创建空对象存储参数
  let obj = {};
  if (urlStr) {
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr.split("&");
    for (let i = 0, len = paramsArr.length; i < len; i++) {
      // 再通过 = 将每一个参数分割为 key:value 的形式
      let arr = paramsArr[i].split("=");
      obj[arr[0]] = arr[1];
    }
    return obj;
  } else {
    return {
      token: null,
    };
  }
}

router.beforeEach((to, from, next) => {
  console.log(to, "路由跳转前的参数");
  try {
    const hasToken = localStorage.getItem("createById");
    console.log(hasToken, "token");
    if (hasToken) {
      next();
    } else {
      console.log(to, "没有token的路由参数");
      if (to.path == "/dashBoard") {
        const currentUrl = window.location.href;
        const params = getUrlParams(currentUrl);
        console.log(params, "路由参数");
        if (params.token) {
          localStorage.setItem("createById", params.token);
          next();
        } else {
          window.location.href =
            "http://userauth.js.sgcc.com.cn:80/UALogin/login?APPID=13000006113330&TRAGEURL=http://20.47.91.28:18091/ixdpc/isc/login";
        }
      } else {
        window.location.href =
          "http://userauth.js.sgcc.com.cn:80/UALogin/login?APPID=13000006113330&TRAGEURL=http://20.47.91.28:18091/ixdpc/isc/login";
      }
    }
  } catch (error) {
    console.log(error);
  }

  // if (hasToken) {
  //   const hasRoles = "this.$store.getters.getUserDetail";
  //   if (hasRoles) {
  //     next();
  //   }
  // }
  // if (to.path === "/dashBoard") {
  //   next();
  //   if (hasToken) return;
  //   const currentUrl = window.location.href;
  //   const params = getUrlParams(currentUrl);
  //   const r = window.confirm(currentUrl);
  //   if (!r) return;
  //   const res = await upLine(params);
  //   if (res.code == 200) {
  //     const d = window.confirm(res);
  //     if (!d) return;
  //     localStorage.setItem("createById", res.data.sysUser.userId);
  //     localStorage.setItem("createByRole", res.data.sysUser.roles[0].roleId);
  //     localStorage.setItem("updateBy", res.data.sysUser.dept.updateBy);
  //     localStorage.setItem("remark", res.data.sysUser.dept.remark);
  //     localStorage.setItem("remark", res.data.sysUser.dept.remark);
  //     localStorage.setItem("menus", res.data.permissions);
  //     localStorage.setItem("userName", res.data.sysUser.userName);
  //     localStorage.setItem("token", res.data.toekn);
  //     this.$store.commit("setUserDetail", res.data);
  //     window.reload();
  //   }
  // } else if (hasToken) {
  //   next();
  // } else {
  //   next("/dashBoard");
  // }
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

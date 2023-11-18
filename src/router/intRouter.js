/*
 * @Description:
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-17 21:29:12
 */
import router from "@/router";
var whiteList = ["/login", "/auth-redirect", "/config/control/index"]; // no redirect whitelist
router.beforeEach((to, from, next) => {
  const hasToken = localStorage.getItem("token");
  if (hasToken) {
    if (to.path === "/login") {
      next();
      // NProgress.done()
    } else {
      const hasRoles = "this.$store.getters.getUserDetail";
      if (hasRoles) {
        next();
      } else {
        next(`/login`);
        // 	try {
        //   const role = await store.dispatch('user/getInfo')
        //   const accessRoutes = await store.dispatch('permission/generateRoutes', role)
        //   router.addRoutes(accessRoutes)
        //   next({ ...to,
        //     replace: true
        //   })
        // } catch (error) {
        //   await store.dispatch('user/resetToken')
        //   Message.error(error || 'Has Error')
        //   next(`/login`)
        //   NProgress.done()
        // }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`);
      // NProgress.done()
    }
  }
});

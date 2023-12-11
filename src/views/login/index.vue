<template>
  <div class="login-container">
    <div class="login_box">
      <div
        class="login_title"
        style="font-size: 32px; margin-bottom: 18px; margin-top: 40px"
      >
        欢迎登录～
      </div>
      <div class="login_title" style="font-size: 24px">i锡电综合管理应用</div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <el-form-item prop="userName">
          <span class="img-container">
            <svg-icon icon="用户名"></svg-icon>
          </span>
          <el-input
            ref="userName"
            v-model="loginForm.userName"
            placeholder="请输入"
            name="userName"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="img-container">
              <svg-icon icon="密码"></svg-icon>
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
        </el-tooltip>
        <el-checkbox v-model="checked" class="pwd-check">记住密码</el-checkbox>
        <el-button
          :loading="loading"
          type="primary"
          style="
            width: 100%;
            margin-bottom: 30px;
            background-color: #0d8678;
            border: none;
            font-size: 18px;
            font-weight: 500;
          "
          @click.prevent="handleLogin"
          >登&emsp;&emsp;录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
// import { parseTime } from '@/utils/index'
import * as api from "@/api/user";
export default {
  data() {
    const validateuserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        userName: "",
        password: "",
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", validator: validateuserName },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      // userImg: require('../../assets/2107_images/navbar_images/人物-人.png'),
      // lockImg: require('../../assets/2107_images/login_lock.png'),
      checked: false, // 是否记住密码
    };
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     const query = route.query
    //     if (query) {
    //       this.redirect = query.redirect
    //       this.otherQuery = this.getOtherQuery(query)
    //     }
    //   },
    //   immediate: true
    // }
  },
  created() {},
  mounted() {
    if (this.loginForm.userName === "") {
      this.$refs.userName.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          api
            .login({
              userName: this.loginForm.userName.trim(),
              password: this.loginForm.password,
            })
            .then((res) => {
              localStorage.setItem("createById", res.data.sysUser.userId);
              localStorage.setItem(
                "createByRole",
                res.data.sysUser.roles[0].roleId
              );
              localStorage.setItem("updateBy", res.data.sysUser.dept.updateBy);
              localStorage.setItem("remark", res.data.sysUser.dept.remark);
              localStorage.setItem("remark", res.data.sysUser.dept.remark);
              localStorage.setItem("menus", res.data.permissions);
              localStorage.setItem("userName", res.data.sysUser.userName);
              localStorage.setItem("nickName", res.data.sysUser.nickName);
              localStorage.setItem("token", res.data.toekn);
              this.$store.commit("setUserDetail", res.data);
              this.$router.push({
                path: this.redirect || "/",
              });
              this.loading = false;
              // commit('SET_TOKEN', response.access_token)
              // commit('SET_SN', userName.trim())
              // setToken(response.access_token)
              // setPage(1)
              // resolve()
            })
            .catch((error) => {
              console.error(error);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
$bg: #fff;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 32px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 5px;
      color: $light_gray;
      height: 32px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ffffff;
    border-color: #cccccc;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ffffff;
    border-color: #cccccc;
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #cccccc;
  }

  .el-checkbox__inner::after {
    border-color: #ff0000;
  }

  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #cccccc;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  background-image: url("../../assets/bg.png");
  background-size: cover;

  //我的样式
  .login_box {
    box-sizing: border-box;
    width: 476px;
    height: 614px;
    background-color: #ffffff;
    box-shadow: 0px 0px 11px 0px rgba(86, 92, 91, 0.27);
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 68%;
    transform: translate(-50%, -50%);
    padding: 110px 20px 0 20px;

    .login_title {
      text-align: center;
      color: #0d8678;
      font-size: 32px;
      font-family: FZZZHONGJW;
      text-align: left;
      margin: 0 auto;
      width: 320px;
    }
  }

  .login-form {
    position: relative;
    width: 320px;
    max-width: 100%;
    padding: 37px 0;
    margin: 0 auto;
    overflow: hidden;

    .pwd-check {
      margin-bottom: 20px;
      color: #cccccc;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .img-container {
    vertical-align: middle;
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-left: 5px;
    position: relative;

    @mixin imgcenter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .user {
      width: 30px;
      height: 30px;
      @include imgcenter;
    }

    .lock {
      width: 14px;
      height: 18px;
      @include imgcenter;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

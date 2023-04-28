<template>
  <div class="login-container">
    <div class="login_box">
      <div class="login_title">i锡电综合管理应用</div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="img-container">
            <img :src="userImg" class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="img-container">
              <img :src="lockImg" class="lock" />
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
          style="width:100%;margin-bottom:30px;background-color:#336699;border:none;font-size:18px;font-weight:500;"
          round
          @click.prevent="handleLogin"
        >登&emsp;&emsp;录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { parseTime } from '@/utils/index'
import * as api from "@/api/user";
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      // userImg: require('../../assets/2107_images/navbar_images/人物-人.png'),
      // lockImg: require('../../assets/2107_images/login_lock.png'),
      checked: false // 是否记住密码
    }
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
  created() {
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          api.login({ username: this.loginForm.username.trim(), password: this.loginForm.password })
            .then(res => {
              localStorage.setItem('createById', res.data.userid)
							this.$store.commit("setUserDetail", res.data)
							console.log(this.$store.getters.getUserDetail, 'sddddddddddddddd');
              this.$router.push({
                path: this.redirect || '/',
              })
              this.loading = false
              // commit('SET_TOKEN', response.access_token)
              // commit('SET_SN', username.trim())
              // setToken(response.access_token)
              // setPage(1)
              // resolve()
            })
            .catch(error => {
              console.error(error);
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
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
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  // background-image: url("../../assets/2107_images/login_bg.jpg");
  background-size: cover;

  //我的样式
  .login_box {
    width: 560px;
    height: 406px;
    background-color: #ffffff;
    border-radius: 32px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login_title {
      text-align: center;
      margin-top: 79px;
      color: #3399ff;
      font-size: 32px;
      font-family: FZZZHONGJW;
      font-weight: 500;
    }
  }
  .login-form {
    position: relative;
    width: 240px;
    max-width: 100%;
    padding: 50px 0;
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

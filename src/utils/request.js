/*
 * @Description:
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-01 15:30:41
 */
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import router from "@/router/index";
import { ElMessage } from "element-plus";
// axios 配置
axios.defaults.timeout = 300000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.baseURL = "ixdpc";
axios.defaults.withCredentials = true;
axios.defaults.headers = { "X-Requested-With": "XMLHttpRequest" }; //请求头
axios.defaults.maxRedirects = 0;

axios.interceptors.request.use(
  (config) => {
    if (config.url != "/SysUser/login") {
      let uuid = uuidv4();
      uuid = uuid.replace(/-/g, "");
      config.headers["token"] = localStorage.getItem("token") + "|" + uuid;
    }
    config.headers.Authorization = localStorage.getItem("authorization");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 返回状态判断
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log(error, "接口请求报错");
    if (error.response.status == 401) {
      const token = localStorage.getItem("token");
      if (token) {
        delete localStorage["token"];
      }
      try {
        console.log(error.response.headers, "响应头");
        console.log(error.response.data);
        const redirecturl = error.response.data.redirectUrl || "";
        if (redirecturl == "") {
          return;
        }
        window.location.href = redirecturl;
      } catch (error) {
        console.log(error);
        // window.location.href =
        //   "http://userauth.js,sgcc.Com.cn/UALogin/login?APPID-130000061133388TRAGEURL=http://28.78.81.28:18091";
      }
    }
    if (error.response.status == 401) {
      ElMessage.warning("登录过期，请重新登录");
      router.push("/login");
    } else {
      ElMessage.warning("请求错误，请联系管理员");
    }
    return Promise.reject();
  }
);

export function post(url, params) {
  // let data = {};
  // if (url != '/AppCarouselChart/insert' && url != '/AppCarouselChart/update') {
  //     if (params) {
  //         const pwdKey = "71B3CC7F6035D9BC1E430D997C88A6BF"
  //         const sm4 = require('sm-crypto').sm4
  //         data = { message: sm4.encrypt(JSON.stringify(params), pwdKey, { mode: 'cbc', iv: '15D05CC8DD7045F4BF096B8661300CE1' }) }
  //     }
  // } else {
  //     data = params;
  // }
  if (params) {
    return new Promise((resolve, reject) => {
      axios
        // .post(url, data)
        .post(url, params)
        .then((response) => {
          if (response.data.code == 200) {
            resolve(response.data);
          } else {
            ElMessage.error(response.data.msg);
            resolve(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      axios
        .post(url)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export function get(url, data) {
  let params = {};
  if (url != "/isc/login") {
    const pwdKey = "71B3CC7F6035D9BC1E430D997C88A6BF";
    const sm4 = require("sm-crypto").sm4;
    data = {
      message: sm4.encrypt(JSON.stringify(params), pwdKey, {
        mode: "cbc",
        iv: "15D05CC8DD7045F4BF096B8661300CE1",
      }),
    };
  } else {
    params = data;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((response) => {
        if (response.data.code == 200) {
          resolve(response.data);
        } else {
          ElMessage.error(response.data.msg);
          resolve(response.data.msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
// 下载文件get
export function getDown(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((response) => {
        if (response.headers["content-disposition"]) {
          const disposition =
            response.headers["content-disposition"].split(";");
          if (disposition[1].indexOf("filename") !== -1) {
            const startNum = disposition[1].indexOf("=");
            const fileName = decodeURI(disposition[1].substring(startNum + 1));
            console.log(fileName);
            resolve({
              fileName,
              response,
            });
          }
        } else {
          resolve(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function uploadFile(url, params) {
  const param = new FormData();
  Object.keys(params)
    .filter((key) => params[key])
    .forEach((key) => {
      param.append(key, params[key]);
    });
  const config = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, param, config)
      .then((response) => {
        if (response.headers["content-disposition"]) {
          const disposition =
            response.headers["content-disposition"].split(";");
          if (disposition[1].indexOf("filename") !== -1) {
            const startNum = disposition[1].indexOf("=");
            const fileName = decodeURI(disposition[1].substring(startNum + 1));
            resolve({
              fileName,
              response,
            });
          }
        } else {
          resolve(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function uploadFileHttp(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, { responseType: "blob" })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

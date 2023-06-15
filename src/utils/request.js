/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-15 22:45:09
 */
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
// axios 配置
axios.defaults.timeout = 300000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'ixdpc';
axios.defaults.withCredentials = true;
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' }; //请求头
// POST传参序列化
axios.interceptors.request.use(
    config => {
        if (config.url != '/SysUser/login') {
            let uuid = uuidv4();
            uuid = uuid.replace(/-/g, "")
            config.headers['token'] = localStorage.getItem('token') + '|' + uuid;
        }
        config.headers.Authorization = localStorage.getItem('authorization');
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

// 返回状态判断
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export function post(url, params) {
    let data = {};
    if (params) {
        const pwdKey = "71B3CC7F6035D9BC1E430D997C88A6BF"
        const sm4 = require('sm-crypto').sm4
        data = { message: sm4.encrypt(JSON.stringify(params), pwdKey, { mode: 'cbc', iv: '15D05CC8DD7045F4BF096B8661300CE1' }) }
    }

    if (params) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    } else {
        return new Promise((resolve, reject) => {
            axios
                .post(url)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }


}

export function get(url, params) {
    const pwdKey = "71B3CC7F6035D9BC1E430D997C88A6BF"
    const sm4 = require('sm-crypto').sm4
    let data = { message: sm4.encrypt(JSON.stringify(params), pwdKey, { mode: 'cbc', iv: '15D05CC8DD7045F4BF096B8661300CE1' }) }
    return new Promise((resolve, reject) => {
        axios
            .get(url, { data })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function uploadFile(url, params) {
    const param = new FormData();
    Object.keys(params)
        .filter(key => params[key])
        .forEach(key => {
            param.append(key, params[key]);
        });
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    };
    return new Promise((resolve, reject) => {
        axios
            .post(url, param, config)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

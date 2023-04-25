import axios from 'axios';
// axios 配置
axios.defaults.timeout = 300000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'api';
axios.defaults.withCredentials = true;
axios.defaults.headers={'X-Requested-With': 'XMLHttpRequest'}; //请求头
// POST传参序列化
axios.interceptors.request.use(
    config => {
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
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {params})
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

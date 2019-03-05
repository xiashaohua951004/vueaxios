import axios from "axios";
import router from "../router";
import {Toast} from "vant"; // 导入vant.Toast提示模块
import qs from 'qs';      // 根据需求是否导入qs模块


/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */

const tip = msg => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true
  })
}
const load = () => {
  Toast.loading({
    duration: 0,
    message: '加载中...'
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */

const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */

const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录');
      localStorage.removeItem('token');
      // store.commit('loginSuccess',);
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    // 404请求不存在
    case 404:
      tip('请求的资源不存在');
      break;
    default:
      console.log(other);
      tip('网络错误');
  }
}


// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
axios.interceptors.request.use(
  config => {
    load();
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    // const token = store.state.token;
    // store.commit('SET_LOAD', true);
    const token = "";
    token && (config.headers.Authorization = token);
    return config;
  },
  error => Promise.error(error));

// 响应拦截器
axios.interceptors.response.use(
  // 请求成功
  res => {
    if (res.status === 200) {
      // tip("请求成功")
      return Promise.resolve(res)
    } else {
      errorHandle(res.data.status, res.data.message);
      return Promise.reject(res)
    }

  },
  // 请求失败
  error => {
    const {response} = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.data.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
      tip("网络连接失败")
    }
  });

//get请求
function get(url, params) {

  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data);
        Toast.clear();
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

//post请求
function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data);
        Toast.clear();
      })
      .catch(err => {
        reject(err.data)
      })
  });
}


export default {
  get,
  post
};

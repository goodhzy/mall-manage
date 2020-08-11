/**
 * request 网络请求工具
 */

import { message } from 'antd';
import axios from 'axios';
import {history} from 'umi'
import {stringify} from 'querystring'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const devUrl = 'http://127.0.0.1:7777/api/private/v1/'
const prdUrl = 'http://yystudy.top:7777/api/private/v1/'

const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devUrl : prdUrl,
  timeout: 5000, // request timeout
});
/*
 *请求前拦截
 *用于处理需要请求前的操作
 */
request.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = `${localStorage.getItem('token')}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
/*
 *请求响应拦截
 *用于处理数据返回后的操作
 */
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (response.status !== 200) {
      // 服务端返回的状态码不等于200，则reject()
      return Promise.reject(response.data); // return Promise.reject 可使promise状态进入catch
    }else{
      if(res && res.meta && res.meta.status >= 400){
        message.error(res.meta.msg)
        if(res.meta.msg === '无效token'){
          history.replace('/user/login')
        }
        return Promise.reject(response.data);
      }
    }
    return response.data;
  },
  (error) => {
    console.log(error);
    // 断网处理或者请求超时
    if (!error.response) {
      // 请求超时
      if (error.message.includes('timeout')) {
        console.log('超时了');
        message.error('请求超时，请检查互联网连接');
      } else {
        // 断网，可以展示断网组件
        console.log('断网了');
        message.error('请检查网络是否已连接');
      }
      return Promise.reject(error)
    }
    const {status} = error.response;
    message.error(codeMessage[status]);
    if (status === 401) {
      localStorage.clear('token');
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
    return Promise.reject(error);
  },
);

export default request;

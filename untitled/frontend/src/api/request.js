import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080/blog/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：自动携带 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        // 未登录，清除 token 并跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        alert(data?.message || '权限不足');
      } else {
        alert(data?.message || '请求失败');
      }
    } else {
      alert('网络错误，请检查后端服务是否启动');
    }
    return Promise.reject(error);
  }
);

export default request;

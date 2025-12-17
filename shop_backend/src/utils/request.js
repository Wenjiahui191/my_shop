import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api',
  timeout: 15000,
});

// 简单的去重控制，避免重复请求
const pendingMap = new Map();
const getPendingKey = (config) => `${config.method}|${config.url}|${JSON.stringify(config.params)}|${JSON.stringify(config.data)}`;

const addPending = (config) => {
  const key = getPendingKey(config);
  if (pendingMap.has(key)) {
    config.cancelToken = new axios.CancelToken((cancel) => cancel('重复请求已取消'));
  } else {
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        pendingMap.set(key, cancel);
      });
  }
};

const removePending = (config) => {
  const key = getPendingKey(config);
  if (pendingMap.has(key)) {
    const cancel = pendingMap.get(key);
    cancel();
    pendingMap.delete(key);
  }
};

request.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    addPending(config);
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => {
    removePending(response.config);
    const { code, message, data,pagination={} } = response.data;
    
    // 检查业务级错误码
    if (code && code >= 400) {
      ElMessage.error(message || '请求失败');
      return Promise.reject(new Error(message || '请求失败'));
    }
    
    // 成功响应，返回 data 数据
    return {data,pagination};
  },
  (error) => {
    const auth = useAuthStore();
    const status = error.response?.status;
    const errorData = error.response?.data;
    const message = errorData?.message || errorData?.error || error.message;

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.config) {
      removePending(error.config);
    }

    if (status === 401) {
      auth.logout();
      if (location.pathname !== '/login') {
        location.href = '/login';
      }
    } else if (status >= 500) {
      ElMessage.error('服务器繁忙，请稍后重试');
    } else if (message) {
      ElMessage.error(message);
    } else {
      ElMessage.error('网络异常，请检查连接');
    }

    return Promise.reject(error);
  },
);

export default request;


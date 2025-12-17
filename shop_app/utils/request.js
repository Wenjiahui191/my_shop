const BASE_URL = 'http://localhost:8088/api';

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      ...options.header,
    };
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      success: (res) => {
        // 统一的响应结构：{ code, message, data, pagination? }
        const { code, message, data } = res.data;
        
        // 根据响应码判断成功/失败
        if (code >= 200 && code < 300) {
          // 成功：返回data
          resolve({ data, pagination: res.data.pagination || {} });
        } else {
          // 错误处理
          if (code === 401) {
            uni.removeStorageSync('token');
            uni.removeStorageSync('user');
            // Avoid redirect loop if already on login page
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            if (currentPage && currentPage.route !== 'pages/login/login') {
                uni.navigateTo({ url: '/pages/login/login' });
            }
          }
          uni.showToast({
            title: message || '请求失败',
            icon: 'none'
          });
          reject({ code, message, data });
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

export const filePath="http://192.168.3.245:8088"

export default request;

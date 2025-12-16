const BASE_URL = 'http://localhost:8088/api';

function getToken() {
  try {
    return uni.getStorageSync('token') || '';
  } catch (e) {
    return '';
  }
}

export function request(options) {
  const { url, method = 'GET', data, header = {} } = options;

  return new Promise((resolve, reject) => {
    const token = getToken();

    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      success(res) {
        const { statusCode, data: body } = res;

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
          return;
        }

        if (statusCode === 401) {
          uni.removeStorageSync('token');
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/user/login' });
          }, 1000);
        } else {
          const msg = body?.message || body?.error || '请求失败，请稍后重试';
          uni.showToast({ title: msg, icon: 'none' });
        }

        reject(body);
      },
      fail(err) {
        uni.showToast({ title: '网络异常，请检查连接', icon: 'none' });
        reject(err);
      },
    });
  });
}

export function get(url, params) {
  return request({ url, method: 'GET', data: params });
}

export function post(url, data) {
  return request({ url, method: 'POST', data });
}

export function del(url, data) {
  return request({ url, method: 'DELETE', data });
}


import request from '../utils/request';

/**
 * 上传单个文件
 * @param {Object} file - 文件对象 { name, type, size, path }
 * @returns {Promise}
 */
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Authorization': `Bearer ${token}`
    };

    uni.uploadFile({
      url: 'http://localhost:3000/api/upload/file',
      filePath: file.path,
      name: 'file',
      header: header,
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          const { code, message, data: responseData } = data;
          
          if (code >= 200 && code < 300) {
            resolve(responseData);
          } else {
            uni.showToast({
              title: message || '上传失败',
              icon: 'none'
            });
            reject({ code, message, data: responseData });
          }
        } catch (error) {
          reject(error);
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

/**
 * 上传多个文件
 * @param {Array} files - 文件数组 [{ name, type, size, path }, ...]
 * @returns {Promise}
 */
export const uploadMultipleFiles = (files) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Authorization': `Bearer ${token}`
    };

    // 顺序上传多个文件
    let completed = 0;
    const uploadedFiles = [];

    if (files.length === 0) {
      reject(new Error('没有选择文件'));
      return;
    }

    const uploadNextFile = (index) => {
      if (index >= files.length) {
        resolve({
          files: uploadedFiles,
          count: uploadedFiles.length
        });
        return;
      }

      const file = files[index];
      uni.uploadFile({
        url: 'http://localhost:3000/api/upload/file',
        filePath: file.path,
        name: 'file',
        header: header,
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            const { code, message, data: responseData } = data;
            
            if (code >= 200 && code < 300) {
              uploadedFiles.push(responseData);
            } else {
              uni.showToast({
                title: `上传失败: ${message || '未知错误'}`,
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('解析响应失败:', error);
          }
          uploadNextFile(index + 1);
        },
        fail: (err) => {
          console.error(`上传文件失败: ${file.name}`, err);
          uploadNextFile(index + 1);
        }
      });
    };

    uploadNextFile(0);
  });
};

/**
 * 上传单个商品图片
 * @param {Object} file - 文件对象 { name, type, size, path }
 * @returns {Promise}
 */
export const uploadProductImage = (file) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Authorization': `Bearer ${token}`
    };

    uni.uploadFile({
      url: 'http://localhost:3000/api/upload/product-image',
      filePath: file.path,
      name: 'image',
      header: header,
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          const { code, message, data: responseData } = data;
          
          if (code >= 200 && code < 300) {
            resolve(responseData);
          } else {
            uni.showToast({
              title: message || '上传失败',
              icon: 'none'
            });
            reject({ code, message, data: responseData });
          }
        } catch (error) {
          reject(error);
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

/**
 * 上传多个商品图片
 * @param {Array} files - 文件数组 [{ name, type, size, path }, ...]
 * @returns {Promise}
 */
export const uploadProductImages = (files) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Authorization': `Bearer ${token}`
    };

    const uploadedFiles = [];

    if (files.length === 0) {
      reject(new Error('没有选择文件'));
      return;
    }

    const uploadNextFile = (index) => {
      if (index >= files.length) {
        resolve({
          files: uploadedFiles,
          count: uploadedFiles.length
        });
        return;
      }

      const file = files[index];
      uni.uploadFile({
        url: 'http://localhost:3000/api/upload/product-images',
        filePath: file.path,
        name: 'images',
        header: header,
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            const { code, message, data: responseData } = data;
            
            if (code >= 200 && code < 300) {
              if (Array.isArray(responseData.files)) {
                uploadedFiles.push(...responseData.files);
              }
            } else {
              uni.showToast({
                title: `上传失败: ${message || '未知错误'}`,
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('解析响应失败:', error);
          }
          uploadNextFile(index + 1);
        },
        fail: (err) => {
          console.error(`上传文件失败: ${file.name}`, err);
          uploadNextFile(index + 1);
        }
      });
    };

    uploadNextFile(0);
  });
};

/**
 * 删除上传的文件
 * @param {string} filename - 文件名
 * @returns {Promise}
 */
export const deleteFile = (filename) => {
  return request({
    url: `/upload/file/${filename}`,
    method: 'DELETE',
  });
};

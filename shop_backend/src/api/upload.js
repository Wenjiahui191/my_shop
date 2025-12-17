import request from '../utils/request';

/**
 * 上传单个文件
 * @param {File} file - 文件对象
 * @returns {Promise}
 */
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/upload/file',
    method: 'POST',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 上传多个文件
 * @param {FileList|Array} files - 文件列表
 * @returns {Promise}
 */
export const uploadMultipleFiles = (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });
  return request({
    url: '/upload/multiple',
    method: 'POST',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data',
    },
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

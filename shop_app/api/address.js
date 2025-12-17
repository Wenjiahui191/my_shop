import request from '../utils/request';

/**
 * 获取收货地址列表
 * @returns {Promise}
 */
export const getAddresses = () => {
  return request({
    url: '/address',
    method: 'GET'
  });
};

/**
 * 添加收货地址
 * @param {Object} data - 地址信息
 * @returns {Promise}
 */
export const addAddress = (data) => {
  return request({
    url: '/address',
    method: 'POST',
    data
  });
};

/**
 * 更新收货地址
 * @param {number} id - 地址ID
 * @param {Object} data - 地址信息
 * @returns {Promise}
 */
export const updateAddress = (id, data) => {
  return request({
    url: `/address/${id}`,
    method: 'PUT',
    data
  });
};

/**
 * 删除收货地址
 * @param {number} id - 地址ID
 * @returns {Promise}
 */
export const deleteAddress = (id) => {
  return request({
    url: `/address/${id}`,
    method: 'DELETE'
  });
};

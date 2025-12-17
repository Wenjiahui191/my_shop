/**
 * 统一响应格式
 * {
 *   code: 200,           // HTTP状态码
 *   message: '成功',      // 提示信息
 *   data: {},            // 返回数据
 *   pagination: {}       // 分页信息（可选）
 * }
 */

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {*} data - 返回的数据
 * @param {string} message - 提示信息
 * @param {number} statusCode - HTTP状态码，默认200
 * @param {Object} pagination - 分页信息（可选）
 */
exports.success = (res, data = null, message = '请求成功', statusCode = 200, pagination = null) => {
  const response = {
    code: statusCode,
    message,
    data
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * 错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误信息
 * @param {number} statusCode - HTTP状态码，默认400
 * @param {*} error - 错误详情（可选，仅在开发环境显示）
 */
exports.error = (res, message = '请求失败', statusCode = 400, error = null) => {
  const response = {
    code: statusCode,
    message,
    data: null
  };
  
  // 仅在开发环境返回错误详情
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message || error;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * 创建成功响应（用于POST创建操作）
 * @param {Object} res - Express响应对象
 * @param {*} data - 返回的数据
 * @param {string} message - 提示信息
 */
exports.created = (res, data = null, message = '创建成功') => {
  return exports.success(res, data, message, 201);
};

/**
 * 未找到响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 提示信息
 */
exports.notFound = (res, message = '资源不存在') => {
  return exports.error(res, message, 404);
};

/**
 * 未授权响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 提示信息
 */
exports.unauthorized = (res, message = '未授权') => {
  return exports.error(res, message, 401);
};

/**
 * 禁止访问响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 提示信息
 */
exports.forbidden = (res, message = '禁止访问') => {
  return exports.error(res, message, 403);
};

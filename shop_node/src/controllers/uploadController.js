const path = require('path');
const fs = require('fs');
const response = require('../utils/response');

/**
 * 上传文件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return response.error(res, '请选择要上传的文件', 400);
    }

    const file = req.file;
    
    // 构建文件信息对象
    const fileInfo = {
      filename: file.filename, // multer 生成的文件名（时间戳+原始名称）
      originalName: file.originalname, // 原始文件名
      size: file.size, // 文件大小（字节）
      mimetype: file.mimetype, // 文件 MIME 类型
      path: file.path, // 文件保存的本地路径
      url: `/uploads/${file.filename}`, // 可访问的 URL 路径（用于前端访问）
      uploadTime: new Date().toISOString(),
    };

    response.success(res, fileInfo, '文件上传成功');
  } catch (error) {
    response.error(res, '文件上传失败：' + error.message, 500, error);
  }
};

/**
 * 上传多个文件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return response.error(res, '请选择要上传的文件', 400);
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
      url: `/uploads/${file.filename}`,
      uploadTime: new Date().toISOString(),
    }));

    response.success(res, { files, count: files.length }, '文件上传成功');
  } catch (error) {
    response.error(res, '文件上传失败：' + error.message, 500, error);
  }
};

/**
 * 删除上传的文件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const deleteFile = (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return response.error(res, '文件名不能为空', 400);
    }

    // 防止目录遍历攻击
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return response.error(res, '非法文件名', 400);
    }

    const filePath = path.join(__dirname, '../../upload', filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return response.error(res, '文件不存在', 404);
    }

    // 删除文件
    fs.unlinkSync(filePath);
    response.success(res, null, '文件删除成功');
  } catch (error) {
    response.error(res, '文件删除失败：' + error.message, 500, error);
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
};

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 配置 multer 存储
const uploadDir = path.join(__dirname, '../../upload');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一的文件名：时间戳 + 原始文件名
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${Date.now()}-${name}${ext}`;
    cb(null, filename);
  },
});

// 文件过滤器：限制上传的文件类型和大小
const fileFilter = (req, file, cb) => {
  // 允许的 MIME 类型
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 最大 50MB
  },
});

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: 上传单个文件
 *     tags:
 *       - Upload
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 文件上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 文件上传成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: 1234567890-photo.jpg
 *                     originalName:
 *                       type: string
 *                       example: photo.jpg
 *                     size:
 *                       type: number
 *                       example: 102400
 *                     mimetype:
 *                       type: string
 *                       example: image/jpeg
 *                     path:
 *                       type: string
 *                       example: d:\projects\my_shop\shop_node\upload\1234567890-photo.jpg
 *                     url:
 *                       type: string
 *                       example: /uploads/1234567890-photo.jpg
 *                     uploadTime:
 *                       type: string
 *                       example: 2025-12-16T10:30:00.000Z
 *       400:
 *         description: 请求错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
router.post('/file', authMiddleware, upload.single('file'), uploadController.uploadFile);

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: 上传多个文件
 *     tags:
 *       - Upload
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: 文件上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 文件上传成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         type: object
 *                     count:
 *                       type: number
 *       400:
 *         description: 请求错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
router.post('/multiple', authMiddleware, upload.array('files', 10), uploadController.uploadMultipleFiles);

/**
 * @swagger
 * /api/upload/file/{filename}:
 *   delete:
 *     summary: 删除上传的文件
 *     tags:
 *       - Upload
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: 文件名
 *     responses:
 *       200:
 *         description: 文件删除成功
 *       400:
 *         描述: 请求错误
 *       401:
 *         description: 未授权
 *       404:
 *         description: 文件不存在
 *       500:
 *         description: 服务器错误
 */
router.delete('/file/:filename', authMiddleware, uploadController.deleteFile);

/**
 * @swagger
 * /api/upload/product-image:
 *   post:
 *     summary: 上传商品图片
 *     tags:
 *       - Upload
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 商品图片上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 商品图片上传成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: 1234567890-product.jpg
 *                     originalName:
 *                       type: string
 *                       example: product.jpg
 *                     size:
 *                       type: number
 *                     mimetype:
 *                       type: string
 *                     url:
 *                       type: string
 *                       example: /uploads/1234567890-product.jpg
 *       400:
 *         description: 请求错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
router.post('/product-image', authMiddleware, upload.single('image'), uploadController.uploadFile);

/**
 * @swagger
 * /api/upload/product-images:
 *   post:
 *     summary: 上传多个商品图片
 *     tags:
 *       - Upload
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: 商品图片上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                     count:
 *                       type: number
 *       400:
 *         description: 请求错误
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
router.post('/product-images', authMiddleware, upload.array('images', 10), uploadController.uploadMultipleFiles);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: 管理员认证
 */

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: 管理员登录
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功，返回 Token
 *       401:
 *         description: 用户名或密码错误
 */
router.post('/login', adminAuthController.login);

/**
 * @swagger
 * /admin/auth/me:
 *   get:
 *     summary: 获取管理员信息
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 管理员信息
 */
router.get('/me', adminAuthMiddleware, adminAuthController.getProfile);

module.exports = router;

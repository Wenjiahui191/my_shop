const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 用户认证与管理
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 注册新用户
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               phone:
 *                 type: string
 *                 description: 手机号
 *               nickname:
 *                 type: string
 *                 description: 昵称
 *     responses:
 *       201:
 *         description: 用户注册成功
 *       400:
 *         description: 用户已存在
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [Auth]
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
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 令牌
 *                 user:
 *                   type: object
 *                   description: 用户信息
 *       400:
 *         description: 用户名或密码错误
 */
router.post('/login', authController.login);

router.post('/wechat-login', authController.wechatLogin);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

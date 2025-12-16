const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: AdminUsers
 *   description: 管理员用户管理
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: 获取用户列表
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索用户名、手机号或昵称
 *     responses:
 *       200:
 *         description: 用户列表
 */
router.get('/', adminAuthMiddleware, adminUserController.getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: 获取用户详情
 *     tags: [AdminUsers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户详情
 *       404:
 *         description: 用户未找到
 */
router.get('/:id', adminAuthMiddleware, adminUserController.getUserById);

module.exports = router;

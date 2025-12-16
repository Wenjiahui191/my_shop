const express = require('express');
const router = express.Router();
const adminCategoryController = require('../controllers/adminCategoryController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: AdminCategories
 *   description: 管理员分类管理
 */

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: 获取分类树
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 分类树形结构
 */
router.get('/', adminAuthMiddleware, adminCategoryController.getCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: 创建分类
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 分类名称
 *               parent_id:
 *                 type: integer
 *                 description: 父分类ID
 *               image_url:
 *                 type: string
 *                 description: 图片URL
 *               sort_order:
 *                 type: integer
 *                 description: 排序权重
 *     responses:
 *       201:
 *         description: 分类创建成功
 */
router.post('/', adminAuthMiddleware, adminCategoryController.createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: 更新分类
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               sort_order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 分类更新成功
 */
router.put('/:id', adminAuthMiddleware, adminCategoryController.updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: 删除分类
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 分类删除成功
 */
router.delete('/:id', adminAuthMiddleware, adminCategoryController.deleteCategory);

module.exports = router;

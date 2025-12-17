const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/adminProductController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: AdminProducts
 *   description: 管理员商品管理
 */

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: 获取商品列表（包括上架和下架）
 *     tags: [AdminProducts]
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
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: 分类ID筛选
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [on_shelf, off_shelf]
 *         description: 商品状态筛选
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索名称或描述
 *     responses:
 *       200:
 *         description: 商品列表
 */
router.get('/', adminAuthMiddleware, adminProductController.getProducts);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: 创建商品
 *     tags: [AdminProducts]
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
 *               - price
 *             properties:
 *               category_id:
 *                 type: integer
 *                 description: 分类ID
 *               name:
 *                 type: string
 *                 description: 商品名称
 *               description:
 *                 type: string
 *                 description: 商品描述
 *               price:
 *                 type: number
 *                 description: 价格
 *               stock:
 *                 type: integer
 *                 description: 库存
 *               image_url:
 *                 type: string
 *                 description: 图片URL
 *               status:
 *                 type: string
 *                 enum: [on_shelf, off_shelf]
 *                 description: 状态 (on_shelf: 上架, off_shelf: 下架)
 *     responses:
 *       201:
 *         description: 商品创建成功
 */
router.post('/', adminAuthMiddleware, adminProductController.createProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: 更新商品
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [on_shelf, off_shelf]
 *     responses:
 *       200:
 *         description: 商品更新成功
 */
router.put('/:id', adminAuthMiddleware, adminProductController.updateProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: 删除商品
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     responses:
 *       200:
 *         description: 商品删除成功
 */
router.delete('/:id', adminAuthMiddleware, adminProductController.deleteProduct);

/**
 * @swagger
 * /admin/products/{id}/status:
 *   patch:
 *     summary: 更新商品状态（上架/下架）
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [on_shelf, off_shelf]
 *                 description: 状态
 *     responses:
 *       200:
 *         description: 状态更新成功
 */
router.patch('/:id/status', adminAuthMiddleware, adminProductController.updateProductStatus);

module.exports = router;

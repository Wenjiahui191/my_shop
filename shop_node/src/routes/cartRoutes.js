const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: 购物车管理
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: 获取购物车列表
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 购物车商品列表
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: 添加商品到购物车
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: 商品ID
 *               quantity:
 *                 type: integer
 *                 description: 数量
 *     responses:
 *       200:
 *         description: 添加成功
 */
router.post('/', cartController.addToCart);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: 更新购物车商品数量
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 购物车记录ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: 新数量
 *     responses:
 *       200:
 *         description: 更新成功
 */
router.put('/:id', cartController.updateCartItem);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: 删除购物车商品
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 购物车记录ID
 *     responses:
 *       200:
 *         description: 删除成功
 */
router.delete('/:id', cartController.removeCartItem);

module.exports = router;

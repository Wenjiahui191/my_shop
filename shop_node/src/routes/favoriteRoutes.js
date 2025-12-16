const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: 用户收藏
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: 收藏列表
 *     tags: [Favorites]
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
 *     responses:
 *       200:
 *         description: 收藏列表
 */
router.get('/', authMiddleware, favoriteController.listFavorites);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: 添加收藏
 *     tags: [Favorites]
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
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: 商品ID
 *     responses:
 *       201:
 *         description: 收藏成功
 */
router.post('/', authMiddleware, favoriteController.addFavorite);

/**
 * @swagger
 * /favorites/{productId}:
 *   delete:
 *     summary: 取消收藏
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     responses:
 *       200:
 *         description: 取消成功
 */
router.delete('/:productId', authMiddleware, favoriteController.removeFavorite);

/**
 * @swagger
 * /favorites/check:
 *   get:
 *     summary: 检查商品是否已收藏
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     responses:
 *       200:
 *         description: 返回 liked 布尔值
 */
router.get('/check', authMiddleware, favoriteController.checkFavorite);

module.exports = router;


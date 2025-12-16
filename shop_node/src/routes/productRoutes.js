const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 商品管理
 */

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: 获取商品分类树
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 分类列表
 */
router.get('/categories', productController.getCategories);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 获取商品列表
 *     tags: [Products]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索名称或描述
 *     responses:
 *       200:
 *         description: 分页商品列表
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 获取商品详情
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品 ID
 *     responses:
 *       200:
 *         description: 商品详情
 *       404:
 *         description: 商品未找到
 */
router.get('/:id', productController.getProductById);

module.exports = router;

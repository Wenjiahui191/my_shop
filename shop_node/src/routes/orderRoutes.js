const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: 订单管理
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: 创建新订单
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_id
 *             properties:
 *               address_id:
 *                 type: integer
 *                 description: 收货地址ID
 *               remark:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       201:
 *         description: 订单创建成功
 *       400:
 *         description: 购物车为空或库存不足
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: 获取用户订单列表
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, shipped, completed, cancelled]
 *         description: 订单状态筛选 (pending: 待付款, paid: 已付款, shipped: 已发货, completed: 已完成, cancelled: 已取消)
 *     responses:
 *       200:
 *         description: 订单列表
 */
router.get('/', orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: 获取订单详情
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 订单 ID
 *     responses:
 *       200:
 *         description: 订单详情
 *       404:
 *         description: 订单未找到
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: 取消订单
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 订单 ID
 *     responses:
 *       200:
 *         description: 订单取消成功
 *       400:
 *         description: 当前状态无法取消
 */
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;

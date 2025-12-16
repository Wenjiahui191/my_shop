const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: AdminOrders
 *   description: 管理员订单管理
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: 获取订单列表
 *     tags: [AdminOrders]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, shipped, completed, cancelled]
 *         description: 订单状态
 *       - in: query
 *         name: order_no
 *         schema:
 *           type: string
 *         description: 订单号
 *     responses:
 *       200:
 *         description: 订单列表
 */
router.get('/', adminAuthMiddleware, adminOrderController.getOrders);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: 获取订单详情
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 订单详情
 */
router.get('/:id', adminAuthMiddleware, adminOrderController.getOrderById);

/**
 * @swagger
 * /admin/orders/{id}/ship:
 *   post:
 *     summary: 订单发货
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 订单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tracking_number
 *               - tracking_company
 *             properties:
 *               tracking_number:
 *                 type: string
 *                 description: 物流单号
 *               tracking_company:
 *                 type: string
 *                 description: 物流公司
 *     responses:
 *       200:
 *         description: 发货成功
 */
router.post('/:id/ship', adminAuthMiddleware, adminOrderController.shipOrder);

module.exports = router;

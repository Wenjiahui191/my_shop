const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: 收货地址管理
 */

/**
 * @swagger
 * /address:
 *   post:
 *     summary: 添加收货地址
 *     tags: [Address]
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
 *               - phone
 *               - province
 *               - city
 *               - district
 *               - detail
 *             properties:
 *               name:
 *                 type: string
 *                 description: 收货人姓名
 *               phone:
 *                 type: string
 *                 description: 手机号
 *               province:
 *                 type: string
 *                 description: 省份
 *               city:
 *                 type: string
 *                 description: 城市
 *               district:
 *                 type: string
 *                 description: 区/县
 *               detail:
 *                 type: string
 *                 description: 详细地址
 *               is_default:
 *                 type: boolean
 *                 description: 是否设为默认地址
 *     responses:
 *       201:
 *         description: 地址添加成功
 */
router.post('/', addressController.addAddress);

/**
 * @swagger
 * /address:
 *   get:
 *     summary: 获取收货地址列表
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 地址列表
 */
router.get('/', addressController.getAddresses);

/**
 * @swagger
 * /address/{id}:
 *   put:
 *     summary: 更新收货地址
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 地址 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 收货人姓名
 *               phone:
 *                 type: string
 *                 description: 手机号
 *               province:
 *                 type: string
 *                 description: 省份
 *               city:
 *                 type: string
 *                 description: 城市
 *               district:
 *                 type: string
 *                 description: 区/县
 *               detail:
 *                 type: string
 *                 description: 详细地址
 *               is_default:
 *                 type: boolean
 *                 description: 是否设为默认地址
 *     responses:
 *       200:
 *         description: 地址更新成功
 */
router.put('/:id', addressController.updateAddress);

/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     summary: 删除收货地址
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 地址 ID
 *     responses:
 *       200:
 *         description: 地址删除成功
 */
router.delete('/:id', addressController.deleteAddress);

module.exports = router;

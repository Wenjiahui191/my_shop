const db = require('../config/db');
const response = require('../utils/response');

// 生成唯一订单号
const generateOrderNo = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

exports.createOrder = async (req, res) => {
  const { address_id, remark } = req.body;
  const user_id = req.user.id;
  
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. 查询购物车商品
    const [cartItems] = await connection.query(
      `SELECT c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return response.error(res, '购物车为空', 400);
    }

    // 2. 校验库存并计算总价
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await connection.rollback();
        return response.error(res, `商品 ${item.name} 库存不足`, 400);
      }
      totalAmount += parseFloat(item.price) * item.quantity;
    }

    // 3. 获取地址快照
    const [addresses] = await connection.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [address_id, user_id]
    );

    if (addresses.length === 0) {
      await connection.rollback();
      return response.error(res, '收货地址无效', 400);
    }
    const addressSnapshot = addresses[0];

    // 4. 创建订单
    const orderNo = generateOrderNo();
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, order_no, total_amount, address_snapshot, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, orderNo, totalAmount, JSON.stringify(addressSnapshot), 'pending']
    );
    const orderId = orderResult.insertId;

    // 5. 创建订单商品并扣减库存
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, product_image) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.name, item.price, item.quantity, item.image_url]
      );
      
      // 扣减库存
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // 6. 清空购物车
    await connection.query('DELETE FROM carts WHERE user_id = ?', [user_id]);

    await connection.commit();

    response.created(res, { order_id: orderId, order_no: orderNo }, '订单创建成功');

  } catch (error) {
    await connection.rollback();
    console.error('创建订单出错:', error);
    response.error(res, '服务器错误', 500, error);
  } finally {
    connection.release();
  }
};

exports.getOrders = async (req, res) => {
  const { status } = req.query;
  const user_id = req.user.id;

  try {
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [user_id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';

    const [orders] = await db.query(query, params);

    // Get items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.id, oi.order_id, oi.product_id, oi.price, oi.quantity, 
                p.id as product_id_full, p.name, p.price as product_price
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.OrderItems = items.map(item => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        price: item.price,
        quantity: item.quantity,
        Product: {
          id: item.product_id_full,
          name: item.name,
          price: item.product_price
        }
      }));
    }

    response.success(res, orders, '获取成功');
  } catch (error) {
    console.error('查询订单列表出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (orders.length === 0) {
      return response.notFound(res, '订单不存在');
    }

    const order = orders[0];
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );
    order.OrderItems = items;

    response.success(res, order, '获取成功');
  } catch (error) {
    console.error('查询订单详情出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};

exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return response.notFound(res, '订单不存在');
    }

    const order = orders[0];

    if (order.status !== 'pending') {
      await connection.rollback();
      return response.error(res, '当前状态不可取消订单', 400);
    }

    // 恢复库存
    const [items] = await connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // 更新订单状态
    await connection.query(
      'UPDATE orders SET status = "cancelled" WHERE id = ?',
      [id]
    );

    await connection.commit();
    response.success(res, null, '订单取消成功');

  } catch (error) {
    await connection.rollback();
    console.error('取消订单出错:', error);
    response.error(res, '服务器错误', 500, error);
  } finally {
    connection.release();
  }
};

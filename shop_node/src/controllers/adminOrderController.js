const db = require('../config/db');

exports.getOrders = async (req, res) => {
  const { page = 1, limit = 10, status, order_no } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT o.id, o.order_no, o.total_amount, o.status, o.created_at, u.username, u.nickname 
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    const conditions = [];
    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }
    if (order_no) {
      conditions.push('o.order_no LIKE ?');
      params.push(`%${order_no}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders o';
    const countParams = [];
    
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      countParams.push(...params.slice(0, conditions.length)); // Only conditions params
    }

    const [totalResult] = await db.query(countQuery, countParams);
    const total = totalResult[0].total;

    res.json({
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.username, u.nickname, u.phone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在' });
    }

    const order = orders[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    order.items = items;

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.shipOrder = async (req, res) => {
  const { id } = req.params;
  const { tracking_number, tracking_company } = req.body;

  if (!tracking_number || !tracking_company) {
    return res.status(400).json({ error: '请提供物流单号和物流公司' });
  }

  try {
    const [orders] = await db.query('SELECT status FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: '订单不存在' });
    }
    if (orders[0].status !== 'paid') {
      return res.status(400).json({ error: '仅已支付订单可发货' });
    }

    await db.query(
      'UPDATE orders SET status = ?, tracking_number = ?, tracking_company = ? WHERE id = ?',
      ['shipped', tracking_number, tracking_company, id]
    );

    res.json({ message: '发货成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

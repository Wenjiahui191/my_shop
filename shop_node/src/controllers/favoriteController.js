const db = require('../config/db');

exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: 'product_id 必填' });
  }

  try {
    // 确认商品存在且上架
    const [products] = await db.query('SELECT id FROM products WHERE id = ? AND status = "on_shelf"', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: '商品不存在或未上架' });
    }

    await db.query(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, product_id],
    );

    res.status(201).json({ message: '已收藏' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '未找到收藏记录' });
    }

    res.json({ message: '已取消收藏' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.listFavorites = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(
      `SELECT f.product_id, p.name, p.price, p.image_url, p.status, p.description, p.category_id, f.created_at
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)],
    );

    const [countRows] = await db.query(
      'SELECT COUNT(*) as total FROM favorites WHERE user_id = ?',
      [userId],
    );

    res.json({
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countRows[0].total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.query;

  if (!product_id) {
    return res.status(400).json({ message: 'product_id 必填' });
  }

  try {
    const [rows] = await db.query(
      'SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1',
      [userId, product_id],
    );
    res.json({ liked: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};


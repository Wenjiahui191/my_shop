const db = require('../config/db');
const response = require('../utils/response');

exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return response.error(res, 'product_id 必填', 400);
  }

  try {
    // 确认商品存在且上架
    const [products] = await db.query('SELECT id FROM products WHERE id = ? AND status = "on_shelf"', [product_id]);
    if (products.length === 0) {
      return response.notFound(res, '商品不存在或未上架');
    }

    await db.query(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, product_id],
    );

    response.created(res, null, '已收藏');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
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
      return response.notFound(res, '未找到收藏记录');
    }

    response.success(res, null, '已取消收藏');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
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

    response.success(res, rows, '获取成功', 200, {
      total: countRows[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countRows[0].total / limit)
    });
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

exports.checkFavorite = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.query;

  if (!product_id) {
    return response.error(res, 'product_id 必填', 400);
  }

  try {
    const [rows] = await db.query(
      'SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1',
      [userId, product_id],
    );
    response.success(res, { liked: rows.length > 0 }, '获取成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

const db = require('../config/db');const response = require('../utils/response');

exports.getProducts = async (req, res) => {
  const { category_id, search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);
    
    // 查询总数用于分页
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    
    if (category_id) {
      countQuery += ' AND category_id = ?';
      countParams.push(category_id);
    }

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    response.success(res, products, '获取成功', 200, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('获取商品列表出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};
exports.createProduct = async (req, res) => {
  const { category_id, name, description, price, stock, image_url, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (category_id, name, description, price, stock, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, stock, image_url, status || 'on_shelf']
    );
    res.status(201).json({ id: result.insertId, message: '商品创建成功' });
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, price, stock, image_url, status } = req.body;
  try {
    await db.query(
      'UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, stock = ?, image_url = ?, status = ? WHERE id = ?',
      [category_id, name, description, price, stock, image_url, status, id]
    );
    response.success(res, null, '商品更新成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    response.success(res, null, '商品删除成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

exports.updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['on_shelf', 'off_shelf'].includes(status)) {
    return response.error(res, '状态不合法', 400);
  }
  try {
    await db.query('UPDATE products SET status = ? WHERE id = ?', [status, id]);
    response.success(res, null, '商品状态更新成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

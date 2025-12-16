const db = require('../config/db');

exports.createProduct = async (req, res) => {
  const { category_id, name, description, price, stock, image_url, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (category_id, name, description, price, stock, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, stock, image_url, status || 'on_shelf']
    );
    res.status(201).json({ id: result.insertId, message: '商品创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.json({ message: '商品更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: '商品删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['on_shelf', 'off_shelf'].includes(status)) {
    return res.status(400).json({ error: '状态不合法' });
  }
  try {
    await db.query('UPDATE products SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: '商品状态更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

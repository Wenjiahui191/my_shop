const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY sort_order ASC, created_at DESC');
    
    // Build tree structure
    const categoryMap = {};
    const tree = [];

    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent_id) {
        if (categoryMap[cat.parent_id]) {
          categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
        }
      } else {
        tree.push(categoryMap[cat.id]);
      }
    });

    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, parent_id, image_url, sort_order } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO categories (name, parent_id, image_url, sort_order) VALUES (?, ?, ?, ?)',
      [name, parent_id || null, image_url, sort_order || 0]
    );
    res.status(201).json({ id: result.insertId, message: '分类创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, parent_id, image_url, sort_order } = req.body;
  try {
    await db.query(
      'UPDATE categories SET name = ?, parent_id = ?, image_url = ?, sort_order = ? WHERE id = ?',
      [name, parent_id || null, image_url, sort_order || 0, id]
    );
    res.json({ message: '分类更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // 检查是否存在子分类
    const [subcats] = await db.query('SELECT id FROM categories WHERE parent_id = ?', [id]);
    if (subcats.length > 0) {
      return res.status(400).json({ error: '存在子分类，无法删除' });
    }

    // 检查是否关联商品
    const [products] = await db.query('SELECT id FROM products WHERE category_id = ?', [id]);
    if (products.length > 0) {
      return res.status(400).json({ error: '分类下存在商品，无法删除' });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: '分类删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

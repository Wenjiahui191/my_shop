const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY sort_order ASC');
    
    // 构建分类树
    const categoryMap = {};
    const tree = [];

    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
      } else {
        tree.push(categoryMap[cat.id]);
      }
    });

    res.json(tree);
  } catch (error) {
    console.error('获取分类出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  const { category_id, search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM products WHERE status = "on_shelf"';
    const params = [];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);
    
    // 查询总数用于分页
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE status = "on_shelf"';
    const countParams = [];
    
    if (category_id) {
      countQuery += ' AND category_id = ?';
      countParams.push(category_id);
    }
    
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取商品列表出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ message: '商品不存在' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('获取商品详情出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

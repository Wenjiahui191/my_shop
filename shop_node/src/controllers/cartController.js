const db = require('../config/db');

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  try {
    // 检查购物车是否已有该商品
    const [existing] = await db.query(
      'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existing.length > 0) {
      // 更新数量
      await db.query(
        'UPDATE carts SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      // 新增购物车商品
      await db.query(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      );
    }

    res.json({ message: '加入购物车成功' });
  } catch (error) {
    console.error('加入购物车出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [items] = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [user_id]
    );

    res.json(items);
  } catch (error) {
    console.error('获取购物车出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user.id;

  try {
    if (quantity <= 0) {
       await db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [id, user_id]);
       return res.json({ message: '购物车商品已移除' });
    }

    await db.query(
      'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, user_id]
    );

    res.json({ message: '购物车更新成功' });
  } catch (error) {
    console.error('更新购物车出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    await db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [id, user_id]);
    res.json({ message: '购物车商品已移除' });
  } catch (error) {
    console.error('删除购物车商品出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

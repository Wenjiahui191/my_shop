const db = require('../config/db');
const response = require('../utils/response');

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

    response.success(res, null, '加入购物车成功');
  } catch (error) {
    console.error('加入购物车出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};

exports.getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [items] = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.id, p.name, p.price, p.stock, p.image_url, p.created_at
       FROM carts c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [user_id]
    );

    // 格式化返回数据，包含完整的Product对象
    const formattedItems = items.map(item => ({
      id: item.id,
      user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      Product: {
        id: item.product_id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        stock: item.stock,
        created_at: item.created_at
      }
    }));

    response.success(res, formattedItems, '获取成功');
  } catch (error) {
    console.error('获取购物车出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};

exports.updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user.id;

  try {
    if (quantity <= 0) {
       await db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [id, user_id]);
       return response.success(res, null, '购物车商品已移除');
    }

    await db.query(
      'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, user_id]
    );

    response.success(res, null, '购物车更新成功');
  } catch (error) {
    console.error('更新购物车出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};

exports.removeCartItem = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    await db.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [id, user_id]);
    response.success(res, null, '购物车商品已移除');
  } catch (error) {
    console.error('删除购物车商品出错:', error);
    response.error(res, '服务器错误', 500, error);
  }
};

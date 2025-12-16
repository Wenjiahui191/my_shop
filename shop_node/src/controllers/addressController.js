const db = require('../config/db');

exports.addAddress = async (req, res) => {
  const { name, phone, province, city, district, detail, is_default } = req.body;
  const user_id = req.user.id;

  try {
    // 如果设置为默认地址，则取消其他默认地址
    if (is_default) {
      await db.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
        [user_id]
      );
    }

    const [result] = await db.query(
      'INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, name, phone, province, city, district, detail, is_default || false]
    );

    res.status(201).json({ 
      message: '地址添加成功', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('添加地址出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [user_id]
    );
    res.json(addresses);
  } catch (error) {
    console.error('获取地址列表出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const { name, phone, province, city, district, detail, is_default } = req.body;
  const user_id = req.user.id;

  try {
    if (is_default) {
      await db.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
        [user_id]
      );
    }

    await db.query(
      'UPDATE addresses SET name = ?, phone = ?, province = ?, city = ?, district = ?, detail = ?, is_default = ? WHERE id = ? AND user_id = ?',
      [name, phone, province, city, district, detail, is_default, id, user_id]
    );

    res.json({ message: '地址更新成功' });
  } catch (error) {
    console.error('更新地址出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, user_id]);
    res.json({ message: '地址删除成功' });
  } catch (error) {
    console.error('删除地址出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

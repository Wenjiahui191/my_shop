const db = require('../config/db');

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT id, username, phone, nickname, created_at FROM users';
    const params = [];

    if (search) {
      query += ' WHERE username LIKE ? OR phone LIKE ? OR nickname LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const countParams = [];

    if (search) {
      countQuery += ' WHERE username LIKE ? OR phone LIKE ? OR nickname LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [totalResult] = await db.query(countQuery, countParams);
    const total = totalResult[0].total;

    res.json({
      data: users,
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

exports.getUserById = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, phone, nickname, avatar_url, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

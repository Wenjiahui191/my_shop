const db = require('../config/db');
const response = require('../utils/response');

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

    response.success(res, users, '获取成功', 200, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, phone, nickname, avatar_url, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return response.notFound(res, '用户不存在');
    }
    response.success(res, users[0], '获取成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

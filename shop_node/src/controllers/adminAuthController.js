const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return response.error(res, '服务器未配置 JWT_SECRET', 500);
  }

  try {
    const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = admins[0];

    if (!admin) {
      return response.error(res, '账号或密码错误', 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return response.error(res, '账号或密码错误', 401);
    }

    const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, jwtSecret, {
      expiresIn: '24h',
    });

    response.success(res, { token }, '登录成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [admins] = await db.query('SELECT id, username, role, created_at FROM admins WHERE id = ?', [req.admin.id]);
    if (admins.length === 0) {
      return response.notFound(res, '管理员不存在');
    }
    response.success(res, admins[0], '获取成功');
  } catch (error) {
    response.error(res, '服务器错误', 500, error);
  }
};

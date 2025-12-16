const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ error: '服务器未配置 JWT_SECRET' });
  }

  try {
    const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = admins[0];

    if (!admin) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, jwtSecret, {
      expiresIn: '24h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [admins] = await db.query('SELECT id, username, role, created_at FROM admins WHERE id = ?', [req.admin.id]);
    if (admins.length === 0) {
      return res.status(404).json({ error: '管理员不存在' });
    }
    res.json(admins[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

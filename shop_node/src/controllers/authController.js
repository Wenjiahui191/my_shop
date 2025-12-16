const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const WECHAT_APPID = process.env.WECHAT_APPID;
const WECHAT_SECRET = process.env.WECHAT_SECRET;

exports.register = async (req, res) => {
  const { username, password, phone, nickname } = req.body;

  try {
// 检查用户是否存在
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ? OR phone = ?',
      [username, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '用户已存在' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户
    const [result] = await db.query(
      'INSERT INTO users (username, password, phone, nickname) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, phone, nickname]
    );

    const userId = result.insertId;

    // 生成令牌
    const token = jwt.sign({ id: userId, username }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: userId, username, phone, nickname }
    });
  } catch (error) {
    console.error('注册出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [
      username
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: '账号或密码错误' });
    }

    const user = users[0];

    // 校验密码
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: '账号或密码错误' });
    }

    // 生成令牌
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        nickname: user.nickname,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('登录出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, phone, nickname, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('获取用户信息出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

exports.wechatLogin = async (req, res) => {
  const { code, nickname, avatar_url } = req.body;

  if (!code) {
    return res.status(400).json({ message: '缺少微信登录 code' });
  }

  if (!WECHAT_APPID || !WECHAT_SECRET) {
    return res
      .status(500)
      .json({ message: '微信小程序配置缺失，请检查 WECHAT_APPID/WECHAT_SECRET' });
  }

  try {
    const wechatRes = await axios.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        params: {
          appid: WECHAT_APPID,
          secret: WECHAT_SECRET,
          js_code: code,
          grant_type: 'authorization_code'
        }
      }
    );

    const data = wechatRes.data;

    if (!data.openid) {
      return res
        .status(400)
        .json({ message: '微信登录失败', error: data.errmsg || '未知错误' });
    }

    const openid = data.openid;

    const [users] = await db.query('SELECT * FROM users WHERE openid = ?', [
      openid
    ]);

    let user;

    if (users.length === 0) {
      const [result] = await db.query(
        'INSERT INTO users (openid, nickname, avatar_url) VALUES (?, ?, ?)',
        [openid, nickname || '', avatar_url || '']
      );

      user = {
        id: result.insertId,
        username: null,
        phone: null,
        nickname: nickname || '',
        avatar_url: avatar_url || ''
      };
    } else {
      user = users[0];

      const nextNickname = nickname || user.nickname;
      const nextAvatar = avatar_url || user.avatar_url;

      if (nextNickname !== user.nickname || nextAvatar !== user.avatar_url) {
        await db.query(
          'UPDATE users SET nickname = ?, avatar_url = ? WHERE id = ?',
          [nextNickname, nextAvatar, user.id]
        );

        user.nickname = nextNickname;
        user.avatar_url = nextAvatar;
      }
    }

    const token = jwt.sign(
      { id: user.id, username: user.username || '' },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        nickname: user.nickname,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('微信登录出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

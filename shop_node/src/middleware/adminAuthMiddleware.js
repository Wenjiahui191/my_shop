const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未授权访问' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: '需要管理员权限' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: '令牌无效' });
  }
};

module.exports = adminAuthMiddleware;

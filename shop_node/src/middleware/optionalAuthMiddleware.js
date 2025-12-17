const jwt = require('jsonwebtoken');

// 可选的认证中间件：允许未登录访问，但如果提供了有效令牌则提取用户信息
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 未提供令牌，继续
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    // 令牌无效，继续
    req.user = null;
    next();
  }
};

module.exports = optionalAuthMiddleware;

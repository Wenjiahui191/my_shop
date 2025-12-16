const db = require('../config/db');
const redisClient = require('../config/redis');

exports.checkDbConnection = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({
      message: '数据库连接成功',
      result: rows[0].solution
    });
  } catch (error) {
    console.error('数据库连接错误:', error);
    res.status(500).json({
      message: '数据库连接失败',
      error: error.message
    });
  }
};

exports.checkRedisConnection = async (req, res) => {
  try {
    await redisClient.set('test_key', '你好 Redis');
    const value = await redisClient.get('test_key');
    res.json({
      message: 'Redis 连接成功',
      result: value
    });
  } catch (error) {
    console.error('Redis 连接错误:', error);
    res.status(500).json({
      message: 'Redis 连接失败',
      error: error.message
    });
  }
};

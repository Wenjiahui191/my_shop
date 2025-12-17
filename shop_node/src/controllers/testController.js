const db = require('../config/db');
const redisClient = require('../config/redis');
const response = require('../utils/response');

exports.checkDbConnection = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    response.success(res, { result: rows[0].solution }, '数据库连接成功');
  } catch (error) {
    console.error('数据库连接错误:', error);
    response.error(res, '数据库连接失败', 500, error);
  }
};

exports.checkRedisConnection = async (req, res) => {
  try {
    await redisClient.set('test_key', '你好 Redis');
    const value = await redisClient.get('test_key');
    response.success(res, { result: value }, 'Redis 连接成功');
  } catch (error) {
    console.error('Redis 连接错误:', error);
    response.error(res, 'Redis 连接失败', 500, error);
  }
};

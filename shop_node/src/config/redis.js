const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', (err) => {
  console.log('Redis 客户端错误', err);
});

client.on('connect', () => {
  console.log('Redis 客户端已连接');
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('连接 Redis 失败:', err);
  }
})();

module.exports = client;

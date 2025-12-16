const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`服务已启动，端口号 ${PORT}`);
});

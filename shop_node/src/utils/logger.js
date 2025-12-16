const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const logDir = path.resolve(__dirname, '..', '..', 'log');

// 生产环境确保日志目录存在，避免写入失败
if (isProd && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const levelMethodMap = {
  info: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

const getLogFilePath = () => {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(logDir, `${date}.log`);
};

const formatLine = (level, args) => {
  const timestamp = new Date().toISOString();
  const message = args
    .map((arg) => {
      if (arg instanceof Error) return arg.stack || arg.message;
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return '[Unserializable Object]';
        }
      }
      return String(arg);
    })
    .join(' ');
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

const writeToFile = (line) => {
  const filePath = getLogFilePath();
  fs.appendFile(filePath, `${line}\n`, (err) => {
    if (err) {
      // 写文件失败时退回控制台，避免静默错误
      console.error('写入日志文件失败', err);
    }
  });
};

const log = (level, ...args) => {
  const line = formatLine(level, args);

  if (isProd) {
    writeToFile(line);
    return;
  }

  const method = levelMethodMap[level] || console.log;
  method(line);
};

module.exports = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  debug: (...args) => log('debug', ...args),
  log,
};


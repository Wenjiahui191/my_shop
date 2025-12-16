const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('欢迎访问 Shop Node API');
});

// Import other routes here
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/products', productRoutes);

module.exports = app;

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '小程序商城后台 API 文档',
      version: '1.0.0',
      description: '微信小程序商城后台接口文档',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '开发环境服务器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // API 文档路径
};

const specs = swaggerJsdoc(options);

module.exports = specs;

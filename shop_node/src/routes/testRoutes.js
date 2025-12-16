const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/db-check', testController.checkDbConnection);
router.get('/redis-check', testController.checkRedisConnection);

module.exports = router;

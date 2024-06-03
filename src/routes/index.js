const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// Check APIkey
router.use(apiKey)

// Check permission
router.use(permission('0000'))

router.use('/v1/api', require('./access/index'));

module.exports = router;
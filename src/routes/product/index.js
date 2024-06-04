const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const catchAsync = require('../../helper/catchAsync');
const { authenticationV2 } = require('../../auth/authUtils');

// authentication
router.use(authenticationV2);

router.post('', catchAsync(productController.createProduct));

module.exports = router;
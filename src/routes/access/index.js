const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const catchAsync = require('../../helper/catchAsync');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

// sign up
router.post('/shop/signup', catchAsync(accessController.signUp));
router.post('/shop/login', catchAsync(accessController.login)); 

// authentication
router.use(authenticationV2);

router.post('/shop/logout', catchAsync(accessController.logout));
router.post('/shop/handlerRefreshToken', catchAsync(accessController.handlerRefreshToken));

module.exports = router;
// ES6
const ProductService = require('./../services/product.service');
const { OK, Created, SuccessResponse } = require('../core/success.response');
const { product } = require('../models/product.model');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse ({
      message: 'Create new product successfully!',
      metadata: await ProductService.createProduct(req.body.product_category, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
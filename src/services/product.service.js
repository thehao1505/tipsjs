const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model');

// Define Factory class to create products
class ProductFactory {
  static createProduct = async (category, payload) => {
    switch (category) {
      case 'Clothing':
        return new Clothing(payload).createProduct();
      case 'Electronics':
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError('Invalid product type!');
    }
  }
}

// Define Base Product class
class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_quantity, product_category, product_shop, product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_category = product_category;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// Define sub-class for different product categories
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Cannot create new clothing product!');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Cannot create new product!');

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });;
    if (!newElectronic) throw new BadRequestError('Cannot create new electronic product!');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Cannot create new product!');

    return newProduct;
  }
}

module.exports = ProductFactory;
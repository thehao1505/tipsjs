const e = require('express');
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true,
  },
  product_description: String,
  product_price: {
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_category: {
    type: String,
    required: true,
    enum: ['Clothing', 'Electronics', 'Furniture'],
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true,
  },  
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  size: String,
  material: String,
}, {
  collection: 'Clothes',
  timestamps: true,
});

const electronicSchema = new Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  model: String,
  color: String,
}, {
  collection: 'Electronic',
  timestamps: true,
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronics', electronicSchema),
};
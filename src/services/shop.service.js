const shopModel = require("../models/shop.models");

const findByEmail = async ({ email, select = {
  email: 1, password: 2, roles: 1, name: 1,
}}) => {
  return await shopModel.findOne({ email }).select(select).lean();
}

module.exports = {
  findByEmail,
};
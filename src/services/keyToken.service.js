const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // Level 0
      // // const publicKeyString = publicKey.toString();
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   // publicKey: publicKeyString,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // Level xxx
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken},
        options = { upsert: true, new: true};

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: Types.ObjectId(userId) });
  };

  static removeByUserId = async (id) => {
    return await keytokenModel.remove(id);
  };

  static findByRefreshTokensUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();;
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: Types.ObjectId(userId) });
  };
}

module.exports = KeyTokenService;

// All of commented code above is used for comparison purposes only.
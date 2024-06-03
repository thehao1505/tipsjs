const KeyTokenService = require("./keyToken.service");
const shopModels = require("../models/shop.models");
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static handlerRefreshToken = async (refreshToken) => {
    // Check xem token da duoc su dung chua
    const foundToken = await KeyTokenService.findByRefreshTokensUsed(refreshToken);
    console.log({ foundToken });
    // neu co
    if (foundToken) {
      // Decode token xem day la ai
      const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey);
      console.log({ userId, email });
      // Xoa tat ca token trong KeyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new BadRequestError('Token has been used. Please login again!');
    }

    // Neu chua
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError('Shop not found! Please sign up!');
    }

    // Verify Token
    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey);

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not found! Please sign up!');
    
    // Create token pair
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
    
    // Update refreshToken
    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // Used to create new token pair
      }
    })

    return {
      user: {userId, email},
      tokens,
    }
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeByUserId(keyStore._id);
    console.log({ delKey });
    return delKey;
  };
  /*
  *   1 - Check email exist
  *   2 - Compare password
  *   3 - Create AT và RT token + save
  *   4 - Generate token pair
  *   5 - Get data return login
  */
  static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError('Email not found');
    }

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Password incorrect'); 
    }

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const { _id: userId } = foundShop; 
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
  
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      userId,
      publicKey,
      privateKey,
    });

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens,
    }
  };

  static signUp = async ({ name, email, password }) => {
      const holderShop = await shopModels.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError('Email already exists');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModels.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // Created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex'); // const privateKey
        const publicKey = crypto.randomBytes(64).toString('hex');  // const publicKey
        
        // Save privateKey, publicKey to DB
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: 'xxxx',
            message: 'keyStore error',
          }
        }

        // Create token pair
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
            tokens,
          },
        }
      }

      return {
        code: 200,
        metadata: null,
      }
  }
}

module.exports = AccessService;
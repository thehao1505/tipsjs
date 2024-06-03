const JWT = require('jsonwebtoken');
const catchAsync = require('../helper/catchAsync');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // const accessToken = JWT.sign(payload, privateKey, {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2d' 
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7d' 
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(`errror verify::`, err);
      } else {
        console.log(`decoded::`, decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
}

const authentication = catchAsync(async (req, res, next) => {
  // 1. Check userId exist
  const userId = req.headers[HEADER.CLIENT_ID];
  console.log(req.headers, userId)
  if (!userId) throw new AuthFailureError('Invalid request!');

  // 2. Get accessToken from header
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore!');

  // 3. Verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request!');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid request!');

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }

  // 4. Check user in DB
  // 5. Check user's keyToken in DB
});

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
}
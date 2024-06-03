const { findByID } = require("../services/apikey.service");

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHOR: 'authorization',
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: 'Forbidden Error!' });
    }

    const objKey = await findByID(key);
    if (!objKey) {
      return res.status(403).json({ message: 'Forbidden Error!' });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ 
        message: 'Perrmission Denied!' 
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ 
        message: 'Perrmission Denied!' 
      });
    }

    return next();
  }
}

module.exports = {
  apiKey, permission
};
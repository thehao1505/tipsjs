// ES6
const AccessService = require('./../services/access.service');
const { OK, Created, SuccessResponse } = require('../core/success.response');

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    console.log(req.body.refreshToken)
    new SuccessResponse ({
      message: 'Get token successfully!',
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  }

  logout = async (req, res, next) => {
    new SuccessResponse ({
      message: 'Login successfully!',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }

  login = async (req, res, next) => {
    new SuccessResponse ({
      metadata: await AccessService.login(req.body),
    }).send(res);
  }

  signUp = async (req, res, next) => {
    new Created({
      message: 'Register successfully!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      }
    }).send(res);

    // return res.status(200).json(await AccessService.signUp(req.body));
  }
}

module.exports = new AccessController();
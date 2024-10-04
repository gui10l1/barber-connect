const ApiError = require("../errors/ApiError");

class BaseController {
  _handleBadRequestError(res, reason = '') {
    throw new ApiError(400, reason);
  }

  _getRequestUser(req) {
    return req.user;
  }
}

module.exports = BaseController;

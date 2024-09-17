const { decode } = require("jsonwebtoken");
const ApiError = require("../errors/ApiError");
const authConfig = require("../config/authConfig");
const User = require("../models/User");

async function ensureUserAuth(req, _, next) {
  const { authorization } = req.headers

  if (!authorization) throw new ApiError(403, 'Autorização inexistente');

  const [, token] = authorization.split(' ');

  if (!token) throw new ApiError(401, 'Autorização inexistente');

  try {
    const { user_id } = await decode(token, authConfig.secret);
    const user = await User.findOne({ where: { id: user_id } });

    req.user = user;

    next();
  } catch (err) {
    throw new ApiError(401, 'Autorização inválida!');
  }
}

module.exports = ensureUserAuth;

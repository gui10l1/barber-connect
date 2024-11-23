const { sign } = require("jsonwebtoken");
const ApiError = require("../../errors/ApiError");
const User = require("../../models/User");
const authConfig = require("../../config/authConfig");

class CreateSessionsService {
  _usersRepository;

  constructor() {
    this._usersRepository = User;
  }

  async execute(data) {
    const { email, password } = data;

    const user = await this._usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new ApiError(401, 'Email/senha incorreto(s)');
    }

    if (user.password !== password) {
      throw new ApiError(401, 'Email/senha incorreto(s)');
    }

    const token = sign({ user_id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = { token, user };

    return response;
  }
}

module.exports = CreateSessionsService;

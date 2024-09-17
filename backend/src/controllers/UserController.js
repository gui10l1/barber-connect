const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/authConfig");
const ApiError = require("../errors/ApiError");

class UserController {
  _handleBadRequestError(res, reason = '') {
    throw new ApiError(400, reason);
  }

  async _emailIsAvailable(email) {
    const emailInUse = await User.findOne({ where: { email } });

    return Boolean(!emailInUse);
  }

  async create(req, res) {
    const { name, email, password } = req.body;

    const emailIsAvailable = await this._emailIsAvailable(email);

    if (!emailIsAvailable) {
      return this._handleBadRequestError(
        res, 
        'Uma conta já está utilizando este email!'
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json(user);
  }

  async update(req, res) {
    const user = req.user;
    const data = req.body;

    if (data.email && data.email !== user.email) {
      const emailIsAvailable = await this._emailIsAvailable(data.email);

      if (!emailIsAvailable) {
        this._handleBadRequestError(
          res,
          'O email inserido está em uso por outra conta!',
        );
      }
    }

    const filterOption = { id: user.id };

    await User.update(data, { where: filterOption });

    const updatedUser = await User.findOne(filterOption);

    return res.json(updatedUser);
  }

  async createSession(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      this._handleBadRequestError(
        res,
        'Email/senha incorreto(s)',
      );
    }

    if (user.password !== password) {
      this._handleBadRequestError(
        res,
        'Email/senha incorreto(s)',
      );
    }

    const token = sign({ user_id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = { token, user };

    return res.status(200).json(response);
  }
}

module.exports = UserController;

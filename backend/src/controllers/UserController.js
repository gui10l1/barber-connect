const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/authConfig");
const BaseController = require("./BaseController");

class UserController extends BaseController {
  constructor() {
    super();
  }

  async _emailIsAvailable(email) {
    const emailInUse = await User.findOne({ where: { email } });

    return Boolean(!emailInUse);
  }

  async createBarbers(req, res) {
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
      access: 2,
    });

    return res.status(201).json(user);
  }

  async createClients(req, res) {
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
    const user = this._getRequestUser(req);
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

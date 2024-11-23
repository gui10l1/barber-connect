const ApiError = require("../../errors/ApiError");
const User = require("../../models/User");

class CreateBarbersService {
  _usersRepository;

  constructor() {
    this._usersRepository = User;
  }

  async _emailIsAvailable(email) {
    const emailInUse = await this._usersRepository.findOne({ where: { email } });

    return Boolean(!emailInUse);
  }

  async execute(data) {
    const { name, email, password } = data;

    const emailIsAvailable = await this._emailIsAvailable(email);

    if (!emailIsAvailable) {
      throw new ApiError(400, 'Uma conta já está utilizando este email!');
    }

    const user = await this._usersRepository.create({
      name,
      email,
      password,
      access: 2,
    });

    return user;
  }
}

module.exports = CreateBarbersService;

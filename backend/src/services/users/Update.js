const ApiError = require("../../errors/ApiError");
const User = require("../../models/User");

class UpdateUsersService {
  _usersRepository;

  constructor() {
    this._usersRepository = User;
  }

  async _emailIsAvailable(email) {
    const emailInUse = await this._usersRepository.findOne({ where: { email } });

    return Boolean(!emailInUse);
  }

  async execute(user, data) {
    if (data.email && data.email !== user.email) {
      const emailIsAvailable = await this._emailIsAvailable(data.email);

      if (!emailIsAvailable) {
        throw new ApiError(
          400,
          'O email inserido está em uso por outra conta!',
        );
      }
    }

    if (data.password && !data.currentPassword) {
      throw new ApiError(
        400,
        'Para atualizar sua senha, forneça a atual!',
      );
    }

    if (data.password) {
      const currentPasswordMatch = data.currentPassword === user.password;

      if (!currentPasswordMatch) {
        throw new ApiError(
          400,
          'A senha atual não está correta!'
        );
      }
    }

    const filterOption = { id: user.id };

    await this._usersRepository.update(data, { where: filterOption });

    const updatedUser = await this._usersRepository.findOne(filterOption);

    return updatedUser;
  }
}

module.exports = UpdateUsersService;

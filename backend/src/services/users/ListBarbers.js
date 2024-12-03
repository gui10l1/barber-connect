const User = require("../../models/User");

class ListBarbersService {
  _usersRepository;

  constructor() {
    this._usersRepository = User;
  }

  async execute() {
    const barbers = await this._usersRepository.findAll({
      where: { access: 2 },
    });

    return barbers;
  }
}

module.exports = ListBarbersService;

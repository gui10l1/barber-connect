const User = require("../../models/User");

class FindUsersService {
  _usersRepository;

  constructor() {
    this._usersRepository = User;
  }

  async execute({ id }) {
    const user = await this._usersRepository.findOne({ where: { id } });

    return user;
  }
}

module.exports = FindUsersService;

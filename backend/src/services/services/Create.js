const ApiError = require("../../errors/ApiError");
const Service = require("../../models/Service");

class CreateServicesService {
  _servicesRepository;

  constructor() {
    this._servicesRepository = Service;
  }

  async execute(user, data) {
    const { name, price } = data;

    if (user.access !== 2) {
      throw new ApiError(400, 'Apenas barbeiros podem criar serviços!')
    }

    const service = await this._servicesRepository.create({
      name,
      price,
      user_id: user.id,
    });

    return service;
  }
}

module.exports = CreateServicesService;

const ApiError = require("../../errors/ApiError");
const Service = require("../../models/Service");

class FindServicesService {
  _servicesRepository;

  constructor() {
    this._servicesRepository = Service;
  }

  async execute({ id }) {
    const service = await this._servicesRepository.findOne({ where: { id: id } });

    if (!service) {
      throw new ApiError(
        400,
        "Não foi possível encontrar o servido informado!"
      );
    }

    return service;
  }
}

module.exports = FindServicesService;

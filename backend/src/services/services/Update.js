const ApiError = require("../../errors/ApiError");
const Service = require("../../models/Service");

class UpdateServicesService {
  _servicesRepository;

  constructor() {
    this._servicesRepository = Service;
  }

  async execute(user, data) {
    const { id, name, price } = data;

    const service = await this._servicesRepository.findOne({ where: { id } });

    if (!service) {
      throw new ApiError(
        400,
        "Não foi possível encontrar o servido informado para atualizar!"
      );
    }

    if (service.user_id !== user.id) {
      throw new ApiError(
        403,
        "Você não tem autorização para atualizar esse serviço!",
      );
    }

    await this._servicesRepository.update({ name, price }, { where: { id: service.id } });

    const updatedService = await this._servicesRepository.findOne({ where: { id } });

    return updatedService;
  }
}

module.exports = UpdateServicesService;

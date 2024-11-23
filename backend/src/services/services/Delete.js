const ApiError = require("../../errors/ApiError");
const Service = require("../../models/Service");

class DeleteServicesService {
  _servicesRepository;

  constructor() {
    this._servicesRepository = Service;
  }

  async execute(user, id) {
    const service = await this._servicesRepository.findOne({ where: { id } });

    if (!service) {
      throw new ApiError(
        400,
        "Não foi possível encontrar o servido informado para deletar!"
      );
    }

    if (service.user_id !== user.id) {
      throw new ApiError(
        403,
        "Você não tem autorização para deletar esse serviço!",
      );
    }

    await this._servicesRepository.destroy({ where: { id: service.id } });
  }
}

module.exports = DeleteServicesService;

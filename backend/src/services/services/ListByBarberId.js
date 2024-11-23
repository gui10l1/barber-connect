const Service = require("../../models/Service");

class ListServicesByBarberIdService {
  _servicesRepository;

  constructor() {
    this._servicesRepository = Service;
  }

  async execute({ barberId }) {
    const services = await this._servicesRepository.findAll({
      where: { user_id: barberId },
    });

    return services || [];
  }
}

module.exports = ListServicesByBarberIdService;

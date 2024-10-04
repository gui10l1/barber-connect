const ApiError = require("../errors/ApiError");
const Service = require("../models/Service");
const BaseController = require("./BaseController");

class ServicesController extends BaseController {
  constructor() {
    super();
  }

  async create(req, res) {
    const user = this._getRequestUser(req);
    const { name, price } = req.body;

    if (user.access !== 2) {
      throw new ApiError(400, 'Apenas barbeiros podem criar serviços!')
    }

    const service = await Service.create({
      name,
      price,
      user_id: user.id,
    });

    return res.json(service);
  }

  async list(req, res) {
    const { barberId } = req.params;

    const services = await Service.findOne({
      where: { user_id: barberId },
    });

    return res.json(services || []);
  }

  async find(req, res) {
    const { id } = req.params;

    const service = await Service.findOne({ where: { id: id } });

    if (!service) {
      throw new ApiError(
        400,
        "Não foi possível encontrar o servido informado!"
      );
    }

    return res.json(service);
  }

  async update(req, res) {
    const user = this._getRequestUser(req);
    const { id } = req.params;
    const { name, price } = req.body;

    const service = await Service.findOne({ where: { id } });

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

    await Service.update({ name, price }, { where: { id: service.id } });

    const updatedService = await Service.findOne({ where: { id } });

    return res.json(updatedService);
  }

  async delete(req, res) {
    const user = this._getRequestUser(req);
    const { id } = req.params;

    const service = await Service.findOne({ where: { id } });

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

    await Service.destroy({ where: { id: service.id } });

    return res.send();
  }
}

module.exports = ServicesController;

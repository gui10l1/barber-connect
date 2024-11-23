const CreateServicesService = require("../services/services/Create");
const DeleteServicesService = require("../services/services/Delete");
const FindServicesService = require("../services/services/Find");
const ListServicesByBarberIdService = require("../services/services/ListByBarberId");
const UpdateServicesService = require("../services/services/Update");
const BaseController = require("./BaseController");

class ServicesController extends BaseController {
  constructor() {
    super();
  }

  async create(req, res) {
    const user = this._getRequestUser(req);

    const service = new CreateServicesService();

    const serviceInc = await service.execute(user, req.body);

    return res.json(serviceInc);
  }

  async list(req, res) {
    const { barberId } = req.params;

    const service = new ListServicesByBarberIdService();
    const services = await service.execute({ barberId });

    return res.json(services);
  }

  async find(req, res) {
    const { id } = req.params;

    const service = new FindServicesService();

    const serviceInc = await service.execute({ id });

    return res.json(serviceInc);
  }

  async update(req, res) {
    const user = this._getRequestUser(req);
    const { id } = req.params;
    const { name, price } = req.body;

    const service = new UpdateServicesService();

    const updatedService = await service.execute(user, { id, name, price });

    return res.json(updatedService);
  }

  async delete(req, res) {
    const user = this._getRequestUser(req);
    const { id } = req.params;

    const service = new DeleteServicesService();

    await service.execute(user, id);

    return res.send();
  }
}

module.exports = ServicesController;

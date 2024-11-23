const BaseController = require("./BaseController");
const CreateBarbersService = require("../services/users/CreateBarber");
const CreateClientsService = require("../services/users/CreateClient");
const UpdateUsersService = require("../services/users/Update");
const CreateSessionsService = require("../services/sessions/Create");
const ListBarbersService = require("../services/users/ListBarbers");
const FindUsersService = require("../services/users/Find");

class UserController extends BaseController {
  constructor() {
    super();
  }

  async createBarbers(req, res) {
    const service = new CreateBarbersService();

    const user = await service.execute(req.body);

    return res.status(201).json(user);
  }

  async createClients(req, res) {
    const service = new CreateClientsService();

    const user = await service.execute(req.body);

    return res.status(201).json(user);
  }

  async update(req, res) {
    const user = this._getRequestUser(req);
    const data = req.body;

    const service = new UpdateUsersService();

    const updatedUser = await service.execute(user, data);

    return res.json(updatedUser);
  }

  async createSession(req, res) {
    const { email, password } = req.body;

    const service = new CreateSessionsService();

    const response = await service.execute({ email, password });

    return res.status(200).json(response);
  }

  async listBarbers(_, res) {
    const service = new ListBarbersService();

    const barbers = await service.execute();

    return res.json(barbers);
  }

  async find(req, res) {
    const { id } = req.params;

    const service = new FindUsersService();

    const user = await service.execute({ id });

    return res.json(user);
  }
}

module.exports = UserController;

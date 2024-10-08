const { Op } = require("sequelize");
const ApiError = require("../errors/ApiError");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const User = require("../models/User");
const BaseController = require("./BaseController");
const { format } = require('date-fns');

class AppointmentsController extends BaseController {
  constructor() {
    super();
  }

  _getHourFromString(string) {
    const [hour, minutes] = string.split(':').map(Number);
    const hoursAsMinutes = hour * 60;

    return minutes + hoursAsMinutes;
  }

  _parseStringDateToCorrectFormat(string) {
    const [day, month, year] = string.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDate = format(date, 'yyyy-MM-dd');

    return formattedDate
  }

  async create(req, res) {
    const user = this._getRequestUser(req);
    const { service: serviceId, time, date } = req.body;

    const service = await Service.findOne({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      throw new ApiError(
        400,
        'Serviço não encontrado',
      );
    }

    if (service.user_id === user.id) {
      throw new ApiError(400, 'Você não pode cortar seu próprio cabelo!');
    }

    const hour = this._getHourFromString(time);
    const parsedDate = this._parseStringDateToCorrectFormat(date);

    const appointment = await Appointment.create({
      user_id: service.user_id,
      client_id: user.id,
      service_id: service.id,
      date: parsedDate,
      hour,
    });

    return res.json(appointment);
  }

  async listBarberAppointments(req, res) {
    const user = this._getRequestUser(req);
    const { date } = req.params;
    const now = Number(req.query.now);
    const hourString = format(now, 'HH:mm');
    const nowString = format(now, 'yyyy-MM-dd');

    if (user.access !== 2) {
      throw new ApiError(400, 'Você não possui agendamentos pois não é um barbeiro!');
    }

    const hour = this._getHourFromString(hourString);

    const filters = {
      where: {
        user_id: user.id,
        date,
      },
    };

    if (nowString === date) filters.where.hour = { [Op.gt]: hour };

    const appointments = await Appointment.findAll(filters);

    const parsedAppointments = await Promise.all(
      appointments.map(async appointment => {
        const [client, service] = await Promise.all([
          await User.findOne({ where: { id: appointment.client_id } }),
          await Service.findOne({ where: { id: appointment.service_id } }),
        ]);

        appointment.client = client;
        appointment.service = service;

        return {
          service,
          client,
          date: appointment.date,
          hour: appointment.hour,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        }
      }),
    );

    return res.json(parsedAppointments);
  }
}

module.exports = AppointmentsController;

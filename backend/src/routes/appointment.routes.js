const { Router } = require("express");
const AppointmentsController = require("../controllers/AppointmentsController");
const ensureUserAuth = require("../middleware/ensureUserAuth");
const { celebrate, Segments, Joi } = require("celebrate");

const appointmentRoutes = Router();
const appointmentsController = new AppointmentsController();

appointmentRoutes.use(ensureUserAuth);

appointmentRoutes.get(
  "/stats",
  appointmentsController.getStats.bind(appointmentsController)
);
appointmentRoutes.get(
  "/clients/:date",
  celebrate({
    [Segments.PARAMS]: {
      date: Joi.string().required(),
    },
  }),
  appointmentsController.listClientScheduledAppointments.bind(
    appointmentsController
  )
);
appointmentRoutes.get(
  "/barbers/:barberId/schedule",
  celebrate({ [Segments.PARAMS]: { barberId: Joi.number().required() } }),
  appointmentsController.listBarberAvailableHours.bind(appointmentsController)
);
appointmentRoutes.get(
  "/barbers/:date",
  celebrate({
    [Segments.PARAMS]: {
      date: Joi.string()
        .required()
        .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
    },
  }),
  appointmentsController.listBarberAppointments.bind(appointmentsController)
);
appointmentRoutes.get(
  "/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  appointmentsController.find.bind(appointmentsController)
);

appointmentRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      service: Joi.number().required(),
      time: Joi.string()
        .required()
        .regex(/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/),
      date: Joi.string()
        .required()
        .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
    },
  }),
  appointmentsController.create.bind(appointmentsController)
);

module.exports = appointmentRoutes;

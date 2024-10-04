const { Router } = require("express");
const userRoutes = require("./user.routes");
const serviceRoutes = require("./service.routes");
const appointmentRoutes = require("./appointment.routes");

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/services', serviceRoutes);
routes.use('/appointments', appointmentRoutes);

module.exports = routes;

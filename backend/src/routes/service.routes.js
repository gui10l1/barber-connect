const { Router } = require("express");
const ServicesController = require("../controllers/ServicesController");
const ensureUserAuth = require("../middleware/ensureUserAuth");
const { celebrate, Segments, Joi } = require("celebrate");

const serviceRoutes = Router();
const servicesController = new ServicesController();

serviceRoutes.use(ensureUserAuth);

serviceRoutes.get(
  "/barbers/:barberId",
  celebrate({
    [Segments.PARAMS]: {
      barberId: Joi.number().required(),
    },
  }),
  servicesController.list.bind(servicesController)
);

serviceRoutes.get(
  "/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  servicesController.find.bind(servicesController)
);

serviceRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
    },
  }),
  servicesController.create.bind(servicesController)
);

serviceRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      price: Joi.number(),
    },
  }),
  servicesController.update.bind(servicesController)
);

serviceRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  servicesController.delete.bind(servicesController)
);

module.exports = serviceRoutes;

const { Router } = require("express");
const UserController = require("../controllers/UserController");
const ensureUserAuth = require("../middleware/ensureUserAuth");
const { celebrate, Segments, Joi } = require("celebrate");

const userRoutes = Router();
const userController = new UserController();

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    },
  }),
  userController.create.bind(userController),
);
userRoutes.post(
  '/session',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    },
  }),
  userController.createSession.bind(userController)
);

userRoutes.put(
  '/',
  ensureUserAuth,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
    }
  }),
  userController.update.bind(userController)
);

module.exports = userRoutes;

const Sequelize = require("sequelize");
const database = require("../database");

const Appointment = database.define('appointments', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  client_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  service_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hour: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Appointment;

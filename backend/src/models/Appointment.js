const Sequelize = require("sequelize");
const database = require("../database");
const User = require("./User");
const Service = require("./Service");

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
  unix_date: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

Appointment.belongsTo(User, { foreignKey: 'user_id' });
Appointment.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Appointment.hasOne(Service, { foreignKey: 'id', as: 'service' });

module.exports = Appointment;

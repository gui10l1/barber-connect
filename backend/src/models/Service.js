const Sequelize = require("sequelize");
const database = require("../database");

const Service = database.define('services', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    scale: 2,
    precision: 8
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = Service;

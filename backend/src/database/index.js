const Sequelize = require('sequelize');
const path = require('path');

const databaseFilePath = path.resolve('database.sqlite');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: databaseFilePath,
  logging: false,
});

module.exports = database;

process.env.TZ = 'America/Sao_Paulo';

require('reflect-metadata');
require('dotenv/config');
require('express-async-errors');

const express = require('express');
const database = require('./database');
const ApiError = require('./errors/ApiError');
const routes = require('./routes/index.routes');
const { errors } = require('celebrate');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);
app.use(errors());
app.use((error, _, res, __) => {
  if (error instanceof ApiError) {
    return res.status(error.code).json({
      type: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    type: 'error',
    message: 'Erro interno do servidor',
  });
});

database.sync(() => console.log(`💾 Database connected`));

module.exports = app;

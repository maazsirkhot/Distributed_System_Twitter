import config from '../../../config';

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database.name,
  config.database.user,
  config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

sequelize
  .authenticate()
  .then(() => {
    // console.log('MySQL Connected');
  })
  .catch((err) => {
    // console.error('Unable to connect to the mysql database:', err);
  });

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;

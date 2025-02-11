'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const mysql = require('mysql');
const mssql = require('mssql');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const envsql = process.env.NODE_SQL || 'sqlServer';
const envsqlhis2 = process.env.NODE_SQL_HIS2 || 'sqlServerHis2';
const config = require(__dirname + '/../config/config.json')[env];
const configsql = require(__dirname + '/../config/config.json')[envsql];
const configsqlhis2 = require(__dirname + '/../config/config.json')[envsqlhis2];

const db = {};

let sequelize;
let sqlConnection;
let sqlhis2Connection;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sqlConnection = new mssql.ConnectionPool({
  user: configsql.username,
  password: configsql.password,
  server: configsql.server,
  database: configsql.database,
  options: {
    enableArithAbort: false
  }
})

sqlConnection.connect(err => {
  if (err) {
    console.error('Error connecting to SQL Server:', err);
    return;
  }
  console.log('Connected to SQL Server');
})

sqlhis2Connection = new mssql.ConnectionPool({
  user: configsqlhis2.username,
  password: configsqlhis2.password,
  server: configsqlhis2.server,
  database: configsqlhis2.database,
  options: {
    enableArithAbort: false
  }
})

sqlhis2Connection.connect(err => {
  if (err) {
    console.error('Error connecting to SQL Server His 2:', err);
    return;
  }
  console.log('Connected to SQL Server eHospital');
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Thêm kết nối với SQL Server vào db object
db.sqlConnection = sqlConnection;
db.sqlhis2Connection = sqlhis2Connection;
module.exports = db;

const path = require('path')
const config = require(path.resolve(__dirname, '..', 'config', 'index'));
const Sequelize = require('sequelize');

//  MySQL
const sequelize = new Sequelize(
  config.get("mysql:database"), config.get("mysql:user"), config.get("mysql:password"),
  {
    //logging: env === 'dev' ? true : false,
    logging: false,
    host: config.get("mysql:host"),
    port: config.get("mysql:port"),
    dialect: 'mysql'
  });

module.exports = sequelize;
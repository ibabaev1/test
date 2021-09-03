var nconf = require('nconf')
var path = require('path')

nconf
  .argv()
  .env();
let env = process.env.NODE_ENV || 'dev';

nconf
  .file({file: path.join(__dirname, env + '.app.config.json')}) //TODO exception if file not exists

module.exports = nconf
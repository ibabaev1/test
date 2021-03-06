#!/usr/bin/env node

/**
 * Module dependencies.
 */

const path = require('path')
  ,baseDir = path.dirname(__dirname);

const express = require('./express')
  ,http = require('http')
  ,fs = require('fs')
  ,app = require(path.resolve(baseDir, 'app'))

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '4000');
if(typeof port === 'string') {
  fs.unlinkSync(port); // NOTE: что тут удаляется?
}
express.set('port', port); // NOTE: normalizePort может вернуть false

/**
 * Create HTTP server.
 */

// NOTE: зачем вручную создавать сервер, express сам умеет это делать
const server = http.createServer(express);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);

/**
 * Normalize a port into a number, string, or false.
 */

// NOTE: зачем возвращать порт, когда это не число или оно отрицательное?
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

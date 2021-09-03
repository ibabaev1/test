const express = require('express')
  //,bodyParser = require('body-parser')
  ,logger = require('morgan')
  ,fs = require('fs')
  ,path = require('path')
  ,app = express()

app.use(logger('dev'));

// Routes

const routesFolder = path.resolve(path.dirname(`${__dirname}`), 'routes')
fs.readdirSync(routesFolder).forEach(file => {
  if( file.substr(-3) === '.js' )
  {
    file = file.substring(0, file.indexOf('.'));
    app.use(file === 'index' ? '/' : '/'+file, require(routesFolder + path.sep + file));
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
});

module.exports = app;

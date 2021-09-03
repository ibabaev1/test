const path = require('path'),
  ratesController = require(path.resolve(__dirname, '..', 'controllers', 'rates')),
  router = require('express').Router()

router.get('/rates', ratesController);

module.exports = router
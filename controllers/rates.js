const path = require('path')
  ,fs = require('fs')
  ,Rates = require(path.resolve(__dirname, '..', 'models', 'rates'));

module.exports = async (req, res, next) => {
  let from = req.query.from || null,
    to = req.query.to || null
  const provider = req.query.provider || null

  if(!from || !to ||!provider ) {
    res.status(400).send('Bad request')
    return
  }

  //the first - get rates from remote. If service is unavaliable - then from db
  const providerConfigFile = path.resolve(__dirname, '..', 'config', 'sources', provider + '.json')
  if(!fs.existsSync(providerConfigFile)) {
    res.status(200).send('Provider not found')
  }
  const providerConfig = JSON.parse(fs.readFileSync(providerConfigFile))
    ,handlersFolder = path.resolve(__dirname, '..', 'lib', 'handlers')
    ,data = await require(path.resolve(handlersFolder, providerConfig.handler+'.js')).call(null, providerConfig, {from, to});
  if(data) { //Remote data available
    res.json(data)
  }
  else { // from DB
    res.json(await Rates.getRates(from.split(','), to.split(','), provider))
  }
}
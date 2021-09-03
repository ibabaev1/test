const path = require('path')
  ,fs = require('fs')
  ,Providers = require(path.resolve(__dirname, '..', 'models', 'providers'))
  ,Rates = require(path.resolve(__dirname, '..', 'models', 'rates'))

class Grabber {

  sources = []
  handlersFolder
  providersCache = {}

  constructor() {
    const configFolder = path.resolve(__dirname, '..', 'config', 'sources')
    this.handlersFolder = path.resolve(__dirname, '..', 'lib', 'handlers')

    fs.readdirSync(configFolder).forEach(file => {
      if( file.substr(-5) === '.json' )
      {
        const fullPath = path.resolve(configFolder, file)
          ,sourceName = file.substr(0, file.indexOf('.json'))
        const source = {}
        source[sourceName] = JSON.parse(fs.readFileSync(fullPath))
        this.sources.push(source)
      }
    })

    if(this.sources.length > 0)
      this.run()
        .then()

  }

  async run() {
    for(const k in this.sources) {
      const providerName = Object.keys(this.sources[k])[0]
        ,params = this.sources[k][providerName]

      //TODO need to check that handler exists and this is a callable and treatment if not
      const wrapper = async () => {
        const dataToSave = await require(path.resolve(this.handlersFolder, params.handler+'.js')).call(null, params);
        if(dataToSave && typeof dataToSave === 'object' && dataToSave.length > 0) {
          //console.log(dataToSave)
          await this.saveRates(providerName, dataToSave)
        }
      }

      await wrapper()
      setInterval( async () => {
        await wrapper()
      }, params.time * 1000)
    }
  }

  async saveRates(providerName, rates) {
    if(!this.providersCache.hasOwnProperty(providerName)) {
      let provider = await Providers.findOne({where: {name: providerName}})
      if(!provider) {
        provider = Providers.create({
          name: providerName
        })
      }
      this.providersCache[providerName] = JSON.parse(JSON.stringify(provider))
    }

    Object.entries(rates).forEach(([k, rateData]) => {

      //TODO need to validate data before save and exception (or something else ...) then they are not valid

      Rates.create({
        from: rateData.from,
        to: rateData.to,
        rate: rateData.rate.toString(),
        lastupdate: rateData.lastupdate || null,
        providerId: this.providersCache[providerName].id
      })
        .then()
        .catch(err => {
          // TODO something need to do here ...
          console.log(err)
        })
    })
  }
}

module.exports = Grabber

const axios = require('axios')

const url = 'https://min-api.cryptocompare.com/data/pricemultifull';


module.exports = function(params, fromRequest) {

  if(fromRequest && fromRequest.from && fromRequest.to) {
    params.fsyms = fromRequest.from.split(',')
    params.tsyms = fromRequest.to.split(',')
  }

  return axios.get(url, {
    params: {
      fsyms: params.fsyms.join(","),
      tsyms: params.tsyms.join(",")
    }
  })
    .then( response => {
      if(response.status === 200) {
        const recievedData = []
        const data = response.data.RAW
        for(const fsyms of Object.keys(data))
        {
          for(const tsyms of Object.keys(data[fsyms]))
          {
            // console.log(`${fsyms} - ${tsyms}: ${JSON.stringify(data[fsyms][tsyms])}`)
            recievedData.push({
              from: data[fsyms][tsyms].FROMSYMBOL,
              to: data[fsyms][tsyms].TOSYMBOL,
              rate: data[fsyms][tsyms].PRICE,
              lastupdate: data[fsyms][tsyms].LASTUPDATE
            })
          }
        }
        return recievedData
      }
    })
    .catch( error => {
      //TODO something
    })
}
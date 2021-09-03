( async ()=>{
  const path = require('path')
  new (require(path.resolve(__dirname, 'lib', 'grabber')))()
})()
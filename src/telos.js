require('dotenv').config()

const SenecaWeb = require('seneca-web')
const Express = require('express')
const Router = Express.Router
const context = new Router()

const app = Express()
  .use(require('body-parser').json())
  .use(context)
  .listen(process.env.PORT)

const eosOptions = {
  params: {
    serviceAccount: process.env.SERVICE_ACCOUNT,
    bytesAmount: '10000',
    netAmount: '1.0000',
    cpuAmount: '1.0000'
  },
  config: {
    keyProvider: process.env.SERVICE_PRIVATE_KEY,
    httpEndpoint: 'https://testnet.telos.caleos.io:443',
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    keyPrefix: 'TLOS'
  }
}

const seneca = require('seneca')({ debug: { undead: true } })
  .use(SenecaWeb, {
    context: context,
    adapter: require('seneca-web-adapter-express'),
    options: { parseBody: false }
  })
  .use(require('./modules/eos.js'), eosOptions)
  .use(require('./api/freeAPI.js'))

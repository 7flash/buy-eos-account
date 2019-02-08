require('dotenv').config()

const SenecaWeb = require('seneca-web')
const Express = require('express')
const Router = Express.Router
const context = new Router()
const cors = require('cors');

const app = Express()
  .use(require('body-parser').json())
  .use(cors({ origin: '*' }))
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
    httpEndpoint: 'https://api-test.telosfoundation.io:443',
    chainId: 'e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3',
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

const mock = require('mock-require')

const chai = require('chai')
chai.use(require('chai-spies'))
const expect = chai.expect

const txMock = {
  newaccount: chai.spy(),
  buyrambytes: chai.spy(),
  delegatebw: chai.spy()
}

mock('eosjs', function EOS() {
  return {
    transaction: (fn) => {
      fn(txMock)
      return Promise.resolve({ transaction_id: '0x123' })
    }
  }
})

const httpEndpoint = 'https://testnet.telos.caleos.io:443	'
const chainId = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'

const options = {
  params: {
    serviceAccount: 'sevenflash11',
    bytesAmount: '10000',
    netAmount: '100.0000',
    cpuAmount: '100.0000'
  },
  config: {
    keyProvider: '',
    httpEndpoint: httpEndpoint,
    chainId: chainId,
  }
}

const init = (done) => {
  return require('seneca')()
    .test(done)
    .use(require('../src/modules/eos.js'), options)
}

const accountName = 'tlos3vxfpgec'
const publicKey = 'TLOS6J2765xNSyjNi26QHPrj851FKYxuy88jE37ZWaCeLuQmtv9Lwn'

describe('eos microservice', function() {
  this.timeout(42000)

  it('should create an account', (done) => {
    const seneca = init(done)
    seneca.act({ role: 'eos', cmd: 'createAccount' }, { accountName, publicKey }, (err, result) => {
      expect(result.transaction_id).to.be.equal('0x123')
      expect(txMock.newaccount).to.have.been.called()
      expect(txMock.buyrambytes).to.have.been.called()
      expect(txMock.delegatebw).to.have.been.called()
      done()
    })
  })
})

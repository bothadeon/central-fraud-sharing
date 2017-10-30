'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Glue = require('glue')
const P = require('bluebird')
const Manifest = require('../../src/manifest')
const Logger = require('@mojaloop/central-services-shared').Logger

Test('server test', serverTest => {
  let sandbox

  serverTest.beforeEach(t => {
    sandbox = Sinon.sandbox.create()
    sandbox.stub(Glue, 'compose')
    sandbox.stub(Logger, 'info')
    sandbox.stub(Logger, 'error')

    t.end()
  })

  serverTest.afterEach(t => {
    delete require.cache[require.resolve('../../src/server')]
    sandbox.restore()
    t.end()
  })

  serverTest.test('setup should', setupTest => {
    setupTest.test('run all actions', test => {
      let serverUri = 'http://localhost'
      let serverStub = sandbox.stub()
      serverStub.returns(P.resolve({}))
      let server = {
        start: serverStub,
        info: {
          uri: serverUri
        }
      }

      Glue.compose.returns(Promise.resolve(server))

      require('../../src/server')
        .then(() => {
          test.ok(Glue.compose.calledWith(Manifest))
          test.ok(Glue.compose.calledBefore(serverStub))
          test.ok(serverStub.calledOnce)
          test.ok(Logger.info.calledWith(`Server running at: ${serverUri}`))
          test.end()
        })
    })

    setupTest.test('Log error on start', test => {
      let error = new Error()
      Glue.compose.returns(P.reject(error))

      require('../../src/server')
        .then(() => {
          test.fail('Expected exception to be thrown')
          test.end()
        })
        .catch(e => {
          test.equal(e, error)
          test.ok(Logger.error.calledWith(e))
          test.end()
        })
    })
    setupTest.end()
  })

  serverTest.end()
})

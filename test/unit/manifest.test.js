'use strict'

const Test = require('tapes')(require('tape'))
const Config = require('../../src/lib/config')
const Manifest = require('../../src/manifest')

Test('manifest', manifestTest => {
  manifestTest.test('connections should', connectionsTest => {
    connectionsTest.test('have server section', test => {
      test.ok(Manifest.server)
      test.end()
    })

    connectionsTest.test('have one connection with configured port', test => {
      test.equal(Manifest.server.port, Config.PORT)
      test.deepEqual(Manifest.server.routes.validate.failAction(), {})
      test.end()
    })

    connectionsTest.end()
  })

  manifestTest.test('registrations should', registrationsTest => {
    registrationsTest.test('have registrations section', test => {
      test.ok(Manifest.register)
      test.end()
    })

    registrationsTest.test('register require plugins', test => {
      let plugins = ['inert', 'vision', 'blipp', './api']
      plugins.forEach(p => {
        test.ok(findPluginByPath(Manifest.register.plugins, p))
      })
      test.end()
    })

    registrationsTest.test('register and configure good plugin', test => {
      let found = findPluginByRegisterName(Manifest.register.plugins, 'good')
      test.ok(found)
      test.end()
    })

    registrationsTest.test('register and configure hapi-swagger plugin', test => {
      let found = findPluginByRegisterName(Manifest.register.plugins, 'hapi-swagger')
      test.ok(found)
      test.end()
    })

    registrationsTest.end()
  })

  manifestTest.end()
})

let findPluginByPath = (plugins, path) => {
  return plugins.find(p => {
    return p.plugin && (typeof p.plugin === 'string') && p.plugin === path
  })
}

let findPluginByRegisterName = (plugins, registerName) => {
  return plugins.find(p => {
    if (p.plugin && (typeof p.plugin === 'string') && p.plugin && p.plugin === registerName) {
      return p
    }
  })
}

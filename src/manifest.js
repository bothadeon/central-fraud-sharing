'use strict'

const Config = require('./lib/config')
const Pack = require('../package')
const ErrorHandling = require('@mojaloop/central-services-error-handling')
const Boom = require('boom')

module.exports = {
  server: {
    port: Config.PORT,
    routes: {
      validate: {
        options: ErrorHandling.validateRoutes(),
        failAction: async (request, h, err) => {
          throw Boom.boomify(err)
        }
      }
    }
  },
  register: {
    plugins: [
      {plugin: 'inert'},
      {plugin: 'vision'},
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            'title': 'Central Fraud Sharing API Documentation',
            'version': Pack.version
          }
        }
      },
      {plugin: 'blipp'},
      {plugin: './api'},
      {plugin: '@mojaloop/central-services-error-handling'},
      {
        plugin: 'good',
        options: {
          ops: {
            interval: 1000
          },
          reporters: {
            console: [
              {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [
                  {
                    response: '*',
                    log: '*',
                    error: '*'
                  }
                ]
              },
              {
                module: 'good-console',
                name: 'console',
                args: [
                  {
                    format: 'YYYY-MM-DD HH:mm:ss.SSS'
                  }
                ]
              },
              'stdout'
            ]
          }
        }
      }
    ]
  }
}

'use strict'

const Glue = require('glue')
const Manifest = require('./manifest')
const Logger = require('@mojaloop/central-services-shared').Logger

const composeOptions = { relativeTo: __dirname }

module.exports = Glue.compose(Manifest, composeOptions)
  .then(server => server.start().then(() => Logger.info(`Server running at: ${server.info.uri}`)))
  .catch(err => {
    Logger.error(err)
    throw err
  })

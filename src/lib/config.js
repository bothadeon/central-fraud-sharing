const RC = require('rc')('FSHARE', require('../../config/default.json'))

module.exports = {
  HOSTNAME: RC.HOSTNAME.replace(/\/$/, ''),
  PORT: RC.PORT
}

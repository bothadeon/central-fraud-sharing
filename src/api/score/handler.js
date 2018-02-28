'use strict'

const Uuid = require('uuid4')
const HIGH_FRAUD = '999'
const LOW_FRAUD = '111'
const BLACKLIST = '100'

const parseIdentifier = (queryIdentifier) => {
  let identifier = ''
  let identifierType = ''
  if (queryIdentifier !== undefined && queryIdentifier.includes(':')) {
    const splitQueryIdentifier = queryIdentifier.split(':')
    identifierType = splitQueryIdentifier[0]
    identifier = splitQueryIdentifier[1]
  }
  return { identifier, identifierType }
}

const randomFraud = () => {
  const createdDate = new Date()
  const score = Math.round(createdDate.getMilliseconds() / 10)
  return { id: Uuid(), createdDate, score }
}

const calculateFraud = (account, account2 = '') => {
  const fraud = randomFraud()
  if (account.includes(BLACKLIST) || account2.includes(BLACKLIST)) {
    fraud.score = 100
  } else if (account.includes(HIGH_FRAUD) || account2.includes(HIGH_FRAUD)) {
    fraud.score = 99
  } else if (account.includes(LOW_FRAUD) || account2.includes(LOW_FRAUD)) {
    fraud.score = 1
  }
  return fraud
}

exports.userScore = function (request, reply) {
  return reply.response(calculateFraud(parseIdentifier(request.payload.identifier).identifier)).code(200)
}

exports.transferScore = function (request, reply) {
  return reply.response(calculateFraud(request.payload.debits[0].account, request.payload.credits[0].account)).code(200)
}

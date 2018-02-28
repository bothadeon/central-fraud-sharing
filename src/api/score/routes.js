'use strict'

const Handler = require('./handler')
const Joi = require('joi')
const tags = ['api', 'score']

module.exports = [
  {
    method: 'POST',
    path: '/score/user',
    handler: Handler.userScore,
    options: {
      id: 'user_score',
      tags: tags,
      description: 'Score for user',
      payload: {
        allow: 'application/json',
        failAction: 'error'
      },
      validate: {
        payload: {
          'identifier': Joi.string().regex(/^[A-Za-z0-9]+:[A-Za-z0-9]+/).required().description('Identifier and identifier type concatenated by a colon')
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/score/transfer',
    handler: Handler.transferScore,
    options: {
      id: 'transfer_score',
      tags: tags,
      description: 'Score for transfer',
      payload: {
        allow: 'application/json',
        failAction: 'error'
      },
      validate: {
        payload: {
          id: Joi.string().uri().required().description('Id of transfer'),
          ledger: Joi.string().uri().required().description('Ledger of transfer'),
          debits: Joi.array().items(Joi.object().keys({
            account: Joi.string().uri().required().description('Debit account of the transfer'),
            amount: Joi.number().required().description('Debit amount of the transfer'),
            memo: Joi.object().optional().unknown().description('Additional information related to the debit'),
            authorized: Joi.boolean().optional().description('Indicates whether debit has been authorized by account holder')
          })).required().description('Debits of the transfer'),
          credits: Joi.array().items(Joi.object().keys({
            account: Joi.string().uri().required().description('Credit account of the transfer'),
            amount: Joi.number().required().description('Credit amount of the transfer'),
            memo: Joi.object().optional().unknown().description('Additional information related to the credit'),
            authorized: Joi.boolean().optional().description('Indicates whether debit has been authorized by account holder')
          })).required().description('Credits of the transfer'),
          execution_condition: Joi.string().trim().max(65535).optional().description('Execution condition of transfer'),
          expires_at: Joi.string().isoDate().optional().description('When the transfer expires')
        }
      }
    }
  }
]

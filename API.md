# Central Fraud Sharing API Documentation
***

In this guide, we'll walk through the differente central fraud sharing endpoints:
* `POST` [**User fraud score**](#user-fraud-score)
* `POST` [**Transfer fraud score**](#transfer-fraud-score)

The different endpoints often deal with these [data structures:](#data-structures) 
* [**Score Object**](#score-object)
* [**Transfer Object**](#transfer-object)
***

## Endpoints

### **User fraud score**
This endpoint returns the fraud score for a given user

#### HTTP Request
```POST http://central-fraud-sharing/score/user```

#### Headers
| Field | Type | Description |
| ----- | ---- | ----------- |
| Content-Type | String | Must be set to `application/json` |

#### Request body
| Field | Type | Description |
| ----- | ---- | ----------- |
| identifier | String | The identifier type and identifier to be created, separated by a colon |


#### Response 200 OK
| Field | Type | Description |
| ----- | ---- | ----------- |
| Object | Score | The [Score object](#score-object) generated |

#### Request
``` http
POST http://central-fraud-sharing/score/user HTTP/1.1
Content-Type: application/json
{
  "identifier": "tel:1112223456",
}
```

#### Response
``` http
HTTP/1.1 200 OK
Content-Type: application/json
{
  "score": "48",
  "created": "2017-01-03T16:16:18.958Z",
  "id": "7d4f2a70-e0d6-42dc-9efb-6d23060ccd6",
}
```

#### Testing
To test specifically for high fraud or low fraud users, include one of the listed Ids somewhere in the tel or eur.

| Id | Type | Example | Returned |
| ----- | ---- | ----------- | ------- |
| 111 | Low Fraud | 123-456-0111 | 1 |
| 999 | High Fraud | 123-456-0999| 99 |
| 100 | Blacklisted | 123-456-0100| 100 |

### **Transfer fraud score**
This endpoint returns the fraud score for a given transfer

#### HTTP Request
```POST http://central-fraud-sharing/score/transfer```

#### Headers
| Field | Type | Description |
| ----- | ---- | ----------- |
| Content-Type | String | Must be set to `application/json` |

#### Request body
| Field | Type | Description |
| ----- | ---- | ----------- |
| Object | Transfer | The transfer on which the fraud score will be calculated |

#### Response 200 OK
| Field | Type | Description |
| ----- | ---- | ----------- |
| Object | Score | The [Score object](#score-object) generated |

##### Request
``` http
POST http://central-ledger/transfers/2d4f2a70-e0d6-42dc-9efb-6d23060ccd6f HTTP/1.1
Content-Type: application/json
{
    "id": "http://central-ledger/transfers/2d4f2a70-e0d6-42dc-9efb-6d23060ccd6f",
    "ledger": "http://central-ledger",
    "debits": [{
      "account": "http://central-ledger/accounts/dfsp1",
      "amount": "50"
    }],
    "credits": [{
      "account": "http://central-ledger/accounts/dfsp2",
      "amount": "50"
    }],
    "execution_condition": "ni:///sha-256;47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU?fpt=preimage-sha-256&cost=0",
    "expires_at": "2016-12-26T00:00:01.000Z"
  }
```

#### Response
``` http
HTTP/1.1 200 OK
Content-Type: application/json
{
  "score": "82",
  "created": "2017-01-03T16:16:18.958Z",
  "guid": "6d4g2a82-e0f6-41dc-8efb-6d27060ccd6",
}
```

#### Testing
To test specifically for high fraud or low fraud transfer, include one of the listed Ids somewhere in either account uri. If more than one Id is included, it will return the higher of the fraud scores. If none of the scenarios below are leveraged, a score randomly assigned from 1-99 will be returned.

| Id | Type | Example | Returned |
| ----- | ---- | ----------- | ------- |
| 111 | Low Fraud | http://central-ledger/accounts/dfsp111 | 1 |
| 999 | High Fraud | http://central-ledger/accounts/dfsp999 | 99 |
| 100 | Blacklisted | http://central-ledger/accounts/dfsp100 | 100 |


***

## Data Structures

### Transfer Object

A transfer represents money being moved between two DFSP accounts at the central ledger.

The transfer must specify an execution_condition, in which case it executes automatically when presented with the fulfillment for the condition. (Assuming the transfer has not expired or been canceled first.) Currently, the central ledger only supports the condition type of [PREIMAGE-SHA-256](https://interledger.org/five-bells-condition/spec.html#rfc.section.4.1) and a max fulfillment length of 65535. 

Some fields are Read-only, meaning they are set by the API and cannot be modified by clients. A transfer object can have the following fields:

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | URI | Resource identifier |
| ledger | URI | The ledger where the transfer will take place |
| debits | Array | Funds that go into the transfer |
| debits[].account | URI | Account holding the funds |
| debits[].amount | String | Amount as decimal |
| debits[].invoice | URI | *Optional* Unique invoice URI |
| debits[].memo | Object | *Optional* Additional information related to the debit |
| debits[].authorized | Boolean | *Optional* Indicates whether the debit has been authorized by the required account holder |
| debits[].rejected | Boolean | *Optional* Indicates whether debit has been rejected by account holder |
| debits[].rejection_message | String | *Optional* Reason the debit was rejected |
| credits | Array | Funds that come out of the transfer |
| credits[].account | URI | Account receiving the funds |
| credits[].amount | String | Amount as decimal |
| credits[].invoice | URI | *Optional* Unique invoice URI |
| credits[].memo | Object | *Optional* Additional information related to the credit |
| credits[].authorized | Boolean | *Optional* Indicates whether the credit has been authorized by the required account holder |
| credits[].rejected | Boolean | *Optional* Indicates whether credit has been rejected by account holder |
| credits[].rejection_message | String | *Optional* Reason the credit was rejected |
| execution_condition | String | The condition for executing the transfer | 
| expires_at | DateTime | Time when the transfer expires. If the transfer has not executed by this time, the transfer is canceled. |
| state | String | *Optional, Read-only* The current state of the transfer (informational only) |
| timeline | Object | *Optional, Read-only* Timeline of the transfer's state transitions |
| timeline.prepared_at | DateTime | *Optional* An informational field added by the ledger to indicate when the transfer was originally prepared |
| timeline.executed_at | DateTime | *Optional* An informational field added by the ledger to indicate when the transfer was originally executed |

### Score Object

A score represents the likelihood of fraud for a given user or transaction, 0 being least likely, 100 being most likely.

A score object can have the following fields:

| Name | Type | Description |
| ---- | ---- | ----------- |
| score   | Integer | The likelihood of fraud |
| created | DateTime | Time when score was created |
| id | URI | Resource identifier |

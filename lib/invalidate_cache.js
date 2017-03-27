var uuid = require('uuid')
var CloudFront = require('aws-sdk/clients/cloudfront')

var cf = new CloudFront()

module.exports = invalidateCache

function invalidateCache (distroId, cb) {
  cf.createInvalidation({
    DistributionId: distroId,
    InvalidationBatch: {
      CallerReference: uuid(),
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }, cb)
}

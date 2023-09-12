const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.REGION });

module.exports.cloudfront = new AWS.CloudFront();

module.exports.s3 = new AWS.S3(process.env.STAGE === 'dev'
    ? {
        s3ForcePathStyle: true,
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
        endpoint: new AWS.Endpoint(process.env.S3_ENDPOINT),
    }
    : {}
);

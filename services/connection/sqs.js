const AWS = require('aws-sdk');

const params = {};

if (process.env.STAGE === 'dev') {
    params.endpoint = new AWS.Endpoint(process.env.SQS_ENDPOINT);
}

const instance = new AWS.SQS(params);

module.exports.send = async (queueUrl, data, delay = undefined) => {
    return instance.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(data),
        DelaySeconds: delay
    }).promise();
};

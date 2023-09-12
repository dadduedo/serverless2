const cloudFront = require('../clients/aws').cloudfront;

module.exports = async () => {
    const invalidationRequest = {
        DistributionId: process.env.DISTRIBUTION_ID,
        InvalidationBatch: {
            CallerReference: `CR-${new Date().getTime()}`,
            Paths: {
                Quantity: 1,
                Items: ['/zip-code-enabled.json'],
            },
        },
    }

    try {
        console.log(`Create invalidation for distribution ${process.env.DISTRIBUTION_ID}`);
        cloudFront.createInvalidation(invalidationRequest,
            function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Invalidation created successfully')
                }
            })
    }
    catch (error) {
        console.error(`Error invalidation on distribution ${process.env.DISTRIBUTION_ID}`);
        console.error(error.message);
    }

}
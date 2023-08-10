const S3 = require('../clients/aws').s3;


module.exports = async (body,provinceName) => {
    const params = {
        Bucket: process.env.ZIP_CODE_BUCKET,
        Key: provinceName,
        ContentType: 'application/json',
        Body: body
    };

    try {
        await S3.upload(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' })
        };
    } catch (error) {
        console.error(error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file' })
        };
    }
};
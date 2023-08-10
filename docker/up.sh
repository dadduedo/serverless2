#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )/.."

docker run -d --rm \
    -v ${ABSOLUTE_PROJECT_PATH}:/projects/zipcode-enabled \
    -v ${ABSOLUTE_PROJECT_PATH}/data/buckets:/data/buckets/zipcode-enabled \
    -e AWS_ACCESS_KEY_ID=S3RVER \
    -e AWS_SECRET_ACCESS_KEY=S3RVER \
    -e SQS_ENDPOINT=http://sqs:9324 \
    -e S3_ENDPOINT=http://localhost:4569 \
    -e REGION=eu-west-1 \
    \
    -w /projects/zipcode-enabled \
    -p 760:3000 \
    -p 745:4569 \
    --network="verisure" \
    --name="zipcode-enabled-serverless" \
    node:18 npm run dev
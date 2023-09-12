#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )/.."

docker run -d --rm \
    -v ${ABSOLUTE_PROJECT_PATH}/src:/projects/caplist/ \
    -v ${ABSOLUTE_PROJECT_PATH}src/data/buckets:/data/buckets/caplist \
    -e AWS_ACCESS_KEY_ID=S3RVER \
    -e AWS_SECRET_ACCESS_KEY=S3RVER \
    -e SQS_ENDPOINT=http://sqs:9324 \
    -e S3_ENDPOINT=http://localhost:4569 \
    -e REGION=eu-west-1 \
    \
    -w /projects/caplist \
    -p 760:3000 \
    -p 745:4569 \
    --network="verisure" \
    --name="caplist-serverless" \
    node:18 npm run dev
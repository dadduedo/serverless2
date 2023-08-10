#!/usr/bin/env bash

docker logs -f $(docker ps | grep zipcode-enabled-serverless | awk '{print $1}')
#!/usr/bin/env bash

docker exec -ti $(docker ps | grep zipcode-enabled-serverless | awk '{print $1}') npm run function $@
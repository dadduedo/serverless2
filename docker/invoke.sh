#!/usr/bin/env bash

docker exec -ti $(docker ps | grep caplist-serverless | awk '{print $1}') npm run function $@
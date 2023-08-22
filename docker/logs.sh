#!/usr/bin/env bash

docker logs -f $(docker ps | grep caplist-serverless | awk '{print $1}')
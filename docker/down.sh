#!/usr/bin/env bash

docker stop $(docker ps | grep caplist-serverless | awk '{print $1}')
#!/usr/bin/env bash

docker stop $(docker ps | grep zipcode-enabled-serverless | awk '{print $1}')
#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH=$(git rev-parse --show-toplevel)

docker run -ti \
    -v ${ABSOLUTE_PROJECT_PATH}:/projects/zipcode-enabled \
    -w /projects/zipcode-enabled \
    node:18 npm $@
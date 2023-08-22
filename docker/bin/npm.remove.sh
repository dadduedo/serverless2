#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH=$(git rev-parse --show-toplevel)

docker run -ti \
    -v ${ABSOLUTE_PROJECT_PATH}:/projects/caplist \
    -w /projects/caplist \
    node:18 npm uninstall $@
#!/bin/bash

set -e

pnpm nx run create-swarmion-app:build
BASE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)
RANDOM_ID=$(cat /proc/sys/kernel/random/uuid | sed 's/[-]//g' | head -c 6)
EXAMPLE_NAME=$EXAMPLE-$RANDOM_ID

NO_PNPM_POSTINSTALL=true pnpm node packages/create-swarmion-app/dist/index.js -t $EXAMPLE -s $REF $TEMP_DIR/$EXAMPLE_NAME
cd $TEMP_DIR/$EXAMPLE_NAME
pnpm test
pnpm build

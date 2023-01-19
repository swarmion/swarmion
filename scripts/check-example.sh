#!/bin/bash

set -e

pnpm nx run create-swarmion-app:build
pnpm nx run nx-plugin:package
BASE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)
RANDOM_ID=$(cat /proc/sys/kernel/random/uuid | sed 's/[-]//g' | head -c 6)
EXAMPLE_NAME=$EXAMPLE-$RANDOM_ID

NO_PNPM_POSTINSTALL=true pnpm node packages/create-swarmion-app/dist/index.js -t $EXAMPLE -s $REF $TEMP_DIR/$EXAMPLE_NAME
cd $TEMP_DIR/$EXAMPLE_NAME

# test everything
pnpm package
pnpm build
pnpm test

# link generator and generate library
pnpm link $BASE_DIR/packages/nx-plugin
pnpm generate-library test-library

# link generator and generate service
pnpm link $BASE_DIR/packages/nx-plugin
pnpm generate-service test-service

# link generator and generate cdk service
pnpm link $BASE_DIR/packages/nx-plugin
pnpm generate-cdk-service test-cdk-service

# re-test everything
pnpm package
pnpm build
pnpm test

# TODO in the future
# deploy
# pnpm run deploy

#!/bin/bash

set -e

pnpm nx run create-swarmion-app:build
BASE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)

NO_PNPM_POSTINSTALL=true pnpm node packages/create-swarmion-app/dist/index.js -t $EXAMPLE -s $REF $TEMP_DIR/$EXAMPLE-app
cd $TEMP_DIR/$EXAMPLE-app
pnpm test
pnpm build

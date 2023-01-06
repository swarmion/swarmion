#!/bin/bash

set -e

pnpm nx run create-swarmion-app:build
BASE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)

# We loop through the examples, build them and run their tests

for template in $(ls examples); do
  NO_PNPM_POSTINSTALL=true pnpm node packages/create-swarmion-app/dist/index.js -t $template -s $REF $TEMP_DIR/$template-app
  cd $TEMP_DIR/$template-app
  pnpm test
  pnpm build
  cd $BASE_DIR
done

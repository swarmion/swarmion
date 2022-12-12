#!/bin/bash

set -e

pnpm nx run create-swarmion-app:build
mkdir -p ./dist

for template in swarmion-starter swarmion-full-stack; do
  NO_PNPM_POSTINSTALL=true pnpm node packages/create-swarmion-app/dist/index.js -t $template -s $REF ./dist/$template-app
  cd ./dist/$template-app
  pnpm test
  pnpm build
  cd ../..
done

#!/bin/bash

set -e

# This script checks our examples
# For this, we need to have the local version of Swarmion packages (not the ones published on npm)
# This is why we need to symlink packages with the swarmion_setup function

pnpm nx run create-swarmion-app:build
pnpm package

BASE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)
RANDOM_ID=$(cat /proc/sys/kernel/random/uuid | sed 's/[-]//g' | head -c 6)
EXAMPLE_NAME=$EXAMPLE-$RANDOM_ID

link_swarmion_deps() {
    # for earch '@swarmion/*' dependency and devDependency listed in the 'package.json', link it the local ones
    for DEP in $(jq -r '.dependencies,.devDependencies' package.json | sed '/^null$/d' | jq -r 'keys[]' | grep @swarmion/ | sed 's/@swarmion\///'); do
        pnpm link $BASE_DIR/packages/$DEP
    done
}

swarmion_setup() {
    # the nx plugin needs to be linked at the root
    pnpm link $BASE_DIR/packages/nx-plugin

    # for each workspace workspaces
    for WORKSPACE in $(pnpm recursive exec pwd); do
        cd $WORKSPACE
        link_swarmion_deps
    done

    # back to test root
    cd $TEMP_DIR/$EXAMPLE_NAME
}

# check if the $REF argument is valid
if [ ! $REF ]; then
    echo "Missing required argument \$REF"
    exit 1
fi

HUSKY=0 pnpm node packages/create-swarmion-app/dist/index.js -t $EXAMPLE -s $REF $TEMP_DIR/$EXAMPLE_NAME
cd $TEMP_DIR/$EXAMPLE_NAME

swarmion_setup # local link

# test everything
pnpm package
pnpm build
pnpm test

# generate library
pnpm generate-library test-library
cd packages/test-library
link_swarmion_deps
cd $TEMP_DIR/$EXAMPLE_NAME
# generate breaks the links, so we need to recreate them
pnpm link $BASE_DIR/packages/nx-plugin

# generate service
pnpm generate-service test-service
cd services/test-service
link_swarmion_deps
cd $TEMP_DIR/$EXAMPLE_NAME
# generate breaks the links, so we need to recreate them
pnpm link $BASE_DIR/packages/nx-plugin

# generate cdk service
pnpm generate-cdk-service test-cdk-service
cd services/test-cdk-service
link_swarmion_deps
cd $TEMP_DIR/$EXAMPLE_NAME

# generate breaks the links, so we need to recreate them
swarmion_setup # local link

# re-test everything
pnpm package
pnpm build
pnpm test

# TODO in the future
# deploy
# pnpm run deploy

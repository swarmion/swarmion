#!/bin/bash

set -e

# This script checks our examples
# For this, we need to have the local version of Swarmion packages (not the ones published on npm)
# This is why we need to symlink packages with the swarmion_setup function

pnpm nx run create-swarmion-app:build
pnpm package

BASE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)
RANDOM_ID=$(head -c 200 /dev/urandom | LANG=C tr -dc 'a-z' | fold -w 6 | head -n 1)
EXAMPLE_NAME=$EXAMPLE-$RANDOM_ID

swarmion_setup() {
    # the nx plugin needs to be linked at the root
    pnpm link $BASE_DIR/packages/nx-plugin

    # for each workspace
    for WORKSPACE in $(pnpm recursive exec pwd); do
        cd $WORKSPACE
        # for earch '@swarmion/*' dependency and devDependency listed in the 'package.json', link it the local ones
        for DEP in $(jq -r '.dependencies,.devDependencies' package.json | sed '/^null$/d' | jq -r 'keys[]' | grep @swarmion/ | sed 's/@swarmion\///'); do
            SWARMION_PACKAGE_PATH=${BASE_DIR}/packages/${DEP}
            # If the swarmion package has a publish directory, we link the publish directory directly
            PUBLISH_DIR=$(jq -r '.publishConfig.directory' ${SWARMION_PACKAGE_PATH}/package.json | sed '/^null$/d')
            pnpm link ${SWARMION_PACKAGE_PATH}/${PUBLISH_DIR}
        done
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

# temporary perform this check because swarmion-bare
# is only compatible with CDK service since it has a cdk-configuration package
if [ "$EXAMPLE" = "swarmion-bare" ]; then
    # generate breaks the links, so we need to recreate them
    pnpm link $BASE_DIR/packages/nx-plugin
    # generate cdk service
    pnpm generate-cdk-service test-cdk-service
else
    pnpm link $BASE_DIR/packages/nx-plugin
    # generate service
    pnpm generate-service test-service
fi


# generate breaks the links, so we need to recreate them
swarmion_setup # local link

# re-test everything
pnpm package
pnpm build
pnpm test

# TODO in the future
# deploy
# pnpm run deploy

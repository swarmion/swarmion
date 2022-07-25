#!/usr/bin/env bash
set -eo pipefail
IFS=$'\n\t'

readonly RELEASE_TYPE=$1
IS_ALPHA=false
OLD_VERSION=$(cat lerna.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')

# exit if RELEASE_TYPE not in lerna accepted release types
if ! [[ "$RELEASE_TYPE" =~ ^(major|minor|patch|premajor|preminor|prepatch|prerelease)$ ]]; then
    echo "RELEASE_TYPE is invalid"
    exit 1
fi

set -u

# compute whether we need an alpha release
if [[ "$RELEASE_TYPE" =~ ^(premajor|preminor|prepatch|prerelease)$ ]]; then
    echo "Using an alpha release"
    IS_ALPHA=true
fi

# set the new version
yarn lerna version $RELEASE_TYPE --no-git-tag-version --no-push --force-publish --yes

# ensuring all packages are up-to-date
yarn && yarn package --skip-nx-cache && yarn build --skip-nx-cache

NEW_VERSION=$(cat lerna.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')

# create release commit
git add yarn.lock lerna.json **/package.json
git commit -S -m "v${NEW_VERSION}"

# publish new version to npm
if $IS_ALPHA; then
    yarn lerna publish from-package --force-publish --dist-tag alpha --yes
else
    yarn lerna publish from-package --force-publish --yes
fi

# upgrade packages in the starter
yarn --cwd examples/swarmion-starter up '@swarmion/*'@^$NEW_VERSION

# commit changes in the starter
git add examples/swarmion-starter/yarn.lock examples/swarmion-starter**/package.json
git commit -S -m "chore(starter): bump Swarmion from v${OLD_VERSION} to v${NEW_VERSION}"

# tag new version && push everything
git tag v$NEW_VERSION -m "v${NEW_VERSION}" -s
git push && git push --tags

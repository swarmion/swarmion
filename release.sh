#!/usr/bin/env bash
set -eo pipefail
IFS=$'\n\t'

readonly RELEASE_TYPE=$1
# optional second argument to explicitly define the version. Otherwise let lerna build it
readonly TARGET_VERSION=$2

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
if [[ "$TARGET_VERSION" == "" ]]; then
    echo 'Using lerna version generation target'
    pnpm lerna version $RELEASE_TYPE --no-git-tag-version --no-push --force-publish --yes
else
    echo "Using target version"
    pnpm lerna version $TARGET_VERSION --no-git-tag-version --no-push --force-publish --yes
fi

# ensuring all packages are up-to-date
pnpm install && pnpm package --skip-nx-cache && pnpm build --skip-nx-cache

NEW_VERSION=$(cat lerna.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')

# create release commit
git add pnpm-lock.yaml lerna.json **/package.json
git commit -S -m "v${NEW_VERSION}"

# publish new version to npm
if $IS_ALPHA; then
    pnpm lerna publish from-package --force-publish --dist-tag alpha --yes
else
    pnpm lerna publish from-package --force-publish --yes
fi

# we need to wait for the version to be available on npm
echo "Waiting for changes to be available on npm, please do not stop"
sleep 90 # 90 seconds

# upgrade packages in the examples
for example in examples/*; do
    echo "Upgrading packages in $example"
    cd "$example"
    HUSKY=0 pnpm up "@swarmion/*@^${NEW_VERSION}"
    cd ../..
    git add "$example"
    git commit -S -m "chore($example): bump Swarmion from v${OLD_VERSION} to v${NEW_VERSION}"
done

# tag new version && push everything
git tag v$NEW_VERSION -m "v${NEW_VERSION}" -s
git push && git push --tags

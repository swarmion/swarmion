#!/bin/bash

# load params into variables, ie: running "./deploy.sh --stage staging" will create the `$stage` variable with the value "staging"
while [ $# -gt 0 ]; do
  if [[ $1 == *"--"* ]]; then
    v="${1/--/}"
    declare "$v"="$2"
  fi
  shift
done

stages=("staging production")

if [[ -n "${stage}" ]] && [[ ! "${stages[*]}" =~ "${stage}" ]]; then
  echo "Stage should be either empty or \`staging\` or \`production\`"
  exit 1
fi

cd ../app || exit 1
yarn build --mode "$stage"
cd ../cloudfront || exit 1
if [[ -z "${stage}" ]]; then
  yarn serverless deploy
else
  yarn serverless deploy --stage "$stage"
fi

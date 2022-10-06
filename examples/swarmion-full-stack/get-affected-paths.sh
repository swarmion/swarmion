#!/usr/bin/env bash
set -eo pipefail
IFS=$'\n\t'

readonly PROJECT_TYPE=$1

# exit if PROJECT_TYPE not in 'apps' or 'libs'
if [[ "$PROJECT_TYPE" != "apps" && "$PROJECT_TYPE" != "libs" ]]; then
    echo "PROJECT_TYPE must be either 'apps' or 'libs'"
    exit 1
fi

set -u

replace() {
    cat workspace.json | jq ".projects[\"$1\"]"
}

export -f replace

readonly AFFECTED_STRING=$(pnpm nx affected:"$PROJECT_TYPE" --plain)
readonly AFFECTED_ARRAY=($(echo "$AFFECTED_STRING" | tr ' ' '\n'))

RESULT=''

for app in "${AFFECTED_ARRAY[@]}"; do
    if [[ -z "${RESULT}" ]]; then
        RESULT=$(replace "$app")
    else
        RESULT="$RESULT,$(replace "$app")"
    fi
done

RESULT="[$RESULT]"

echo "$RESULT"

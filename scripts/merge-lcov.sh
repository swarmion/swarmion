#!/bin/bash

directories=(packages services)
args=""

for dir in "${directories[@]}"; do
    files=$(find "$dir" -path "*/coverage/lcov.info")
    for f in $files; do
        prefix=$(dirname "$(dirname "$f")")
        echo "fixing paths in $f"

        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i "" "s#^SF:src#SF:${prefix}/src#g" "$f"
        else
            sed -i "s#^SF:src#SF:${prefix}/src#g" "$f"
        fi

        if [ -s "$f" ]; then
            args="$args -a $f"
        else
            echo "Skipping empty file: $f"
        fi
    done
done

mkdir coverage
lcov -o coverage/lcov.info $args

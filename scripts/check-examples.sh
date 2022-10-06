#!/bin/bash

for folder in examples/* ; do
  cd $folder
  pnpm install
  pnpm package
  pnpm test
  cd ../..
done;

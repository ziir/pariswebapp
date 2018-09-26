#!/bin/sh

for i in */ ; do
  echo ">>> Running 'yarn install' in '$i'"
  (cd "$i" && yarn install)
done

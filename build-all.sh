#!/bin/sh

for i in react-*/ ; do
  echo ">>> Running 'yarn install && yarn build' in '$i'"
  (cd "$i" && yarn install && yarn build)
done

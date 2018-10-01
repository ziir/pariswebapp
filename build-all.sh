#!/bin/sh

for i in react-*/ ; do
  echo ">>> Running 'yarn install --dev && yarn build' in '$i'"
  (cd "$i" && yarn install --dev && yarn build)
done

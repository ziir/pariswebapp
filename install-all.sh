#!/bin/sh

echo ">>> Running 'yarn install' in the root directory"
yarn install

for i in react-*/ redux-*/ ; do
  echo ">>> Running 'yarn install' in '$i'"
  (cd "$i" && yarn install)
done

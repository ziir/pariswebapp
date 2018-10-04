#!/bin/sh

echo ">>> Running 'yarn install' in the root directory"
yarn install

for i in react-*/ ; do
  echo ">>> Running 'yarn install' in '$i'"
  (cd "$i" && yarn install)
done

for i in redux-*/ ; do
  echo ">>> Running 'yarn install' in '$i'"
  (cd "$i" && yarn install)
done
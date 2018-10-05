#!/bin/sh

for i in react-*/ redux-*/ ; do
  echo ">>> Running 'rm -rf node_modules' in '$i'"
  (cd "$i" && rm -rf node_modules)
done

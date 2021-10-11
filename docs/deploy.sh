#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
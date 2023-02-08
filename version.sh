#! /usr/bin/env bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: ./bin/version.sh <version>"
  echo "This will update the version for all packages"
  exit 1
fi

VERSION="$(npm version --no-git-tag-version "$1")"
npm --workspaces version "$VERSION"
npm install  # update lockfile
git add package{,-lock}.json ./**/*.json
git commit --message "$VERSION"
git tag -a -m "New version: $VERSION" "$VERSION"

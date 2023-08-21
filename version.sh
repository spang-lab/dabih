#! /usr/bin/env bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: ./bin/version.sh <version>"
  echo "This will update the version for all packages"
  exit 1
fi

if command -v gsed >/dev/null 2>&1; then
    SED_COMMAND="gsed"
else
    SED_COMMAND="sed"
fi
echo $SED_COMMAND


VERSION="$(npm version --no-git-tag-version "$1")"
pushd client
  npm version --no-commit-hooks "$VERSION"
popd
pushd cli
  $SED_COMMAND -i "s/version = .*/version = \"$VERSION\"/" Cargo.toml
popd


npm install  # update lockfile
git add package{,-lock}.json ./**/*.json
git commit --message "$VERSION"
git tag -a -m "New version: $VERSION" "$VERSION"

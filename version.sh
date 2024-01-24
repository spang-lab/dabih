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

pushd api
  VERSION="$(npm version --no-git-tag-version "$1")"
  npm install  # update lockfile
popd

pushd client
  npm run build
  npm version --no-commit-hooks "$VERSION"
popd
pushd tauri 
  npm version --no-commit-hooks "$VERSION"
  pushd src-tauri
    $SED_COMMAND -i "s/^version = .*/version = \"${VERSION#v}\"/" Cargo.toml
    $SED_COMMAND -i "s/\"version\": .*/\"version\": \"${VERSION#v}\"/" tauri.conf.json 
  popd
popd
pushd cli
  $SED_COMMAND -i "s/^version = .*/version = \"${VERSION#v}\"/" Cargo.toml
popd
pushd example
  find . -name "*.yaml" -type f -exec $SED_COMMAND -r -i "s/v[0-9]+\.[0-9]+\.[0-9]+/$VERSION/" {} +
popd


git add -A
git commit --message "$VERSION"
git tag -a -m "New version: $VERSION" "$VERSION"

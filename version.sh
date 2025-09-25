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

# Make sure all builds pass before updating versions
pushd vite
  npm run build
popd

pushd cli
  cargo build --release
popd

pushd api
  VERSION="$(npm version --no-git-tag-version "$1")"
  npm install  # update lockfile
popd

pushd vite 
  npm version --no-commit-hooks "$VERSION"
popd
pushd cli
  $SED_COMMAND -i "s/^version = .*/version = \"${VERSION#v}\"/" Cargo.toml
  # update lockfile
  cargo build --release
popd

# Update the version in the docker-compose file
$SED_COMMAND -i "s#image: thespanglab/dabih:.*#image: thespanglab/dabih:${VERSION}#" docker-compose.yml



git add -A
git commit --message "$VERSION"
git tag -a -m "New version: $VERSION" "$VERSION"

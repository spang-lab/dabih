#!/usr/bin/env zsh


if command -v gsed >/dev/null 2>&1; then
    SED_COMMAND="gsed"
else
    SED_COMMAND="sed"
fi

echo VERSION="v1.0.0"

find example -name "*.yaml" -type f -exec $SED_COMMAND -i "s/v[0-9]+\.[0-9]+\.[0-9]+/$VERSION/" {} +

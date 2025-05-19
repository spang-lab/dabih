#!/usr/bin/env zsh

openapi-generator generate -g rust \
  -i ../api/build/spec.json \
  -o openapi 

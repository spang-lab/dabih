#!/usr/bin/env zsh


openapi-generator generate -g rust \
  -i ../api/build/spec.json \
  --type-mappings bigint=String \
  --additional-properties=preferUnsignedInt=true\
  -o openapi 


file="openapi/src/apis/upload_api.rs"


# Replace the TODO line with a multiline block
sed -i '' "/\/\/ TODO: support file upload for 'chunk' parameter/{
    s/.*/let part = reqwest::multipart::Part::bytes(p_form_chunk).file_name(\"chunk.bin\");\\
multipart_form = multipart_form.part(\"chunk\", part);/
}" "$file"


sed -i '' 's|chunk: Option<std::path::PathBuf>|chunk: Vec<u8>|g' "$file"


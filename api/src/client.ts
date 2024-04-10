import { readFile, writeFile } from 'fs/promises';
import openapiTS, { OpenAPI3, astToString } from 'openapi-typescript';
import ts from 'typescript';


const DATE = ts.factory.createIdentifier('Date')
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());


const build = async () => {
  const specFile = 'build/spec.json';
  const typesFile = 'build/api.d.ts';
  const specStr = await readFile(specFile, 'utf8');
  const spec = JSON.parse(specStr) as OpenAPI3;
  const types = await openapiTS(spec, {
    transform(schemaObject) {
      if (schemaObject.format === "date-time") {
        return schemaObject.nullable
          ? ts.factory.createUnionTypeNode([DATE, NULL])
          : DATE
      }
      return;
    },
  });
  const schema = astToString(types);
  await writeFile(typesFile, schema, 'utf8');
}
void build();

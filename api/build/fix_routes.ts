import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);
const filePath = path.resolve(dirname, './routes.ts');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.startsWith('// @ts-nocheck')) {
    fs.writeFileSync(filePath, `// @ts-nocheck\n${content}`, 'utf8');
    console.log(`Prepended // @ts-nocheck to ${filePath}`);
  } else {
    console.log(`File already has // @ts-nocheck at the top: ${filePath}`);
  }
} else {
  console.warn(`File not found, skipping: ${filePath}`);
}

import { getEnv } from '#lib/env';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';
export default async function info() {
    const path = getEnv('INFO_PATH', `${process.cwd()}/info.yaml`);
    const content = await readFile(path, 'utf-8');
    const data = yaml.load(content);
    const packageJson = await readFile('package.json', 'utf-8');
    const p = JSON.parse(packageJson);
    return { ...data, version: p.version };
}
;
//# sourceMappingURL=info.js.map
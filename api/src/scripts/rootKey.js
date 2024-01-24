import yaml from 'js-yaml';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { log } from '../util/index.js';

import { rsa, randomToken } from '../crypto/index.js';

const generateRootKey = async () => {
  const keyId = await randomToken(6);
  const privateKeyFile = `./dabihRootKey_${keyId}.pem`;

  log('Generating a new root key');
  const { publicKey, privateKey } = await rsa.generateKeyPair();
  const obj = {
    crypto: {
      rootKeys: [publicKey],
    },
  };
  const text = yaml.dump(obj);

  log(`Writing private key to ${resolve(privateKeyFile)}`);
  await writeFile(privateKeyFile, privateKey);
  log('This is your new public root key, copy it to your config like this:');
  log.raw('\n');
  log.raw(text);
  log.raw('\n');
};

(async () => {
  try {
    await generateRootKey();
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
})();

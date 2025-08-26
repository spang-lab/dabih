import logger from '#lib/logger';
import smb2 from '@tryjsky/v9u-smb2';
import { join } from 'path';

let client: smb2 | null = null;
let basePath = '';

interface SmbUri {
  domain: string;
  user: string;
  password: string;
  host: string;
  port: number;
  share: string;
  path: string;
}

export const parseSmbUri = (uri: string): SmbUri => {
  if (!uri.startsWith('smb://')) {
    throw new Error('Invalid SMB URI: must start with smb://');
  }

  const regex =
    /^(?:(?<domain>[^;/]+);)?(?<user>[^:@/]+):(?<password>[^@/]+)@(?<host>[^:/]+)(?::(?<port>\d+))?\/(?<share>[^/]+)(?:\/(?<path>.*))?$/;

  const stripped = uri.replace(/^smb:\/\//, '');
  const match = regex.exec(stripped);
  if (!match?.groups) {
    throw new Error('Invalid SMB URI format');
  }
  const { domain, user, password, host, port, share, path } = match.groups;

  const options: SmbUri = {
    host,
    share,
    port: port ? parseInt(port, 10) : 445,
    path: path ?? '',
    user: user ?? 'guest',
    password: password ?? '',
    domain: domain ?? 'WORKGROUP',
  };

  return options;
};

const checkRootFile = async () => {
  if (!client) {
    throw new Error('SMB client not initialized');
  }
  const file = 'DO_NOT_TOUCH_THIS_FOLDER.txt';
  const filePath = join(basePath, file);

  try {
    const exists = await client.exists(filePath);
    if (!exists) {
      logger.info(`Creating file at ${filePath}`);
      await client.writeFile(
        filePath,
        'This file is used by dabih to verify access to the SMB share.\nPlease do not delete or modify this file.',
      );
    }
    const message = await client.readFile(filePath, {
      encoding: 'utf8',
    });
    logger.info(`SMB root file content: ${message}`);
  } catch (error) {
    throw new Error(
      `Failed to initialize SMB share: ${(error as Error).toString()}`,
    );
  }
};

const get = async (bucket: string, key: string) => {
  if (!client) {
    throw new Error('SMB client not initialized');
  }
  const path = join(basePath, bucket, key);
  try {
    const stream = await client.createReadStream(path);
    return stream;
  } catch (err) {
    logger.error(err);
    throw new Error(`SMB: Failed to open file ${path}`);
  }
};

const store = async (bucket: string, key: string) => {
  if (!client) {
    throw new Error('SMB client not initialized');
  }
  const path = join(basePath, bucket, key);
  try {
    const stream = await client.createWriteStream(path, { autoClose: false });
    return stream;
  } catch (err) {
    logger.error(err);
    throw new Error(`SMB: Failed to write to file ${path}`);
  }
};

const head = async (bucket: string, key: string) => {
  if (!client) {
    throw new Error('SMB client not initialized');
  }
  const path = join(basePath, bucket, key);
  try {
    const meta = await client.stat(path);
    return meta;
  } catch {
    return null;
  }
};

const removeBucket = async (bucket: string) => {
  if (!client) {
    throw new Error('SMB client not initialized');
  }
  const path = join(basePath, bucket);
  try {
    const exists = await client.exists(path);
    if (!exists) {
      return;
    }
  } catch (err) {
    logger.error(err);
    throw new Error(`SMB: Failed to check existence of bucket ${path}`);
  }
  throw new Error(`SMB: Failed to remove bucket ${path}`);
};

const createBucket = async (bucket: string) => {
  if (!client) {
    throw new Error('SMB client not initialized');
  }
  const path = join(basePath, bucket);
  try {
    const exists = await client.exists(path);
    if (!exists) {
      await client.mkdir(path);
    }
  } catch (err) {
    logger.error(err);
    throw new Error(`SMB: Failed to create bucket ${path}`);
  }
};

const init = async (uri: string) => {
  const { host, domain, user, password, share, path } = parseSmbUri(uri);

  try {
    client = new smb2({
      share: `\\\\${host}\\${share}`,
      domain,
      username: user,
      password,
    });
    basePath = path;
  } catch (error) {
    console.error('Error connecting to SMB share:', error);
  }
  await checkRootFile();

  return {
    get,
    store,
    head,
    removeBucket,
    createBucket,
  };
};

export default init;

import smb2 from '@awo00/smb2';

interface SmbUri {
  domain?: string;
  user?: string;
  password?: string;
  server: string;
  port?: number;
  share: string;
  path: string;
}

export const parseSmbUri = (uri: string): SmbUri => {
  if (!uri.startsWith('smb://')) {
    throw new Error('Invalid SMB URI: must start with smb://');
  }

  const regex =
    /^(?:(?<domain>[^;/]+);)?(?<user>[^:@/]+):(?<password>[^@/]+)@(?<server>[^:/]+)(?::(?<port>\d+))?\/(?<share>[^/]+)(?:\/(?<path>.*))?$/;

  const stripped = uri.replace(/^smb:\/\//, '');
  const match = regex.exec(stripped);
  if (!match?.groups) {
    throw new Error('Invalid SMB URI format');
  }
  const { domain, user, password, server, port, share, path } = match.groups;

  const options: SmbUri = {
    server,
    port: port ? parseInt(port, 10) : 445,
    share,
    path,
  };
  if (domain) options.domain = domain;
  if (user) options.user = user;
  if (password) options.password = password;

  return options;
};

const init = async (uri: string) => {
  const options = parseSmbUri(uri);
  console.log('Parsed SMB options:', options);

  throw new Error('SMB storage backend not implemented');
};

export default init;

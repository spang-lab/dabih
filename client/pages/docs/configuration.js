import React from 'react';

import {
  Docs,
  Title1,
  Title2,
  CodeBlock,
  Code,
} from '../../components';

function Documentation() {
  return (
    <Docs>
      <div className="text-lg">
        <Title1>
          Configuration
        </Title1>
        <Title2 className="pt-5">
          Environment Variables
        </Title2>
        The dabih API server reads the following Environment Variables:
        <p className="py-1">
          <Code>CONFIG</Code>
          Specifies the location of the yaml config file, details are described below.
          Default will be
          <Code>
            ./config.yaml
          </Code>
        </p>
        <p className="py-1">
          <Code>EPHEMERAL_SECRET</Code>
          <span className="italic">
            (Optional)
          </span>
          {' '}
          If an external ephemeral store is used this secret will be used to
          encrypt the storage and protect sensitve keys.
        </p>
        <p className="py-1">
          <Code>DATABASE_SECRET</Code>
          <span className="italic">
            (Optional)
          </span>
          {' '}
          The password for an external SQL based database. Not required if
          you are using sqlite.
        </p>
        <Title2 className="pt-5">
          config.yaml
        </Title2>
        <p>
          All other configuration is read from the config.yaml file.
        </p>
        <CodeBlock>
          {`
server:
  protocol: http
  host: localhost
  port: 8088

admins:
  subs:
    - mhuttner
  groups:
    - dabih

# Generate root keys by calling 'npm run rootKey'
crypto:
  rootKeys:
  - kty: RSA
    'n': >-
      4YYnnoKUZr9_XkcB8xKUeTLoHGundC....
    e: AQAB

# Configure where to store temporary data
ephemeral:
  # adapter can be 'memcached' or 'memory'
  adapter: 'memcached'
  memcachedUrl: 'localhost:11211'

# Sequelize configuration
# see https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database

# Example Postgres database
database:
  dialect: postgres
  logging: false
  host: postgres.spang-lab.de
  port: 5432
  database: dabih 
  username: postgresuser

# Example SQLite database
database:
  dialect: sqlite
  logging: false 
  storage: ./data/dabih.sqlite

# Configure where the files will be stored
storage:
  backend: local
  path: ./data 

`}
        </CodeBlock>
      </div>
    </Docs>
  );
}

export default Documentation;

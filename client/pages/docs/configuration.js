import React from 'react';

import {
  Docs,
  CodeBlock,
} from '../../components';

function Documentation() {
  return (
    <Docs>
      <div className="text-lg">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Configuration
        </h1>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Environment Variables
        </h2>
        The dabih API server reads the following Environment Variables:
        <p className="py-1">
          <span className="font-semibold text-gray-mid">
            {' '}
            CONFIG
            {' '}
          </span>
          Specifies the location of the yaml config file, details are described below.
          Default will be
          <span className="font-semibold text-gray-mid">
            {' '}
            ./config.yaml
            {' '}
          </span>
        </p>
        <p className="py-1">
          <span className="font-semibold text-gray-mid">
            {' '}
            EPHEMERAL_SECRET
            {' '}
          </span>
          <span className="italic">
            (Optional)
          </span>
          {' '}
          If an external ephemeral store is used this secret will be used to
          encrypt the storage and protect sensitve keys.
        </p>
        <p className="py-1">
          <span className="font-semibold text-gray-mid">
            {' '}
            DATABASE_SECRET
            {' '}
          </span>
          <span className="italic">
            (Optional)
          </span>
          {' '}
          The password for an external SQL based database. Not required if
          you are using sqlite.
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          config.yaml
        </h2>
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

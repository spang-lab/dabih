const tables = [
  {
    name: 'meta',
    create: (db) => db.none(`
      CREATE TABLE meta (
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          key             TEXT                NOT NULL UNIQUE,
          value           TEXT                NOT NULL
      );
    `),
  },
  {
    name: 'public_key',
    create: (db) => db.none(`
      CREATE TABLE public_key (
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          hash            TEXT                NOT NULL,
          name            TEXT                ,
          sub             TEXT                NOT NULL,
          data            JSON                NOT NULL,
          created         timestamptz         NOT NULL,
          deleted         timestamptz         ,
          confirmed_by    TEXT                ,
          confirmed       timestamptz         ,
          is_root_key   boolean             NOT NULL
      );
    `),
  },
  {
    name: 'dataset',
    create: (db) => db.none(`
      CREATE TABLE dataset (
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          mnemonic        TEXT                NOT NULL UNIQUE,
          name            TEXT                UNIQUE,
          file_name       TEXT                ,
          hash            TEXT                ,
          size            INTEGER             ,
          key_hash        TEXT                NOT NULL,
          created_by      TEXT                NOT NULL,
          validated       timestamptz         ,
          created         timestamptz         NOT NULL,
          deleted         timestamptz         
      );
    `),
  },
  {
    name: 'dataset_chunks',
    create: (db) => db.none(`
      CREATE TABLE dataset_chunks (
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          dataset         BIGSERIAL           NOT NULL REFERENCES dataset(id),
          hash            TEXT                NOT NULL,
          iv              TEXT                NOT NULL,
          byte_range      int8range           NOT NULL,
          size            BIGINT              NOT NULL,
          crc             TEXT                ,
          created         timestamptz         NOT NULL,
          deleted         timestamptz         
      );
    `),
  },
  {
    name: 'dataset_keys',
    create: (db) => db.none(`
      CREATE TABLE dataset_keys(
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          dataset         BIGSERIAL           NOT NULL REFERENCES dataset(id),
          public_key      BIGINT              NOT NULL REFERENCES public_key(id),
          key             TEXT                NOT NULL,
          created         timestamptz         NOT NULL,
          deleted         timestamptz         
      );
    `),
  },
  {
    name: 'user_access',
    create: (db) => db.none(`
      CREATE TABLE user_access (
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          sub             TEXT                NOT NULL,
          dataset         BIGINT              NOT NULL REFERENCES dataset(id),
          type            INTEGER             NOT NULL,
          created         timestamptz         NOT NULL,
          deleted         timestamptz         
      );
    `),
  },
  {
    name: 'event',
    create: (db) => db.none(`
      CREATE TABLE event (
          id              BIGSERIAL           PRIMARY KEY NOT NULL,
          sub             TEXT                ,
          mnemonic        TEXT                ,
          event           TEXT                ,
          message         TEXT                ,
          created         timestamptz         NOT NULL,
          deleted         timestamptz         
      );
    `),
  },
];
export default tables;

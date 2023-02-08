import React from 'react';
import {
  Title1, Link, Code, Title2, Docs, Color, ApiRoute, CodeBlock,
} from '../../components';

function RouteLink({ path }) {
  const id = path
    .slice(1)
    .replace(/\//g, '-')
    .replace(/:/g, '');
  const href = `#${id}`;
  return (
    <Link href={href}>
      /api/v1
      {path}
    </Link>
  );
}

export default function Documentation() {
  return (
    <Docs>
      <Title1 className="mb-10">
        <Color>API</Color>
        Reference
      </Title1>
      <ApiRoute method="GET" path="/key/list/user">
        List all dabih users, more specifically users who
        have uploaded a public key to dabih.
        <p className="font-extrabold">Response:</p>
        <CodeBlock>
          {JSON.stringify({
            users: [
              '<sub1>',
              '...',
            ],
            unconfirmed: [
              '<sub2>',
              '...',
            ],
          }, null, 2)}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" path="/key/add" action="KEY_ADD">
        Upload a new public key to dabih.
        The key will start of a with a state of
        <Code>unconfirmed</Code>
        and needs to be unlocked by an admin.
        Keys are transfered using the
        {' '}
        <Link target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#json_web_key">JSON Web Key Format</Link>
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({ name: '<new name>', publicKey: '{public key in jwk format}' }, null, 2)}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" path="/key/check">

        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({ keyHash: 'jg94g....' }, null, 2)}
        </CodeBlock>
        <Code>keyHash</Code>
        {' '}
        is the sha-256 hash of the users public key

        <p className="font-extrabold">Response:</p>
        If the key is valid and confirmed the response will be
        <CodeBlock>
          {JSON.stringify({ valid: true }, null, 2)}
        </CodeBlock>
        else the response will be an error.
      </ApiRoute>
      <ApiRoute method="GET" path="/dataset/list">
        List all datasets where you have a least
        <Code>read</Code>
        permission, including all their members.
        <p className="font-extrabold">Response:</p>
        <CodeBlock>
          {`[
  {
    "mnemonic": <dataset id>,
    "name": <dataset name>,
    "fileName": <name of the file in the dataset>,
    "hash": <sha-256 hash of all hashes of chunks>,
    "size": <total size in bytes>,
    "keyHash": <sha-256 hash of the AES key>,
    "permission": <your permission>
    "members": [{
      "sub": <user id>,
      "permission": <either 'read', 'write' or 'none'>,
    }, ...],
  }, ...
]`}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="GET" path="/dataset/:mnemonic">
        Get the information for the dataset
        <Code>mnemonic</Code>
        <p className="font-extrabold">Response:</p>
        <CodeBlock>
          {`{
    "mnemonic": <dataset id>,
    "name": <dataset name>,
    "fileName": <name of the file in the dataset>,
    "hash": <sha-256 hash of all hashes of chunks>,
    "size": <total size in bytes>,
    "keyHash": <sha-256 hash of the AES key>,
    "chunks": [{
      "id": <db id>,
      "hash": <sha-256 hash of the unencrypted data>,
      "iv": <AES initialization vector>,
      "crc": <CRC32 checksum of the encrypted data (hex)>,
      "start": <byte positon of the chunk start (inclusive)>,
      "end": <byte positon of the chunk end (non-inclusive)>,
    }, ...],
}`}
        </CodeBlock>

      </ApiRoute>

      <ApiRoute method="POST" path="/dataset/:mnemonic/remove" action="DATASET_REMOVE">
        Remove the dataset
        {' '}
        <Code>mnemonic</Code>
        The dataset can still be recovered by an admin.
      </ApiRoute>

      <ApiRoute method="POST" action="DATASET_MEMBER_ADD" path="/dataset/:mnemonic/member/add">
        Add a new members to the dataset
        {' '}
        <Code>mnemonic</Code>
        <p>
          You need to have
          <Code>write</Code>
          permission for the dataset for this call to succeed
        </p>
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({
            key: '<decrypted AES key>',
            members: ['<sub1>', '<sub2>', '...'],
          }, null, 2)}
        </CodeBlock>

      </ApiRoute>
      <ApiRoute method="POST" action="DATASET_MEMBER_SET" path="/dataset/:mnemonic/member/set">
        Change the permission of a member of the dataset
        {' '}
        <Code>mnemonic</Code>
        <p>
          You need to have
          <Code>write</Code>
          permission for the dataset for this call to succeed
        </p>
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({
            user: '<sub>',
            permission: '<new permission read, write or none>',
          }, null, 2)}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" action="DATASET_REENCRYPT" path="/dataset/:mnemonic/reencrypt">
        Drop the existing AES encryption key for the dataset and reencrypt it with a
        newly generated key.
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({ key: '<decrypted AES key>' }, null, 2)}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" action="DATASET_RENAME" path="/dataset/:mnemonic/rename">
        Set a new name for the dataset, it is not guaranteed to be unique but can be used for
        searching.
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({ name: '<new name>' }, null, 2)}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" action="DATASET_KEY_FETCH" path="/dataset/:mnemonic/key">
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({ keyHash: 'jg94g....' }, null, 2)}
        </CodeBlock>
        <Code>keyHash</Code>
        {' '}
        is the sha-256 hash of the users public key

        <p className="font-extrabold">Response:</p>
        The response will contain the encrypted AES key.
      </ApiRoute>

      <ApiRoute method="POST" action="UPLOAD_START" path="/upload/start">
        Start the upload of a new dataset
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {JSON.stringify({
            name: 'The name of the uploaded file',
          }, null, 2)}
        </CodeBlock>
        <p className="font-extrabold">Response:</p>
        The response contains the newly created dataset, the size and hash will be null because
        they can only be determined after the upload is complete.
        <CodeBlock>
          {`{
    "mnemonic": <dataset id>,
    "name": <dataset name>,
    "fileName": <name of the file in the dataset>,
    "hash": null,
    "size": null,
    "keyHash": <sha-256 hash of the AES key>,
}`}
        </CodeBlock>

      </ApiRoute>
      <ApiRoute method="PUT" path="/upload/:mnemonic">
        Add a new chunk to the dataset
        <Code>mnemonic</Code>
        <p className="font-extrabold">Request:</p>
        The request is special and needs to be of type
        <Code>multipart/form-data</Code>
        Only a single file is supported and should be part of the form data.
        We also require the HTTP headers
        <Code>Content-Range</Code>
        and
        <Code>Digest</Code>
        .
        <Code>Content-Range</Code>
        should indicate with bytes of the complete file the chunk contains.
        All chunks (except the last one should be 2MiB in size.
        <Code>Digest</Code>
        should be the sha256 hash of the chunk data.
      </ApiRoute>
      <ApiRoute method="POST" action="UPLOAD_FINISH" path="/upload/finish/:mnemonic">
        Finish the upload for the dataset
        <Code>mnemonic</Code>
        No request data is needed, but after this call the upload will be considered
        finished and the size and hash of the dataset
        <Code>mnemonic</Code>
        will be calculated.
      </ApiRoute>

      <ApiRoute method="GET" path="/dataset/:mnemonic/chunk/:chunkHash">
        Download the encrypted data chunk with hash
        <Code>chunkHash</Code>
        {' '}
        for the dataset
        <Code>mnemonic</Code>
        <br />
        The list of chunks and their hashes can be obtained by calling

        {' '}
        <RouteLink path="/dataset/:mnemonic" />
        <p className="font-extrabold">Response:</p>
        <p>
          The chunk of the encrypted data as an
          <Code>application/octet-stream</Code>
          the client is resposible for decrypting the data
        </p>
      </ApiRoute>
      <Title2 className="mt-10">
        <Color>Admin API</Color>
        Reference
      </Title2>
      <ApiRoute method="GET" path="/admin/key/list">
        List all public keys for all users.
        <p className="font-extrabold">Response:</p>
        <CodeBlock>
          {`[{
    "id": <key id>
    "hash": <sha256 hash of the key data>
    "name": <key name>,
    "sub": <key owner>,
    "data": {
        "alg": "RSA-OAEP-256",
        "e": "AQAB",
        "ext": true,
        "key_ops": ["encrypt"],
        "kty": "RSA",
        "n": "<key data>"
    },
    "isRootKey": false,
    "confirmedBy": <admin user or null>,
    "confirmed": <date or null>,
}, ... `}
        </CodeBlock>

      </ApiRoute>
      <ApiRoute method="POST" path="/admin/key/confirm" action="KEY_CONFIRM">
        Set the
        <Code>confirmed</Code>
        flag for a public Key
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {`{
    "keyId": <key id>,
    "confirmed": <true or false>,
}`}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" path="/admin/key/remove" action="KEY_REMOVE">
        Remove a public key.
        <p className="font-extrabold">Request Body:</p>
        <CodeBlock>
          {`{
    "keyId": <key id>,
}`}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="GET" path="/admin/dataset/list">
        List all datasets, including deleted ones.
        <p className="font-extrabold">Response:</p>
        <CodeBlock>
          {`[
  {
    "mnemonic": <dataset id>,
    "name": <dataset name>,
    "fileName": <name of the file in the dataset>,
    "hash": <sha-256 hash of all hashes of chunks>,
    "size": <total size in bytes>,
    "keyHash": <sha-256 hash of the AES key>,
    "deleted": <null or date>,
  }, ...
]`}
        </CodeBlock>
      </ApiRoute>
      <ApiRoute method="POST" path="/admin/dataset/:mnemonic/remove" action="DATASET_REMOVE">
        Remove the dataset
        <Code>mnemonic</Code>
      </ApiRoute>
      <ApiRoute method="POST" path="/admin/dataset/:mnemonic/recover" action="DATASET_RECOVER">
        Recover the dataset
        <Code>mnemonic</Code>
        after it has been deleted.
      </ApiRoute>
      <ApiRoute method="POST" path="/admin/dataset/:mnemonic/destroy" action="DATASET_DESTROY">
        Irreversibly delete the dataset
        <Code>mnemonic</Code>
      </ApiRoute>
      <ApiRoute method="GET" path="/admin/events">
        List all dates that have events.
        <CodeBlock>
          {`
["2022-10-27", "2022-10-26", ...]
          `}
        </CodeBlock>

      </ApiRoute>
      <ApiRoute method="GET" path="/admin/events/:date">
        List all events on the day
        <Code>date</Code>

        <CodeBlock>
          {`[{
"sub": <event user sub>,
"mnemonic": <dataset id>,
"event": <event type>,
"message": <event message>,
"day": <event day>,
"createdAt": <event timestamp>,
}, ...]`}
        </CodeBlock>
      </ApiRoute>
    </Docs>
  );
}

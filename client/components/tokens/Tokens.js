import React, { useEffect, useState, useCallback } from 'react';
import {
  Trash2, Plus, Terminal, Upload,
} from 'react-feather';
import { useApi } from '../api';
import TokenModal from './TokenModal';
import UploadModal from './UploadModal';
import { SmallButton, DeleteButton, LocalDate } from '../util';

function Token({ data, onDelete }) {
  const {
    token, timestamp, lifetime, scopes, id,
  } = data;
  const exp = lifetime + new Date(timestamp).getTime();

  let type = 'API';
  if (scopes.includes('upload')) {
    type = 'Upload';
  }

  const getIcon = () => {
    if (type === 'API') {
      return <Terminal size={24} />;
    }
    return <Upload size={24} />;
  };

  return (
    <div className="flex items-center p-2 m-2 text-sm bg-white border border-gray-300 rounded-xl space-x-4">
      <div className="p-1 border shrink-0 text-sky-700 justify-self-start border-sky-700 rounded-md">
        {getIcon()}
      </div>
      <div>
        <div className="text-lg font-medium text-black">
          {type}
          {' '}
          Token
        </div>
        <p>
          Expires:
          <LocalDate value={exp} />
        </p>
      </div>
      <div className="px-3 font-mono text-lg font-semibold grow">{token}</div>
      <div className="justify-self-end">
        <DeleteButton onClick={() => onDelete(id)}>
          <Trash2 size={24} />
        </DeleteButton>
      </div>
    </div>
  );
}

function Tokens() {
  const api = useApi();
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState(null);

  const fetchTokens = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const result = await api.listTokens();
    if (result.error) {
      return;
    }
    setTokens(result);
  }, [api]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens, token]);

  const generateToken = useCallback(
    async (type) => {
      const result = await api.generateToken(type);
      if (result.error) {
        return;
      }
      setToken(result);
    },
    [api, setToken],
  );

  const removeToken = useCallback(
    async (t) => {
      await api.removeToken(t);
      await fetchTokens();
    },
    [api, fetchTokens],
  );

  return (
    <div>
      {tokens.map((t) => (
        <Token data={t} key={t.token} onDelete={removeToken} />
      ))}
      <SmallButton onClick={() => generateToken('api')}>
        <Plus size={24} className="inline-block" />
        {' '}
        Generate an API Token
      </SmallButton>
      <SmallButton className="ml-3" onClick={() => generateToken('upload')}>
        <Plus size={24} className="inline-block" />
        {' '}
        Generate an Upload Token
      </SmallButton>
      <TokenModal
        token={token}
        isOpen={token && token.type === 'api'}
        onClose={() => setToken(null)}
      />
      <UploadModal
        token={token}
        isOpen={token && token.type === 'upload'}
        onClose={() => setToken(null)}
      />
    </div>
  );
}
export default Tokens;

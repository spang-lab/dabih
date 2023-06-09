import React, { useEffect, useState, useCallback } from 'react';
import { Plus } from 'react-feather';
import { useApi } from '../api';
import TokenModal from './TokenModal';
import UploadModal from './UploadModal';
import { SmallButton } from '../util';

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

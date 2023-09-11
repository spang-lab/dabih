// @ts-nocheck
/* eslint-disable no-console */

'use client';

import { Body } from '@tauri-apps/api/http';
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

const defaultCtx:any = {};
const ApiContext = createContext(defaultCtx);

export function ApiWrapper({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const configFile = 'config/app.conf';

  const loadConfig = async () => {
    const { readTextFile, BaseDirectory } = await import('@tauri-apps/api/fs');
    try {
      const json = await readTextFile(configFile, { dir: BaseDirectory.AppConfig });
      const config = JSON.parse(json);
      setAuth(config);
    } catch (err) {
      // do nothing if config file does not exist
    }
  };

  const writeConfig = async (conf) => {
    const {
      exists, createDir, writeTextFile, BaseDirectory,
    } = await import('@tauri-apps/api/fs');
    const configDir = BaseDirectory.AppConfig;
    const json = JSON.stringify(conf, null, 2);

    const dirExists = await exists('config', { dir: configDir });
    if (!dirExists) {
      await createDir('config', { dir: configDir, recursive: true });
    }

    await writeTextFile(
      configFile,
      json,
      { dir: BaseDirectory.AppConfig },
    );
  };

  const post = useCallback(async (url, body = {}) => {
    const { getClient } = await import('@tauri-apps/api/http');
    const client = await getClient();
    const { baseUrl, token } = auth;
    const fullUrl = `${baseUrl}${url}`;
    return client.post(fullUrl, Body.json(body), {
      headers: {
        Authorization: `Bearer dabih_${token}`,
      },
    });
  }, [auth]);

  const fetchUser = useCallback(async () => {
    if (!auth) {
      setUser(null);
      return;
    }
    const response = await post('/token');
    const { ok, data } = response;
    if (ok) {
      await writeConfig(auth);
      setUser(data);
    } else {
      setUser({
        error: data,
      });
    }
    console.log(response);
  }, [auth, post]);

  const setUrl = useCallback(async (string) => {
    if (!string) {
      setUser(null);
      return;
    }
    try {
      let testUrl = string;
      if (!string.startsWith('http')) {
        testUrl = `https://${string}`;
      }
      const { origin, pathname } = new URL(testUrl);
      const match = pathname.match(/\/ingress\/(.*)/);

      if (!match || !match.length === 2) {
        setUser({
          error: 'pathname did not match regex',
        });
        return;
      }
      const [_, token] = match;
      const baseUrl = `${origin}/api/v1`;
      if (token.length !== 32) {
        setUser({
          error: 'Invalid token',
        });
        return;
      }
      setAuth({ baseUrl, token });
    } catch (err) {
      setUser({
        error: 'Failed to parse url',
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [auth, fetchUser]);

  useEffect(() => {
    loadConfig();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      auth,
      isReady: user && !user.error,
      setUrl,
    }),
    [setUrl, user, auth],
  );

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
}

const useApi = () => useContext(ApiContext);
export default useApi;

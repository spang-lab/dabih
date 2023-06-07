/* eslint-disable no-console */
import axios from 'axios';

export default function create({ router, onError, session }) {
  const api = axios.create();

  const getHeaders = (headers) => {
    if (router && router.query && router.query.token) {
      const { token } = router.query;
      return {
        ...headers,
        Authorization: `Bearer dabih_${token}`,
      };
    }
    if (session && session.accessToken) {
      const { provider, accessToken } = session;
      return {
        ...headers,
        Authorization: `Bearer ${provider}_${accessToken}`,
      };
    }
    return headers;
  };

  const onRequest = (config) => {
    const baseUrl = config.baseUrl || '/api/v1';
    const { url, headers } = config;
    const newUrl = `${baseUrl}${url}`;

    return {
      ...config,
      headers: getHeaders(headers),
      url: newUrl,
    };
  };
  api.interceptors.request.use(onRequest, onError);
  api.interceptors.response.use(
    (r) => r.data,
    (error) => {
      if (error.response.status === 401) {
        router.push('/');
        return { error: 'Unauthorized' };
      }
      const message = error.response.data || error.message;
      onError(message);
      return { error: message };
    },
  );
  return api;
}

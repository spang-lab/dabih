'use client';

import createClient from './api';
let host = process.env.BASE_URL;
if (process.browser) {
  host = window.location.origin;
}
const api = createClient(`${host}/api/v1/`);

export default api;

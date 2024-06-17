import createClient from './api/api';

const baseUrl = `${process.env.BASE_URL}/api/v1`;
const api = createClient(baseUrl);
export default api;



import createClient from "./api";
import { Middleware } from "openapi-fetch";

const api = createClient(`/api/v1/`);
let token: string | null = null;

export const setAPIToken = (newToken: string | null) => {
  token = newToken;
};

const middleware: Middleware = {
  onRequest({ request }) {
    if (!request.headers.has("Authorization") && token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};
api.client.use(middleware);

export default api;

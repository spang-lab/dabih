import { KEY } from "@/Session";
import createClient from "./api";
import { Middleware } from "openapi-fetch";

const api = createClient(`/api/v1/`);

const middleware: Middleware = {
  onRequest({ request }) {
    if (!request.headers.has("Authorization")) {
      const token = window.localStorage.getItem(KEY.token);
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return request;
  },
};
api.client.use(middleware);

export default api;

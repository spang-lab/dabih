import createClient from "./api";
let host = process.env.BASE_URL;
if (typeof window !== "undefined") {
  host = window.location.origin;
}
const api = createClient(`${host}/api/v1/`);

export default api;

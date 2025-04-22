import createClient from "./api";
let host = process.env.BASE_URL;
if (typeof location !== "undefined") {
  host = location.origin;
}
const api = createClient(`${host}/api/v1/`);

export default api;

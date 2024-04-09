import jwt from "jsonwebtoken";
import { requireEnv } from "#lib/env";
import { OpenAPI, TokenService } from "build/client";


const client = () => {
  const port = requireEnv("PORT");
  const tokenSecret = requireEnv("TOKEN_SECRET");
  const host = `http://localhost:${port}`;
  OpenAPI.BASE = `${host}/api/v1`;
  OpenAPI.TOKEN = async () => {
    const admin = {
      sub: "admin",
      scope: "upload key dataset token admin",
      aud: host,
    };
    return jwt.sign(admin, tokenSecret);
  };

  return {
    token: TokenService
  };
}
export default client;






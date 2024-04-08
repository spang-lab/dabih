import jwt from "jsonwebtoken";
import { getEnv, requireEnv } from "#lib/env";
import logger from "#lib/logger";

export default function print() {
  const nodeEnv = getEnv("NODE_ENV", "development");
  if (nodeEnv === "production") {
    return;
  }
  const secret = requireEnv("TOKEN_SECRET");
  const admin = {
    sub: "admin",
    scope: "upload key dataset token admin",
  };
  logger.warn("==== Development access token");
  const token = jwt.sign(admin, secret);
  console.log(token);
  logger.warn("==== Development access token");
}


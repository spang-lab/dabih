import { JWTPayload, SignJWT, decodeJwt } from "jose";

import { StringValue } from "ms";

const decode = (token: string) => decodeJwt(token);

const signWithRSA = (
  data: JWTPayload,
  privateKey: CryptoKey,
  expiresIn?: StringValue,
) => {
  const token = new SignJWT(data)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn ?? "1h")
    .sign(privateKey);
  return token;
};

const jsonWebToken = {
  decode,
  signWithRSA,
};
export default jsonWebToken;

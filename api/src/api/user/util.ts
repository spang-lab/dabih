
import { JsonWebKey } from "crypto";
import crypto from "#crypto";
import { User } from "../types";

export function convertKey(user: User, key: JsonWebKey, isRootKey?: boolean) {
  const { sub, isAdmin } = user;
  const publicKey = crypto.publicKey.fromJwk(key);

  const test_data = crypto.base64url.fromUtf8("Hello World!");
  try {
    crypto.publicKey.encrypt(publicKey, test_data);
  } catch (e) {
    throw new Error('Invalid public key');
  }


  const hash = crypto.publicKey.toHash(publicKey);
  const jwk = crypto.publicKey.toJwk(publicKey);



  return {
    hash,
    data: JSON.stringify(jwk),
    isRootKey: isRootKey ?? false,
    enabled: (isAdmin ? new Date() : null),
    enabledBy: (isAdmin ? sub : null),
  };
}

import { Provider } from "next-auth/providers";
import { CredentialsSignin } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

class NoTokenError extends CredentialsSignin {
  code = "no token";
}
class InvalidTokenError extends CredentialsSignin {
  code = "invalid token";
}

export default function TokenProvider(): Provider {
  return CredentialsProvider({
    name: "Token Provider",
    id: "token",
    credentials: {
      token: { label: "Token", type: "text", placeholder: "JWT" },
    },
    async authorize(credentials) {
      if (!credentials) {
        throw new NoTokenError();
      }
      const { token } = credentials;
      if (!token || typeof token !== "string") {
        throw new NoTokenError();
      }
      const host = process.env.BASE_URL;
      const tokenUrl = `${host}/api/v1/token/info`;
      const response = await fetch(tokenUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(error);
        throw new InvalidTokenError();
      }
      const user = await response.json();

      console.log(user);
      return user;
    },
  });
}

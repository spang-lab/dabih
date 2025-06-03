import { CredentialsSignin } from "next-auth";
import { Provider } from "next-auth/providers";

import CredentialsProvider from "next-auth/providers/credentials";

class InvalidLoginError extends CredentialsSignin {
  code = "invalid name";
}

export default function DemoProvider(): Provider {
  return CredentialsProvider({
    name: "Demo Provider",
    id: "demo",
    credentials: {
      name: { label: "Username", type: "text", placeholder: "Demo User" },
    },
    authorize(credentials) {
      if (!credentials) {
        throw new InvalidLoginError();
      }
      const { name } = credentials;
      if (!name || typeof name !== "string") {
        throw new InvalidLoginError();
      }
      const maxLength = 20;
      const isAdmin = name.toLowerCase().includes("admin");

      const short = name.substring(0, maxLength);
      const id = short
        .trim()
        .replace(/\s+/, "_")
        .replace(/[^a-zA-Z0-9_]/g, "")
        .toLowerCase();
      const scopes = ["dabih:api", "dabih:upload"];
      if (isAdmin) {
        scopes.push("dabih:admin");
      }

      return {
        id,
        sub: id,
        scopes,
        isAdmin,
      };
    },
  });
}

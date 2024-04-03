export interface User {
  id: number;
  email: string;
  name: string;
  status?: "Happy" | "Sad";
  phoneNumbers: string[];
}

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

const get = (id: number, name?: string): User => {
  return {
    id,
    email: "jane@doe.com",
    name: name ?? "Jane Doe",
    status: "Happy",
    phoneNumbers: [],
  };
}

const create = (userCreationParams: UserCreationParams): User => {
  return {
    id: Math.floor(Math.random() * 10000), // Random
    status: "Happy",
    ...userCreationParams,
  };
}

export const user = {
  get,
  create,
};

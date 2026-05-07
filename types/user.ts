export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
};

export type PublicUser = Omit<User, "password">;

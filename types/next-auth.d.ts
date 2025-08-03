import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User;

declare module "next-auth/jwt" {
  interface JWT {
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

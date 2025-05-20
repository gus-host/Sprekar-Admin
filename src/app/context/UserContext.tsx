"use client";

import { createContext, useContext } from "react";
import { User } from "../dashboard/_partials/ProfileImgGetter";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error("useUser must be inside a <UserProvider>");
  }
  return ctx;
}

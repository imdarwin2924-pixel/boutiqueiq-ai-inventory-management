import { useContext } from "react";

import {
  AuthContext,
  type AuthContextType,
} from "../contexts/context";

export function useAuth(): AuthContextType & {
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
} {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  const role =
    context.user?.role_name?.trim().toLowerCase();

  return {
    ...context,

    isAdmin: role === "admin",

    isManager: role === "manager",

    isStaff: role === "staff",
  };
}
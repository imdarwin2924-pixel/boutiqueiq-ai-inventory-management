import {
  createContext,
} from "react";

import type {
  CurrentUser,
} from "../services/authService";

export interface AuthContextType {
  token: string | null;

  user: CurrentUser | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );
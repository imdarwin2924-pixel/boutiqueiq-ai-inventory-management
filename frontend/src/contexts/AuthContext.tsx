import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { login as loginService } from "../services/authService";
import {
  getToken,
  removeToken,
} from "../utils/auth";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    getToken()
  );

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const response = await loginService({
      username: email,
      password,
    });

    setToken(response.access_token);
  };

  const logout = (): void => {
    removeToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: token !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
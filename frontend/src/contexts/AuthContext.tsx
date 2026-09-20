import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginService,
  getCurrentUser,
  type CurrentUser,
} from "../services/authService";

import {
  getToken,
  removeToken,
} from "../utils/auth";

import {
  AuthContext,
} from "./context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    getToken()
  );

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  /*
   * Load current user when an existing token
   * is found.
   */
  useEffect(() => {
    const loadCurrentUser = async () => {
      const existingToken = getToken();

      if (!existingToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
        setToken(existingToken);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );

        removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  /*
   * Login user and load complete user information,
   * including role information.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const response =
      await loginService({
        username: email,
        password,
      });

    setToken(response.access_token);

    const currentUser =
      await getCurrentUser();

    setUser(currentUser);
  };

  /*
   * Logout user.
   */
  const logout = (): void => {
    removeToken();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: token !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
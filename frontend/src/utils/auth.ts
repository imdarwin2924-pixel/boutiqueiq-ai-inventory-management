const TOKEN_KEY = "boutiqueiq_access_token";

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export interface JwtPayload {
  sub?: string;
  exp?: number;
}

export const getCurrentUserEmail = (): string | null => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decodedPayload = JSON.parse(
      atob(payload)
    ) as JwtPayload;

    return decodedPayload.sub ?? null;
  } catch (error) {
    console.error(
      "Failed to decode JWT:",
      error
    );

    return null;
  }
};
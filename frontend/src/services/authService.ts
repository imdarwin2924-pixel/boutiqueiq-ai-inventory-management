import api from "./api";
import { saveToken } from "../utils/auth";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CurrentUser {
  user_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  role_id: number;
  role_name: string;
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();

  formData.append(
    "username",
    credentials.username
  );

  formData.append(
    "password",
    credentials.password
  );

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  saveToken(response.data.access_token);

  return response.data;
};

export const getCurrentUser =
  async (): Promise<CurrentUser> => {
    const response =
      await api.get<CurrentUser>("/auth/me");

    return response.data;
  };
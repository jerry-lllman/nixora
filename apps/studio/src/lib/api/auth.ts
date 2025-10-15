// 认证相关 API
import { axiosInstance } from "./axios";
import type {
  AuthTokenResponse,
  LoginRequest,
  RegisterRequest,
  SafeUser,
} from "./types";

export const authApi = {
  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<SafeUser> {
    const response = await axiosInstance.post<SafeUser>("/auth/register", data);
    return response.data;
  },

  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<AuthTokenResponse> {
    const response = await axiosInstance.post<AuthTokenResponse>(
      "/auth/login",
      data
    );
    // 保存 token 到 localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;
  },

  /**
   * 获取当前用户信息
   */
  async getProfile(): Promise<SafeUser> {
    const response = await axiosInstance.get<SafeUser>("/auth/profile");
    return response.data;
  },

  /**
   * 退出登录
   */
  logout(): void {
    localStorage.removeItem("accessToken");
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },
};

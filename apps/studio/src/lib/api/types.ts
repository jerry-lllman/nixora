// API 类型定义
export interface SafeUser {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: string;
  tokenType: "Bearer";
  user: SafeUser;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Canvas 相关类型
export interface Canvas {
  id: string;
  title: string;
  components: any[];
  description?: string;
  isPublished: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCanvasRequest {
  title: string;
  components: any[];
  description?: string;
  isPublished?: boolean;
}

export interface UpdateCanvasRequest {
  title?: string;
  components?: any[];
  description?: string;
  isPublished?: boolean;
}

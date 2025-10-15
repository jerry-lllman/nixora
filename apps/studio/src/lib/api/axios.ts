// Axios 配置和拦截器
import axios, { type AxiosError } from "axios";
import type { ApiError } from "./types";

// 全局变量声明
declare const API_BASE_URL: string;

const API_PREFIX = '/api'

// 创建 axios 实例
export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10秒超时
});

// 请求拦截器：自动添加 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// 后端统一响应格式
interface ApiResponse<T> {
  success: boolean;
  data: T;
  path: string;
  timestamp: string;
}

// 响应拦截器：解包响应数据 + 统一错误处理
axiosInstance.interceptors.response.use(
  (response) => {
    // 如果响应数据是包装格式，解包返回实际数据
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      const wrappedData = response.data as ApiResponse<unknown>;
      response.data = wrappedData.data;
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // 401 未授权，清除 token
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // 可以在这里触发跳转到登录页
      // window.location.href = '/login';
    }

    // 格式化错误信息
    const rawMessage = error.response?.data.message ?? error.message;
    const errorMessage: string = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : rawMessage;

    return Promise.reject(new Error(errorMessage));
  }
);

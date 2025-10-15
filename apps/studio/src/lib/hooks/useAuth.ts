// 认证相关的 React Query hooks
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import type { LoginRequest, RegisterRequest } from "../api/types";

// Query Keys
export const authKeys = {
  profile: ["auth", "profile"] as const,
};

/**
 * 获取当前用户信息
 */
export function useProfile() {
  const hasToken = !!localStorage.getItem("accessToken");
  
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      console.log("useProfile: 开始获取用户信息");
      return authApi.getProfile();
    },
    enabled: hasToken, // 有 token 时才启用
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟内认为数据是新鲜的
    gcTime: 10 * 60 * 1000, // 缓存时间 10 分钟
  });
}

/**
 * 登录 mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      console.log("登录成功，开始处理跳转...", response);

      // 直接设置用户信息到缓存，不需要 invalidate
      queryClient.setQueryData(authKeys.profile, response.user);
      console.log("已设置用户缓存", response.user);

      // 使用 setTimeout 确保状态更新后再跳转
      setTimeout(() => {
        console.log("准备跳转到 /builder");
        navigate("/builder", { replace: true });
      }, 100);
    },
    onError: (error) => {
      console.error("登录失败:", error);
    },
  });
}

/**
 * 注册 mutation
 */
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      // 注册成功后跳转到登录页
      navigate("/login");
    },
  });
}

/**
 * 退出登录
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      authApi.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // 清除所有缓存
      queryClient.clear();
      // 跳转到登录页
      navigate("/login");
    },
  });
}

import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthContext } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const hasToken = !!localStorage.getItem("accessToken");

  console.log("ProtectedRoute 检查:", {
    isAuthenticated,
    isLoading,
    hasToken,
    hasUser: !!user,
    user
  });

  // 没有 token，直接跳转到登录页
  if (!hasToken) {
    console.log("ProtectedRoute: 没有 token，重定向到登录页");
    return <Navigate to="/login" replace />;
  }

  // 有 token 但正在加载用户信息
  if (hasToken && isLoading) {
    console.log("ProtectedRoute: 有 token，正在加载用户信息...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-900 dark:text-white">加载中...</div>
      </div>
    );
  }

  // 有 token 但加载完成后发现没有用户信息（token 可能过期）
  if (hasToken && !isLoading && !isAuthenticated) {
    console.log("ProtectedRoute: token 可能过期，重定向到登录页");
    return <Navigate to="/login" replace />;
  }

  // 已认证，显示受保护的内容
  console.log("ProtectedRoute: 已认证，显示受保护的内容");
  return <>{children}</>;
}

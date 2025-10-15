// 认证上下文
import { createContext, ReactNode, useContext } from "react";
import type { SafeUser } from "../lib/api/types";
import { useProfile } from "../lib/hooks/useAuth";

interface AuthContextValue {
  user: SafeUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isFetching, error, status } = useProfile();
  const hasToken = !!localStorage.getItem("accessToken");

  console.log("AuthProvider 状态:", {
    user,
    isLoading,
    isFetching,
    status,
    error,
    hasToken,
    isAuthenticated: !!(hasToken && user)
  });

  // 如果有 token 且有 user 数据，认为是已认证状态
  const isAuthenticated = hasToken && !!user;

  // 只有在初次加载且有 token 时才显示 loading
  // 如果已经有数据了，就不显示 loading
  const loading = hasToken && !user && (isLoading || isFetching);

  const value: AuthContextValue = {
    user,
    isLoading: loading,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

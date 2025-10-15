// React Query 客户端配置
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 失败重试1次
      refetchOnWindowFocus: false, // 窗口聚焦时不自动重新请求
      staleTime: 5 * 60 * 1000, // 5分钟内数据不过期
    },
    mutations: {
      retry: 0, // mutation 不重试
    },
  },
});

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  path: string;
  timestamp: string;
  message?: string;
  meta?: Record<string, unknown>;
}

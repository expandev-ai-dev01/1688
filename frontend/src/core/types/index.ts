export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface ApiValidationErrorDetail {
  field?: string;
  message: string;
  rule?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiValidationErrorDetail[];
}

export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiMessageDataResponse<T> extends ApiMessageResponse {
  data: T;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage?: number;
  firstPage?: number;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

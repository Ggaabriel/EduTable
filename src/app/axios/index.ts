import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

export enum ApiErrorCode {
  NETWORK = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  HTTP = "HTTP_ERROR",
  UNKNOWN = "UNKNOWN",
}

export interface ApiError {
  message: string;
  status?: number;
  code?: ApiErrorCode; // например 'NETWORK_ERROR', 'TIMEOUT', 'UNAUTHORIZED'
  original?: Error | AxiosError;
  isNetworkError?: boolean;
}
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T
}

interface ServerError {
  message?: string;
  error?: string;
  detail?: string;
  code?: string;
}

const baseURL = import.meta.env.VITE_API_BASE || undefined;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize axios error to ApiError
function normalizeError(error: Error | AxiosError): ApiError {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError;

    // Network error (no response)
    if (!ax.response) {
      return {
        message: ax.message || "Сетевая ошибка. Проверьте подключение.",
        code: ApiErrorCode.NETWORK,
        isNetworkError: true,
        original: ax,
      };
    }

    const status = ax.response.status;
    const data = ax.response.data as ServerError;
    const serverMsg = data && (data.message || data.error || data.detail);

    // Timeout
    if (ax.code === "ECONNABORTED") {
      return {
        message: "Превышено время ожидания запроса.",
        status,
        code: ApiErrorCode.TIMEOUT,
        original: ax,
      };
    }

    return {
      message: serverMsg || `Ошибка ${status}`,
      status,
      code: ApiErrorCode.HTTP,
      original: ax,
    };
  } else {
    // Unknown error
    return {
      message: (error as Error)?.message || "Неизвестная ошибка",
      code: ApiErrorCode.UNKNOWN,
      original: error,
    };
  }
}

// Обёртка для вызовов — возвращает уже распарсенный data или выбрасывает ApiError
export async function request<T = unknown>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    const res: AxiosResponse = await axiosInstance.request<T>(config);
    return res.data;
  } catch (e) {
    const catchError = e as Error | AxiosError;
    const err = normalizeError(catchError);
    // Логирование можно оставить для dev
    if (import.meta.env.DEV) console.error("API ERROR", err);
    throw err;
  }
}

// Экспорт самого инстанса если нужно (для multipart, progress и т.д.)
export { axiosInstance };

// Экспорт типов и функций
export default request;
